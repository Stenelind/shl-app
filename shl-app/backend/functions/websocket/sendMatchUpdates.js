const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: 'https://fek2ztehw3.execute-api.eu-north-1.amazonaws.com/dev/'
});

const sendMatchUpdates = async (matches, actionType = "new_matches") => {
  try {
    const { Items: connections } = await db.scan({
      TableName: 'WebSocketConnections',
      ProjectionExpression: 'connectionId'
    }).promise();

    if (!connections.length) return;

    const message = JSON.stringify({ action: actionType, matches: Array.isArray(matches) ? matches : [matches] });

    const sendPromises = connections.map(({ connectionId }) => 
      apiGatewayManagementApi.postToConnection({ ConnectionId: connectionId, Data: message }).promise()
        .catch(async (err) => {
          if (err.statusCode === 410) {
            await db.delete({ TableName: 'WebSocketConnections', Key: { connectionId } }).promise();
          } else {
            console.error(`WebSocket error for ${connectionId}:`, err);
          }
        })
    );

    await Promise.all(sendPromises);
  } catch (error) {
    console.error("Error sending match updates:", error);
  }
};

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { matchid, poangLag1, poangLag2, isNew, matches } = body;

    if (isNew && Array.isArray(matches) && matches.length) {
      const putRequests = matches.map(match => ({
        PutRequest: { Item: match }
      }));

      await db.batchWrite({ RequestItems: { 'shl-matches': putRequests } }).promise();
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

      const { Item: updatedMatch } = await db.get({ TableName: 'shl-matches', Key: { matchid } }).promise();
      if (updatedMatch) {
        await sendMatchUpdates(updatedMatch, "update_match");
      }

      return { statusCode: 200, body: "Matchen uppdaterad!" };
    }

    return { statusCode: 400, body: "Felaktiga parametrar" };
  } catch (error) {
    console.error("Handler error:", error);
    return { statusCode: 500, body: "Serverfel" };
  }
};
