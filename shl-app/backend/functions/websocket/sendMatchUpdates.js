const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: 'https://fek2ztehw3.execute-api.eu-north-1.amazonaws.com/dev/'
});

const sendMatchUpdates = async (matches, actionType = "new_matches") => {
  const connectionsData = await db.scan({ TableName: 'WebSocketConnections' }).promise();
  const connectionIds = connectionsData.Items.map(item => item.connectionId);
  if (connectionIds.length === 0) return;

  const message = { action: actionType, matches: Array.isArray(matches) ? matches : [matches] };

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

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { matchid, poangLag1, poangLag2, isNew, matches } = body;

  if (isNew && matches) {
    await Promise.all(matches.map(match => 
      db.put({ TableName: 'shl-matches', Item: match }).promise()
    ));
    await sendMatchUpdates(matches, "new_matches");
    return { statusCode: 201, body: "Nya matcher skapade!" };
  }

  if (!isNew && matchid) {
    await db.update({
      TableName: 'shl-matches',
      Key: { matchid },
      UpdateExpression: 'SET poangLag1 = :p1, poangLag2 = :p2',
      ExpressionAttributeValues: { ':p1': poangLag1, ':p2': poangLag2 },
      ConditionExpression: 'attribute_exists(matchid)'
    }).promise();

    const updatedMatch = await db.get({
      TableName: 'shl-matches', Key: { matchid }
    }).promise();

    await sendMatchUpdates(updatedMatch.Item, "update_match");
    return { statusCode: 200, body: "Matchen uppdaterad!" };
  }

  return { statusCode: 400, body: "Felaktiga parametrar" };
};
