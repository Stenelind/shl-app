const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const tableName = 'WebSocketConnections';

  await db.put({
    TableName: tableName,
    Item: { connectionId }
  }).promise();

  return {
    statusCode: 200,
    body: 'Connected.'
  };
};
