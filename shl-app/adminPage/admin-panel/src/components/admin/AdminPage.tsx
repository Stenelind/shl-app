import { useState, useEffect } from "react";
import { getMatches } from "../../services/matchService";
import { sendWebSocketMessage, connectWebSocket } from "../../services/websocketService";
import MatchCard from "../match/MatchCard";
import { Match } from "../../types/match";
import "../../styles/adminPage.css";

const AdminPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    fetchMatches();
    connectWebSocket(() => { }, handleWebSocketMessage);
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMatches();
      console.log("Hämtade matcher:", data);
      setMatches(data.matches);

      if (data.matches.length > 0) {
        setSelectedMatch(data.matches[0]);
      }
    } catch (error) {
      console.error("Fel vid hämtning:", error);
    }
  };

  const handleWebSocketMessage = (data: unknown) => {
    const updatedMatches = data as Match[];

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

    setSelectedMatch((prevMatch) =>
      prevMatch && prevMatch.matchid === matchid
        ? { ...prevMatch, [team]: Math.max(0, prevMatch[team] + change) }
        : prevMatch
    );

    sendWebSocketMessage({
      action: "sendMatchUpdates",
      matchid: matchid,
      poangLag1: updatedPoangLag1,
      poangLag2: updatedPoangLag2
    });
  };

  return (
    <section className="admin-container">
      <section className="admin-content">
        <aside className="match-list-container">
          <section className="match-list">
            {matches.map((match) => (
              <section key={match.matchid} className="match-item" onClick={() => setSelectedMatch(match)}>
                <section className="match-teams">
                  <section className="team-info">
                    <img src={`/assets/${match.lag1Abbreviation.toLowerCase()}.png`} alt={match.lag1} className="match-logo" />
                    <span className="team-abbreviation">{match.lag1Abbreviation}</span>
                  </section>

                  <section className="match-score-container">
                    <span className="match-score">{match.poangLag1}</span>
                    <span className="vs-text">-</span>
                    <span className="match-score">{match.poangLag2}</span>
                  </section>

                  <section className="team-info">
                    <img src={`/assets/${match.lag2Abbreviation.toLowerCase()}.png`} alt={match.lag2} className="match-logo" />
                    <span className="team-abbreviation">{match.lag2Abbreviation}</span>
                  </section>
                </section>
              </section>
            ))}
          </section>
        </aside>

        <section className="selected-match">
          {selectedMatch && <MatchCard match={selectedMatch} updateScore={updateScore} fetchMatches={fetchMatches} />}
        </section>
      </section>
    </section>
  );
};

export default AdminPage;