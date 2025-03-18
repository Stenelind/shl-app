import { useState, useEffect } from "react";
import { getMatches, updateMatchScore } from "../../services/matchService";
import { connectWebSocket, getWebSocket } from "../../services/websocketService";
import MatchCard from "../match/MatchCard";
import { Match } from "../../types/match";
import "../../styles/adminPage.css";

const AdminPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [_wsStatus, setWsStatus] = useState<string>("Disconnected");

  const sortMatches = (matches: Match[]) =>
    [...matches].sort((a, b) => a.matchNumber - b.matchNumber);
  
  const fetchMatches = async () => {
    const data = await getMatches();
    const sortedMatches = sortMatches(data.matches);
    setMatches(sortedMatches);
    setSelectedMatch(sortedMatches[0]);
  };

  const handleWebSocketMessage = (data: any) => {
    if (data.action === "new_matches" && Array.isArray(data.matches)) {
      const sortedMatches = sortMatches(data.matches);
      setMatches(sortedMatches);
      setSelectedMatch(sortedMatches[0]);
    } else if (data.action === "update_match" && Array.isArray(data.matches)) {
      const updatedMatch = data.matches[0];
  
      setMatches((prevMatches) => {
        const updatedMatches = prevMatches.map((match) =>
          match.matchid === updatedMatch.matchid ? updatedMatch : match
        );
        return sortMatches(updatedMatches);
      });
  
      setSelectedMatch((prevSelectedMatch) =>
        prevSelectedMatch && prevSelectedMatch.matchid === updatedMatch.matchid
          ? updatedMatch
          : prevSelectedMatch
      );
    }
  };
  

  useEffect(() => {
    connectWebSocket(setWsStatus, handleWebSocketMessage);
    fetchMatches();

    return () => {
      const ws = getWebSocket();
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("🛑 Stänger WebSocket vid unmount");
        ws.close();
      }
    };
  }, []);

  const updateScore = async (
    matchid: string,
    team: "poangLag1" | "poangLag2",
    change: number
  ) => {
    const match = matches.find((m) => m.matchid === matchid);
    if (!match) {
      console.error("❌ Ingen match hittades med matchid:", matchid);
      return;
    }

    const updatedScore = {
      poangLag1:
        team === "poangLag1" ? Math.max(0, match.poangLag1 + change) : match.poangLag1,
      poangLag2:
        team === "poangLag2" ? Math.max(0, match.poangLag2 + change) : match.poangLag2,
    };

    try {
      await updateMatchScore(matchid, updatedScore);
      // Backend skickar WS-meddelande, så inget ytterligare behövs här.
    } catch (error) {
      console.error("❌ Fel vid uppdatering av matchpoäng:", error);
    }
  };

  return (
    <section className="admin-container">
      <section className="admin-content">
        <aside className="match-list-container">
          <section className="match-list">
            {matches.map((match) => (
              <section
                key={match.matchid}
                className="match-item"
                onClick={() => setSelectedMatch(match)}
              >
                <section className="match-teams">
                  <section className="team-info">
                    <img
                      src={`/assets/${match.lag1Abbreviation.toLowerCase()}.png`}
                      alt={match.lag1}
                      className="match-logo"
                    />
                    <span className="team-abbreviation">
                      {match.lag1Abbreviation}
                    </span>
                  </section>

                  <section className="match-score-container">
                    <span className="match-score">{match.poangLag1}</span>
                    <span className="vs-text">-</span>
                    <span className="match-score">{match.poangLag2}</span>
                  </section>

                  <section className="team-info">
                    <img
                      src={`/assets/${match.lag2Abbreviation.toLowerCase()}.png`}
                      alt={match.lag2}
                      className="match-logo"
                    />
                    <span className="team-abbreviation">
                      {match.lag2Abbreviation}
                    </span>
                  </section>
                </section>
              </section>
            ))}
          </section>
        </aside>

        <section className="selected-match">
          {selectedMatch && (
            <MatchCard
              match={selectedMatch}
              updateScore={updateScore}
              fetchMatches={fetchMatches}
            />
          )}
        </section>
      </section>
    </section>
  );
};

export default AdminPage;
