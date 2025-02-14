const { db } = require('../../services');
const { sendResponse, sendError } = require('../../responses');

module.exports.handler = async (event) => {
    try {
        console.log('Received event:', event);

        let teams;
        if (event.body) {
            teams = JSON.parse(event.body).teams;
        } else {
            teams = event.teams;
        }

        console.log('Parsed teams:', teams);

        if (!teams || !Array.isArray(teams)) {
            console.warn('Invalid or missing teams array');
            return sendError(400, { message: 'Invalid or missing teams array in body.' });
        }

        for (let team of teams) {
            const { teamName, abbreviation } = team;  
            if (!teamName || !abbreviation) {
                console.warn(`Skipping team due to missing name or abbreviation: ${teamName}`);
                continue; 
            }

            console.log(`Preparing to add team: ${teamName}, abbreviation: ${abbreviation}`);

            const existingTeam = await db.get({
                TableName: 'shl-teams',
                Key: { teamName: teamName } 
            });

            if (existingTeam.Item) {
                console.log(`Team ${teamName} already exists, skipping.`);
                continue; 
            }

            const params = {
                TableName: 'shl-teams',
                Item: {
                    teamName: teamName,  
                    abbreviation: abbreviation 
                }
            };

            console.log('DynamoDB params:', JSON.stringify(params));  

            await db.put(params);
        }

        console.log('All valid teams added successfully');
        return sendResponse(201, { message: 'Teams added successfully.' });
    } catch (error) {
        console.error('Error adding teams:', error);
        return sendError(500, { message: 'Internal Server Error', error: error.message });
    }
};
