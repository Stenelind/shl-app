const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: 'wss://2yy8062sbk.execute-api.eu-north-1.amazonaws.com/dev' 
});

module.exports.handler = async (event) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));

        const { matchid, poangLag1, poangLag2 } = event;

        const matchData = await db.get({
            TableName: 'shl-matches',
            Key: { matchid }
        }).promise();

        if (!matchData.Item) {
            console.warn('Match not found:', matchid);
            return { statusCode: 404, body: 'Match not found' };
        }

        console.log('Fetched match data:', JSON.stringify(matchData.Item, null, 2));

        await db.update({
            TableName: 'shl-matches',
            Key: { matchid },
            UpdateExpression: 'SET poangLag1 = :poang1, poangLag2 = :poang2',
            ExpressionAttributeValues: {
                ':poang1': poangLag1,
                ':poang2': poangLag2
            }
        }).promise();

        console.log(`Updated match ${matchid}: poangLag1=${poangLag1}, poangLag2=${poangLag2}`);

        const connectionsData = await db.scan({ TableName: 'WebSocketConnections' }).promise();
        const connectionIds = connectionsData.Items.map(item => item.connectionId);

        if (connectionIds.length === 0) {
            console.warn('No active WebSocket connections.');
            return { statusCode: 200, body: 'No active connections' };
        }

        const message = {
            matchid,
            lag1: matchData.Item.lag1,
            lag2: matchData.Item.lag2,
            poangLag1,
            poangLag2,
            matchResult: matchData.Item.matchResult
        };

        console.log('Message to send:', JSON.stringify(message, null, 2));

        const sendPromises = connectionIds.map(connectionId => {
            return apiGatewayManagementApi.postToConnection({
                ConnectionId: connectionId,
                Data: JSON.stringify(message)
            }).promise();
        });

        await Promise.all(sendPromises);

        console.log('All messages sent successfully.');
        return { statusCode: 200, body: 'Match updated and message sent.' };

    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: 'Failed to update match and send message' };
    }
};
