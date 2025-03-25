const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: 'https://fek2ztehw3.execute-api.eu-north-1.amazonaws.com/dev/'
});

const sendMatchUpdates = async (match) => {
  try {
    const { Items: connections } = await db.scan({
      TableName: 'WebSocketConnections',
      ProjectionExpression: 'connectionId'
    }).promise();

    if (!connections.length) return;

    const message = JSON.stringify({ action: "update_match", matches: [match] });

    const sendPromises = connections.map(({ connectionId }) =>
      apiGatewayManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: message
      }).promise()
      .catch(async (err) => {
        if (err.statusCode === 410) {
          await db.delete({ TableName: 'WebSocketConnections', Key: { connectionId } }).promise();
        } else {
          console.error(`WebSocket error for ${connectionId}:`, err);
        }
      })
    );

    await Promise.allSettled(sendPromises);
  } catch (error) {
    console.error("Error sending match updates:", error);
  }
};

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { matchid, poangLag1, poangLag2 } = body;

    if (!matchid) {
      return { statusCode: 400, body: JSON.stringify({ message: "Matchid saknas!" }) };
    }

    await db.update({
      TableName: 'shl-matches',
      Key: { matchid },
      UpdateExpression: 'SET poangLag1 = :p1, poangLag2 = :p2',
      ExpressionAttributeValues: { ':p1': poangLag1, ':p2': poangLag2 },
      ConditionExpression: 'attribute_exists(matchid)'
    }).promise();

    const { Item: updatedMatch } = await db.get({
      TableName: 'shl-matches',
      Key: { matchid }
    }).promise();

    if (updatedMatch) {
      await sendMatchUpdates(updatedMatch);
    }

    return { statusCode: 200, body: JSON.stringify({ message: "Match uppdaterad!" }) };
  } catch (error) {
    console.error("Handler error:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Serverfel", error: error.message }) };
  }
};
