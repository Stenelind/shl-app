import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import MatchListItem from "../components/MatchListItems";
import { connectWebSocket, getWebSocket } from "../services/WebsocketService";
import { getMatches } from "../services/matchService";
import styles from "../styles/matchListItemStyles";

interface Match {
  matchid: string;
  lag1: string;
  lag1Abbreviation: string;
  lag2: string;
  lag2Abbreviation: string;
  poangLag1: number;
  poangLag2: number;
}

const MatchScreen = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 🟢 Placeholder-funktion för WebSocket-status
  const setWsStatus = useState<string>("Disconnected")[1];

  useEffect(() => {
    if (!getWebSocket()) {
      connectWebSocket(setWsStatus, handleWebSocketMessage);
    }
    fetchMatches();
    return () => {
      const ws = getWebSocket();
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMatches();
      console.log("✅ Hämtade matcher:", data);
      setMatches(data.matches);
    } catch (error) {
      console.error("❌ Fel vid hämtning:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleWebSocketMessage = useCallback((updatedMatches: Match[]) => {
    console.log("⚡ Mottog uppdatering från WebSocket:", updatedMatches);
    setMatches((prevMatches) => {
      const updatedMatchesMap = new Map(prevMatches.map((match) => [match.matchid, match]));
      updatedMatches.forEach((updatedMatch) => {
        if (updatedMatch.matchid && updatedMatchesMap.has(updatedMatch.matchid)) {
          const existingMatch = updatedMatchesMap.get(updatedMatch.matchid);
          if (existingMatch) {
            updatedMatchesMap.set(updatedMatch.matchid, {
              ...existingMatch,
              poangLag1: updatedMatch.poangLag1,
              poangLag2: updatedMatch.poangLag2,
            });
          }
        }
      });
      return [...updatedMatchesMap.values()];
    });
  }, []);

  if (loading) {
    return <Text style={styles.subTitle}>Laddar...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SHL</Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.matchid}
        renderItem={({ item }) => <MatchListItem match={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        style={{ flexShrink: 1 }}
      />
    </View>
  );
};

export default MatchScreen;
