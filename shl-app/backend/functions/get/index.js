const AWS = require('aws-sdk');
const { sendResponse, sendError } = require('../../responses');
const { v4: uuidv4 } = require('uuid');

const db = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async () => {
  try {
    
    const oldMatches = await db.scan({ TableName: 'shl-matches' }).promise();
    const deletePromises = oldMatches.Items.map(match => {
      const params = {
        TableName: 'shl-matches',
        Key: { matchid: match.matchid }
      };
      return db.delete(params).promise();
    });

    await Promise.all(deletePromises);

    const data = await db.scan({ TableName: 'shl-teams' }).promise();

    if (data.Items.length < 2) {
      return sendError(400, { message: 'Not enough teams to create matches.' });
    }

    const matchesToCreate = [];

    const shuffledTeams = [...data.Items];
    for (let i = shuffledTeams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTeams[i], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i]];
    }

    for (let i = 0; i < shuffledTeams.length; i += 2) {
      if (i + 1 < shuffledTeams.length) {
        const team1 = shuffledTeams[i];
        const team2 = shuffledTeams[i + 1];

        const match = {
          matchid: uuidv4().slice(0, 4), 
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

    const promises = matchesToCreate.map(match => {
      const params = {
        TableName: 'shl-matches',
        Item: match
      };
      return db.put(params).promise();
    });

    await Promise.all(promises);

    return sendResponse(201, { message: 'All matches created successfully.', matches: matchesToCreate });
  } catch (error) {
    console.error('Error creating matches:', error);
    return sendError(500, { message: `Internal Server Error: ${error.message}` });
  }
};
