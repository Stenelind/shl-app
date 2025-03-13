import { useState, useEffect } from "react";
import { getMatches, deleteMatches } from "../../services/matchService";
import { sendWebSocketMessage, connectWebSocket } from "../../services/websocketService";
import "../../styles/adminPage.css";

interface Match {
  matchid: string;
  lag1Abbreviation: string;
  lag2Abbreviation: string;
  poangLag1: number;
  poangLag2: number;
}

const AdminPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchMatches();
    connectWebSocket(() => { }, handleWebSocketMessage);
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMatches();
      console.log("Hämtade matcher:", data);
      setMatches(data.matches);
    } catch (error) {
      console.error("Fel vid hämtning:", error);
    }
  };

  const handleWebSocketMessage = (updatedMatches: Match[]) => {
    setMatches((prevMatches) => {
      const updatedMatchesMap = new Map(prevMatches.map((match) => [match.matchid, match]));

      updatedMatches.forEach((updatedMatch) => {
        if (updatedMatch.matchid && updatedMatchesMap.has(updatedMatch.matchid)) {
          updatedMatchesMap.set(updatedMatch.matchid, {
            ...updatedMatchesMap.get(updatedMatch.matchid)!,
            poangLag1: updatedMatch.poangLag1,
            poangLag2: updatedMatch.poangLag2,
          });
        }
      });
      return [...updatedMatchesMap.values()];
    });
  };

  const updateScore = (matchid: string, team: "poangLag1" | "poangLag2", change: number) => {
    const match = matches.find((m) => m.matchid === matchid);
    if (!match) {
      console.error("Ingen match hittades med matchid:", matchid);
      return;
    }
    const updatedPoangLag1 = team === "poangLag1" ? Math.max(0, match.poangLag1 + change) : match.poangLag1;
    const updatedPoangLag2 = team === "poangLag2" ? Math.max(0, match.poangLag2 + change) : match.poangLag2;

    sendWebSocketMessage({
      action: "sendMatchUpdates",
      matchid: matchid,
      poangLag1: updatedPoangLag1,
      poangLag2: updatedPoangLag2
    });
  };

  const resetMatches = async () => {
    try {
      console.log("🗑 Tömmer databasen...");
      await deleteMatches();
      console.log("✅ Databasen är tom. Hämtar nya matcher...");
      
      fetchMatches();
    } catch (error) {
      console.error("❌ Fel vid radering och återställning:", error);
    }
  };

  return (
    <section className="admin-container">
      <h1 className="admin-title">SHL-admin</h1>

      <button className="reset-button" onClick={resetMatches}>
        Töm och skapa nya matcher!
      </button>

      <section className="match-list">
        {matches.map((match) => (
          <section key={match.matchid} className="match-card">
            <h2 className="teamName">{match.lag1Abbreviation} vs {match.lag2Abbreviation}</h2>
            <section className="button-container">
              <button className="admin-button" onClick={() => updateScore(match.matchid, "poangLag1", -1)}>➖</button>
              <button className="admin-button" onClick={() => updateScore(match.matchid, "poangLag1", 1)}>➕</button>
              <button className="admin-button" onClick={() => updateScore(match.matchid, "poangLag2", -1)}>➖</button>
              <button className="admin-button" onClick={() => updateScore(match.matchid, "poangLag2", 1)}>➕</button>
            </section>
            <p className="match-score">{match.poangLag1} - {match.poangLag2}</p>
          </section>
        ))}
      </section>
    </section>
  );
};

export default AdminPage;
