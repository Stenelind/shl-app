// functions/get/index.js
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async () => {
  try {
    const existingMatches = await db.scan({ TableName: 'shl-matches' }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ matches: existingMatches.Items })
    };

  } catch (error) {
    console.error('Fel vid hämtning av matcher:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};

