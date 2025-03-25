const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2));
        const connectionId = event.requestContext && event.requestContext.connectionId;

        if (!connectionId) {
            console.error('Connection ID not found.');
            return {
                statusCode: 400,
                body: 'Connection ID is missing.',
            };
        }
        console.log(`New connection: ${connectionId}`);
        await db.put({
            TableName: 'WebSocketConnections',
            Item: {
                connectionId: connectionId,  
                timestamp: new Date().toISOString(), 
            },
        }).promise();

        console.log(`Connection added: ${connectionId}`);

        return {
            statusCode: 200,
            body: 'Connected.',
        };
    } catch (error) {
        console.error('Error adding connection:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to add connection', error: error.message }),
        };
    }
};
