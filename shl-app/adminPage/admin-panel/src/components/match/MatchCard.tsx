import { Match } from "../../types/match";
import { deleteMatches } from "../../services/matchService"; 
import "../../styles/matchCard.css";

interface MatchCardProps {
  match: Match;
  updateScore: (matchid: string, team: "poangLag1" | "poangLag2", change: number) => void;
  fetchMatches: () => void;
}

const getLogo = (abbreviation: string): string => {
  return `/assets/${abbreviation.toLowerCase()}.png`;
};

const MatchCard = ({ match, updateScore, fetchMatches }: MatchCardProps) => {
  const resetMatches = async () => {
    try {
      console.log("Tömmer databasen...");
      await deleteMatches();
      console.log("Databasen är tom. Hämtar nya matcher...");
      fetchMatches();
    } catch (error) {
      console.error("Fel vid radering och återställning:", error);
    }
  };

  return (
    <section className="match-card-large">
      <h1 className="admin-title">Admin-panel</h1>
      <section className="match-detail">
        <section className="team-container">
          <span className="team-name">{match.lag1}</span>
          <img src={getLogo(match.lag1Abbreviation)} alt={match.lag1} className="match-logo-large" />
          <section className="button-container">
            <button className="score-button" onClick={() => updateScore(match.matchid, "poangLag1", -1)}>−</button>
            <button className="score-button" onClick={() => updateScore(match.matchid, "poangLag1", 1)}>+</button>
          </section>
        </section>

        <section className="score-section">
          <span className="match-score-large">{match.poangLag1}</span>
          <span className="vs-text-large">-</span>
          <span className="match-score-large">{match.poangLag2}</span>
        </section>

        <section className="team-container">
          <span className="team-name">{match.lag2}</span>
          <img src={getLogo(match.lag2Abbreviation)} alt={match.lag2} className="match-logo-large" />
          <section className="button-container">
            <button className="score-button" onClick={() => updateScore(match.matchid, "poangLag2", -1)}>−</button>
            <button className="score-button" onClick={() => updateScore(match.matchid, "poangLag2", 1)}>+</button>
          </section>
        </section>
      </section>
      <section className="reset-button-container">
        <button className="reset-button" onClick={resetMatches}>
          Skapa nya matcher!
        </button>
      </section>
    </section>
  );
};

export default MatchCard;