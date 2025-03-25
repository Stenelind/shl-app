import { Match } from "../../types/match";
import { deleteMatches, createMatches } from "../../services/matchService";
import { motion } from "framer-motion";
import "../../styles/matchCard.css";
import { useState } from "react";

interface MatchCardProps {
  match: Match;
  updateScore: (matchid: string, team: "poangLag1" | "poangLag2", change: number) => void;
  fetchMatches: () => void;
}

const getLogo = (abbreviation: string): string => {
  return `/assets/${abbreviation.toLowerCase()}.png`;
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const MatchCard = ({ match, updateScore, fetchMatches }: MatchCardProps) => {
  const [scoreFlash, setScoreFlash] = useState<string>("");

  const handleScoreUpdate = (matchid: string, team: "poangLag1" | "poangLag2", change: number) => {
    setScoreFlash(team);
    setTimeout(() => setScoreFlash(""), 300);
    updateScore(matchid, team, change);
  };

  const resetMatches = async () => {
    await deleteMatches();
    await createMatches();
    fetchMatches();
  };

  return (
    <motion.section
      className="match-card-large"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="admin-title">Admin-panel</h1>
      <section className="match-detail">
        <section className="team-container">
          <span className="team-name">{match.lag1}</span>
          <img src={getLogo(match.lag1Abbreviation)} alt={match.lag1} className="match-logo-large" />
          <section className="button-container">
            <motion.button
              className="score-button"
              onClick={() => handleScoreUpdate(match.matchid, "poangLag1", -1)}
            >
              −
            </motion.button>

            <motion.button
              className="score-button"
              onClick={() => handleScoreUpdate(match.matchid, "poangLag1", 1)}
            >
              +
            </motion.button>
          </section>
        </section>

        <section className="score-section">
          <motion.span
            className="match-score-large"
            animate={scoreFlash === "poangLag1" ? { color: "#78faae" } : {}}
            transition={{ duration: 0.3 }}
          >
            {match.poangLag1}
          </motion.span>
          <span className="vs-text-large">-</span>
          <motion.span
            className="match-score-large"
            animate={scoreFlash === "poangLag2" ? { color: "#78faae" } : {}}
            transition={{ duration: 0.3 }}
          >
            {match.poangLag2}
          </motion.span>
        </section>

        <section className="team-container">
          <span className="team-name">{match.lag2}</span>
          <img src={getLogo(match.lag2Abbreviation)} alt={match.lag2} className="match-logo-large" />
          <section className="button-container">
            <motion.button
              className="score-button"
              onClick={() => handleScoreUpdate(match.matchid, "poangLag2", -1)}
            >
              −
            </motion.button>

            <motion.button
              className="score-button"
              onClick={() => handleScoreUpdate(match.matchid, "poangLag2", 1)}
            >
              +
            </motion.button>
          </section>
        </section>
      </section>

      <section className="reset-button-container">
        <motion.button
          className="reset-button"
          onClick={resetMatches}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
          }}
        >
          Skapa nya matcher!
        </motion.button>
      </section>
    </motion.section>
  );
};

export default MatchCard;
