const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const tableName = 'WebSocketConnections';

  await db.delete({
    TableName: tableName,
    Key: { connectionId }
  }).promise();

  return {
    statusCode: 200,
    body: 'Disconnected.'
  };
};
