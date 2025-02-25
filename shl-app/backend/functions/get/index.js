const AWS = require('aws-sdk');
const { sendResponse, sendError } = require('../../responses');
const { v4: uuidv4 } = require('uuid');

const db = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async () => {
  try {
    // Försök hämta matcher från databasen
    const result = await db.scan({ TableName: 'shl-matches' }).promise();

    if (result.Items.length > 0) {
      // Om det finns matcher, returnera dem
      return sendResponse(200, { message: 'Matches retrieved successfully.', matches: result.Items });
    }

    // Om det inte finns några matcher, skapa nya matcher

    // Hämta lag
    const teamsData = await db.scan({ TableName: 'shl-teams' }).promise();

    if (teamsData.Items.length < 2) {
      return sendError(400, { message: 'Not enough teams to create matches.' });
    }

    const matchesToCreate = [];
    const shuffledTeams = [...teamsData.Items];

    // Blanda lagen slumpmässigt
    for (let i = shuffledTeams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTeams[i], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i]];
    }

    // Skapa matcher för de blandade lagen
    for (let i = 0; i < shuffledTeams.length; i += 2) {
      if (i + 1 < shuffledTeams.length) {
        const team1 = shuffledTeams[i];
        const team2 = shuffledTeams[i + 1];

        const match = {
          matchid: uuidv4().slice(0, 4), // Generera unikt ID
          lag1: team1.teamName,
          lag1Abbreviation: team1.abbreviation,
          lag2: team2.teamName,
          lag2Abbreviation: team2.abbreviation,
          poangLag1: 0,
          poangLag2: 0,
          tid: new Date().toISOString(),
          matchResult: 'not_played'
        };

        matchesToCreate.push(match);
      }
    }

    // Spara de nya matcherna i databasen
    const promises = matchesToCreate.map(match => {
      const params = {
        TableName: 'shl-matches',
        Item: match
      };
      return db.put(params).promise();
    });

    await Promise.all(promises);

    return sendResponse(201, { message: 'New matches created successfully.', matches: matchesToCreate });
  } catch (error) {
    console.error('Error handling matches:', error);
    return sendError(500, { message: `Internal Server Error: ${error.message}` });
  }
};
