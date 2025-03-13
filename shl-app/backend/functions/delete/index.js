const AWS = require('aws-sdk');
const { sendResponse, sendError } = require('../../responses');

const db = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async () => {
  try {
    // Hämta alla matcher från databasen
    const matches = await db.scan({ TableName: 'shl-matches' }).promise();

    if (matches.Items.length === 0) {
      return sendResponse(200, { message: "Databasen är redan tom." });
    }

    // Ta bort alla matcher
    const deleteMatches = matches.Items.map(match => {
      return db.delete({
        TableName: 'shl-matches',
        Key: { matchid: match.matchid }
      }).promise();
    });

    await Promise.all(deleteMatches);

    return sendResponse(200, { message: "Alla matcher har raderats." });
  } catch (error) {
    console.error("❌ Fel vid radering:", error);
    return sendError(500, { message: `Internal Server Error: ${error.message}` });
  }
};
