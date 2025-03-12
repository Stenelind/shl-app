import React, { useState, useEffect } from "react";
import { getMatches } from "../../services/matchService";
import { sendWebSocketMessage, connectWebSocket } from "../../services/websocketService"; 
import "../../styles/adminPage.css";

const AdminPage: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [wsStatus, setWsStatus] = useState("Disconnected");

  useEffect(() => {
    fetchMatches();
    connectWebSocket(setWsStatus, handleWebSocketMessage);
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMatches();
      console.log("✅ Hämtade matcher:", data);
      setMatches(data.matches);
    } catch (error) {
      console.error("❌ Fel vid hämtning:", error);
    }
  };

  const handleWebSocketMessage = (updatedMatches: any[]) => {
    console.log("⚡ WebSocket-uppdatering mottagen:", updatedMatches);
  
    setMatches((prevMatches) => {
      const updatedMatchesMap = new Map(prevMatches.map((match) => [match.matchid, match]));
  
      updatedMatches.forEach((updatedMatch) => {
        if (updatedMatch.matchid && updatedMatchesMap.has(updatedMatch.matchid)) {
          updatedMatchesMap.set(updatedMatch.matchid, {
            ...updatedMatchesMap.get(updatedMatch.matchid),
            poangLag1: updatedMatch.poangLag1,
            poangLag2: updatedMatch.poangLag2,
          });
        }
      });
  
      return [...updatedMatchesMap.values()];
    });
  };
  

  const updateScore = (matchid: string, team: "poangLag1" | "poangLag2", change: number) => {
    // Hämta aktuell match från state
    const match = matches.find((m) => m.matchid === matchid);
    if (!match) {
      console.error("❌ Ingen match hittades med matchid:", matchid);
      return;
    }
  
    // Räkna ut ny poäng men se till att den inte går under 0
    const updatedPoangLag1 = team === "poangLag1" ? Math.max(0, match.poangLag1 + change) : match.poangLag1;
    const updatedPoangLag2 = team === "poangLag2" ? Math.max(0, match.poangLag2 + change) : match.poangLag2;
  
    console.log("📡 Skickar WebSocket-meddelande...", {
      action: "sendMatchUpdates",
      matchid: matchid,
      poangLag1: updatedPoangLag1,
      poangLag2: updatedPoangLag2
    });
  
    sendWebSocketMessage({
      action: "sendMatchUpdates",
      matchid: matchid,
      poangLag1: updatedPoangLag1,
      poangLag2: updatedPoangLag2
    });
  };
  
  
  

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin - Uppdatera Poäng</h1>
      <p className="status">{wsStatus === "Connected" ? "🟢 WebSocket Ansluten" : "🔴 WebSocket Ej Ansluten"}</p>
      <div className="match-list">
        {matches.map((match) => (
          <div key={match.matchid} className="match-card">
            <h2>{match.lag1} vs {match.lag2}</h2>
            <p>Poäng: {match.poangLag1} - {match.poangLag2}</p>
            <div className="button-container">
              <button className="admin-button" onClick={() => updateScore(match.matchid, "poangLag1", 1)}>+1 Lag 1</button>
              <button className="admin-button" onClick={() => updateScore(match.matchid, "poangLag1", -1)}>-1 Lag 1</button>
              <button className="admin-button" onClick={() => updateScore(match.matchid, "poangLag2", 1)}>+1 Lag 2</button>
              <button className="admin-button" onClick={() => updateScore(match.matchid, "poangLag2", -1)}>-1 Lag 2</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
