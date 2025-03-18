import { useState, useEffect } from "react";
import { getMatches, updateMatchScore } from "../../services/matchService";
import { connectWebSocket, getWebSocket } from "../../services/websocketService";
import MatchCard from "../match/MatchCard";
import { Match } from "../../types/match";
import { motion, AnimatePresence } from "framer-motion";
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
        console.log("Stänger WebSocket");
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
      console.error("Ingen match hittades med matchid:", matchid);
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
    } catch (error) {
      console.error("Fel vid uppdatering av matchpoäng:", error);
    }
  };

  return (
    <section className="admin-container">
      <section className="admin-content">
        <aside className="match-list-container">
          <section className="match-list">
            <AnimatePresence mode="wait">
              {matches.map((match) => (
                <motion.section
                  key={match.matchid}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="match-item"
                  onClick={() => setSelectedMatch(match)}
                  layout
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
                      <motion.span
                        key={`lag1-${match.matchid}-${match.poangLag1}`}
                        initial={{ opacity: 0.3, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="match-score"
                        layout
                      >
                        {match.poangLag1}
                      </motion.span>

                      <span className="vs-text">-</span>

                      <motion.span
                        key={`lag2-${match.matchid}-${match.poangLag2}`}
                        initial={{ opacity: 0.3, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="match-score"
                        layout
                      >
                        {match.poangLag2}
                      </motion.span>
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
                </motion.section>
              ))}
            </AnimatePresence>
          </section>
        </aside>
        <section className="selected-match">
          <AnimatePresence mode="wait">
            {selectedMatch && (
              <motion.section
                key={selectedMatch.matchid}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
                exit={{ opacity: 0, y: 0, transition: { duration: 0.3 } }}
              >
                <MatchCard
                  match={selectedMatch}
                  updateScore={updateScore}
                  fetchMatches={fetchMatches}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </section>
      </section>
    </section>
  );
};

export default AdminPage;
