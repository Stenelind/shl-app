const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: 'https://fek2ztehw3.execute-api.eu-north-1.amazonaws.com/dev'
});


module.exports.handler = async (event) => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const body = JSON.parse(event.body);

    // 🟢 Hantera "ping" från WebSocket
    if (body.action === "ping") {
      console.log("Ping mottagen, returnerar 200.");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Pong!" })
      };
    }

    const matchid = String(body.matchid);
    const { poangLag1, poangLag2 } = body;

    // 🟢 Kontrollera att alla nödvändiga data finns
    if (!matchid || poangLag1 === undefined || poangLag2 === undefined) {
      console.warn('Saknas nödvändiga parametrar:', body);
      return { statusCode: 400, body: 'Matchid och poäng för båda lagen måste anges' };
    }

    // 🟢 Hämta matchdata från DynamoDB
    const matchData = await db.get({
      TableName: 'shl-matches',
      Key: { matchid }
    }).promise();

    if (!matchData.Item) {
      console.warn('Match ej funnen:', matchid);
      return { statusCode: 404, body: 'Match ej funnen' };
    }
    console.log('Hämtad matchdata:', JSON.stringify(matchData.Item, null, 2));

    try {
      // 🟢 Korrigerad UpdateExpression och AttributeValues
      await db.update({
        TableName: 'shl-matches',
        Key: { matchid },
        UpdateExpression: 'SET poangLag1 = :poang1, poangLag2 = :poangLag2',
        ExpressionAttributeValues: {
          ':poang1': poangLag1,
          ':poangLag2': poangLag2  // 🟢 Här är den viktiga ändringen!
        },
        ConditionExpression: 'attribute_exists(matchid)'
      }).promise();

      console.log(`Match ${matchid} uppdaterades: poangLag1=${poangLag1}, poangLag2=${poangLag2}`);

      // 🟢 Hämta den uppdaterade matchdata
      const updatedMatchData = await db.get({
        TableName: 'shl-matches',
        Key: { matchid }
      }).promise();

      console.log('Uppdaterad matchdata:', JSON.stringify(updatedMatchData.Item, null, 2));
    } catch (updateError) {
      console.error('Fel vid uppdatering:', updateError);
      return { statusCode: 500, body: `Fel vid uppdatering: ${updateError.message}` };
    }

    // 🟢 Hämta alla aktiva WebSocket-anslutningar
    const connectionsData = await db.scan({
      TableName: 'WebSocketConnections'
    }).promise();

    const connectionIds = connectionsData.Items.map(item => item.connectionId);
    if (connectionIds.length === 0) {
      console.warn('Inga aktiva WebSocket-anslutningar.');
      return { statusCode: 200, body: 'Match uppdaterad, inga WebSocket-anslutningar.' };
    }

    // 🟢 Förbered meddelandet att skicka
    const message = {
      matchid,
      lag1: matchData.Item.lag1,
      lag2: matchData.Item.lag2,
      poangLag1,
      poangLag2,
      matchResult: matchData.Item.matchResult
    };

    console.log('Meddelande att skicka:', JSON.stringify(message, null, 2));

    // 🟢 Skicka meddelande till alla aktiva WebSocket-anslutningar
    const sendPromises = connectionIds.map(async (connectionId) => {
      try {
        await apiGatewayManagementApi.postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify(message)
        }).promise();
        console.log(`Meddelande skickat till ${connectionId}`);
      } catch (err) {
        console.error(`Fel vid skickande till ${connectionId}:`, err);

        // 🟢 Radera ogiltiga anslutningar
        if (err.statusCode === 410) {
          await db.delete({
            TableName: 'WebSocketConnections',
            Key: { connectionId }
          }).promise();
          console.log(`Ogiltig anslutning raderad: ${connectionId}`);
        }
      }
    });

    await Promise.all(sendPromises);
    console.log('Alla meddelanden skickade.');

    // 🟢 Returnera 200 OK när allt är klart
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Matchen uppdaterad!",
        matchData: message
      })
    };

  } catch (error) {
    console.error('Fel i Lambda handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Intern serverfel', error: error.message })
    };
  }
};
