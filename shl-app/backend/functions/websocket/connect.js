const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        // Logga hela eventet för felsökning
        console.log('Received event:', JSON.stringify(event, null, 2));

        // Kontrollera om requestContext finns och om connectionId är tillgängligt
        const connectionId = event.requestContext && event.requestContext.connectionId;

        if (!connectionId) {
            console.error('Connection ID not found.');
            return {
                statusCode: 400,
                body: 'Connection ID is missing.',
            };
        }

        console.log(`New connection: ${connectionId}`);

        // Lägg till anslutningen i DynamoDB
        await db.put({
            TableName: 'WebSocketConnections',
            Item: {
                connectionId: connectionId,  // använd connectionId som primärnyckel
                timestamp: new Date().toISOString(), // Lägg till timestamp om du vill hålla koll på anslutningstiden
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
