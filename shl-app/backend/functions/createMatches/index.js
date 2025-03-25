const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const db = new AWS.DynamoDB.DocumentClient();
const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: 'https://fek2ztehw3.execute-api.eu-north-1.amazonaws.com/dev/'
});

const sendMatchUpdates = async (matches) => {
  const connectionsData = await db.scan({ TableName: 'WebSocketConnections' }).promise();
  const connectionIds = connectionsData.Items.map(item => item.connectionId);
  if (connectionIds.length === 0) return;

  const message = { action: "new_matches", matches };

  await Promise.all(connectionIds.map(async (connectionId) => {
    try {
      await apiGatewayManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(message)
      }).promise();
    } catch (err) {
      if (err.statusCode === 410) {
        await db.delete({ TableName: 'WebSocketConnections', Key: { connectionId } }).promise();
      }
    }
  }));
};

module.exports.handler = async () => {
  try {
    const teamsData = await db.scan({ TableName: 'shl-teams' }).promise();
    
    if (teamsData.Items.length < 2) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Not enough teams.' })
      };
    }

    const shuffledTeams = teamsData.Items.sort(() => Math.random() - 0.5);
    const matchesToCreate = [];

    for (let i = 0, order = 1; i < Math.min(shuffledTeams.length, 14); i += 2, order++) {
      if (i + 1 < shuffledTeams.length) {
        const match = {
          matchid: `${order}-${uuidv4().slice(0, 4)}`, 
          matchNumber: order, 
          lag1: shuffledTeams[i].teamName,
          lag1Abbreviation: shuffledTeams[i].abbreviation,
          lag2: shuffledTeams[i + 1].teamName,
          lag2Abbreviation: shuffledTeams[i + 1].abbreviation,
          poangLag1: 0,
          poangLag2: 0,
          createdAt: Date.now(),
          matchResult: "not_played"
        };
        matchesToCreate.push(match);
      }
    }
    
    await Promise.all(matchesToCreate.map(match =>
      db.put({ TableName: 'shl-matches', Item: match }).promise()
    ));

    await sendMatchUpdates(matchesToCreate);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Matches created.', matches: matchesToCreate })
    };

  } catch (error) {
    console.error('Fel vid skapande av matcher:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};
