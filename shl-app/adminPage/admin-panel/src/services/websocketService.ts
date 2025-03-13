import { Dispatch, SetStateAction } from "react";

let ws: WebSocket | null = null;
let isReconnecting = false;

interface Match {
  matchid: string;
  lag1Abbreviation: string;
  lag2Abbreviation: string;
  poangLag1: number;
  poangLag2: number;
}

export type WebSocketMessageHandler = (data: Match[]) => void;
export type WebSocketStatusSetter = Dispatch<SetStateAction<string>>;

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

export const connectWebSocket = (
  setWsStatus: WebSocketStatusSetter,
  onMessage: WebSocketMessageHandler
): void => {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    const wsUrl = `wss://fek2ztehw3.execute-api.eu-north-1.amazonaws.com/dev/`;
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setWsStatus("Connected");
      console.log("WebSocket ansluten");
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
      try {
        const updatedData: Match = JSON.parse(event.data);
        console.log("Uppdaterad match-data:", updatedData);

        if (!("matchid" in updatedData)) {
          console.warn("Mottagen data saknar matchid!");
          return;
        }

        onMessage([updatedData]);
      } catch (error) {
        console.error("JSON-parse error:", error);
      }
    };
  }
};

export const sendWebSocketMessage = async (message: Record<string, unknown>) => {
  if (!(await ensureWebSocketOpen(() => {}, () => {}))) {
    console.error("WebSocket är inte ansluten, kan inte skicka meddelande.");
    return;
  }
  ws?.send(JSON.stringify(message));
};

export const getWebSocket = (): WebSocket | null => ws;
