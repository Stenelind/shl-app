const { db } = require('../../services');
const { sendResponse, sendError } = require('../../responses');

module.exports.handler = async (event) => {
    try {
        let teams;
        if (event.body) {
            teams = JSON.parse(event.body).teams;
        } else {
            teams = event.teams;
        }
        if (!teams || !Array.isArray(teams)) {
            console.warn('Ogiltig eller saknad lista av lag');
            return sendError(400, { message: 'Ogiltig eller saknad lista av lag.' });
        }
        for (let team of teams) {
            const { teamName, abbreviation } = team;  
            if (!teamName || !abbreviation) {
                console.warn(`Hoppar över laget på grund av saknat namn eller förkortning: ${teamName}`);
                continue; 
            }
            const existingTeam = await db.get({
                TableName: 'shl-teams',
                Key: { teamName: teamName } 
            });

            if (existingTeam.Item) {
                console.log(`Laget ${teamName} finns redan, hoppar över.`);
                continue; 
            }

            const params = {
                TableName: 'shl-teams',
                Item: {
                    teamName: teamName,  
                    abbreviation: abbreviation 
                }
            };

            console.log('DynamoDB-parametrar:', JSON.stringify(params));  

            await db.put(params);
        }

        console.log('Alla giltiga lag har lagts till framgångsrikt');
        return sendResponse(201, { message: 'Lag har lagts till framgångsrikt.' });
    } catch (error) {
        console.error('Fel vid tillägg av lag:', error);
        return sendError(500, { message: 'Serverfel', error: error.message });
    }
};
