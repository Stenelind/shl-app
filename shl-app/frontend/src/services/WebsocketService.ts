// 🟢 TypeScript-import
import { Dispatch, SetStateAction } from "react";

// 🟢 Typdeklarationer
let ws: WebSocket | null = null;
let isReconnecting = false;

export type WebSocketMessageHandler = (data: any[]) => void;
export type WebSocketStatusSetter = Dispatch<SetStateAction<string>>;

// 🟢 Förbättra ensureWebSocketOpen
const ensureWebSocketOpen = async (
  setWsStatus: WebSocketStatusSetter,
  onMessage: WebSocketMessageHandler
): Promise<boolean> => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket är inte öppen, försöker återansluta...");
    setWsStatus("Reconnecting...");
    if (!isReconnecting) {
      isReconnecting = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      connectWebSocket(setWsStatus, onMessage);
      isReconnecting = false;
    }
  }
  return ws?.readyState === WebSocket.OPEN;
};

// 🟢 Anslut till WebSocket
export const connectWebSocket = (
  setWsStatus: WebSocketStatusSetter,
  onMessage: WebSocketMessageHandler
): void => {
  // Endast skapa en WebSocket om den inte redan finns eller är stängd
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    const wsUrl = `wss://v1jgs00zdh.execute-api.eu-north-1.amazonaws.com/dev`;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsStatus("Connected");
      console.log("WebSocket-anslutning öppnad");

      // 🟢 Lägg till ping för att hålla anslutningen öppen
      setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ action: "ping" }));
          console.log("Ping skickad för att hålla anslutningen öppen.");
        }
      }, 30000);
    };

    ws.onclose = () => {
      setWsStatus("Disconnected");
      console.log("WebSocket-anslutning stängd. Försöker återansluta...");
      if (!isReconnecting) {
        isReconnecting = true;
        setTimeout(() => {
          connectWebSocket(setWsStatus, onMessage);
          isReconnecting = false;
        }, 5000);
      }
    };

    ws.onerror = (error) => {
      setWsStatus("Error");
      console.error("WebSocket-fel:", error);
    };

    ws.onmessage = (event) => {
      console.log("Meddelande från servern:", event.data);
      try {
        const updatedData = JSON.parse(event.data);
        console.log("Uppdaterad match-data:", updatedData);

        if (!updatedData.matchid) {
          console.warn("⚠️ Mottagen data saknar matchid!");
          return;
        }

        // Anropa callback-funktionen med uppdaterad data
        onMessage([updatedData]);
      } catch (error) {
        console.error("❌ JSON-parse error:", error);
      }
    };
  }
};

// 🟢 Exportera getWebSocket korrekt
export const getWebSocket = (): WebSocket | null => ws;
