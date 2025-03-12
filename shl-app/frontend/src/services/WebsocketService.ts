import { Dispatch, SetStateAction } from "react";

let ws: WebSocket | null = null;
let isReconnecting = false;
let reconnectTimeout: NodeJS.Timeout | null = null;

export type WebSocketMessageHandler = (data: Match[]) => void;
export type WebSocketStatusSetter = Dispatch<SetStateAction<string>>;

interface Match {
  matchid: string;
  lag1: string;
  lag1Abbreviation: string;
  lag2: string;
  lag2Abbreviation: string;
  poangLag1: number;
  poangLag2: number;
}

// 🟢 Skapa och hantera WebSocket-anslutning
export const connectWebSocket = (
  setWsStatus: WebSocketStatusSetter,
  onMessage: WebSocketMessageHandler
): void => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    const wsUrl = `wss://fek2ztehw3.execute-api.eu-north-1.amazonaws.com/dev/`;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsStatus("Connected");
      console.log("✅ WebSocket-anslutning öppnad");

      // Rensa eventuell gammal reconnect-timer
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    };

    ws.onclose = () => {
      setWsStatus("Disconnected");
      console.log("⚠️ WebSocket-anslutning stängd. Försöker återansluta...");

      if (!isReconnecting) {
        isReconnecting = true;
        reconnectTimeout = setTimeout(() => {
          connectWebSocket(setWsStatus, onMessage);
          isReconnecting = false;
        }, 5000);
      }
    };

    ws.onerror = (error) => {
      setWsStatus("Error");
      console.error("❌ WebSocket-fel:", error);
    };

    ws.onmessage = (event) => {
      console.log("📩 Meddelande från servern:", event.data);
      try {
        const updatedData: Match = JSON.parse(event.data);
        console.log("🔄 Uppdaterad match-data:", updatedData);

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

// 🟢 Hämta WebSocket-instansen
export const getWebSocket = (): WebSocket | null => ws;
