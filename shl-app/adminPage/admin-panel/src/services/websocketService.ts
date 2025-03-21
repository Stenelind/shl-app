import { Dispatch, SetStateAction } from "react";
import { getMatches } from "./matchService";
import { Match } from "../types/match";

export interface NewMatchesMessage {
  action: "new_matches";
  matches: Match[]; 
}

export interface UpdateMatchMessage {
  action: "update_match";
  matches: Match[];
}

export type WebSocketMessage = NewMatchesMessage | UpdateMatchMessage; 

export type WebSocketMessageHandler = (data: WebSocketMessage) => void;
export type WebSocketStatusSetter = Dispatch<SetStateAction<string>>;

let ws: WebSocket | null = null;
let isReconnecting = false;

export const connectWebSocket = (
  setWsStatus: WebSocketStatusSetter,
  onMessage: WebSocketMessageHandler
) => {
  const wsUrl = `wss://fek2ztehw3.execute-api.eu-north-1.amazonaws.com/dev/`;

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    setWsStatus("Connected");
    console.log("WebSocket ansluten");

    getMatches().then((data) => {
      if (data.matches) {
        onMessage({ action: "new_matches", matches: data.matches });
      }
    });
  };

  ws.onclose = () => {
    setWsStatus("Disconnected");
    console.log("WebSocket stängd, återansluter...");

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
      const data: WebSocketMessage = JSON.parse(event.data);

      if (data.action === "new_matches" && Array.isArray(data.matches)) {
        onMessage(data); 
        return;
      }

      if (data.action === "update_match" && Array.isArray(data.matches)) {
        const updatedMatch = data.matches[0];
        if (!updatedMatch.matchid) {
          console.warn("matchid saknas:", updatedMatch);
          return;
        }
        onMessage({ action: "update_match", matches: [updatedMatch] });
        return;
      }

      console.warn("Okänt format:", data);
    } catch (error) {
      console.error("JSON-parse error:", error);
    }
  };
};

export const getWebSocket = (): WebSocket | null => ws;
