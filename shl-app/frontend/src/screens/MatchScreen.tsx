import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import MatchListItem from "../components/MatchItems";
import { connectWebSocket, getWebSocket } from "../services/WebsocketService";
import { getMatches } from "../services/matchService";
import { Match } from "../types/match";
import styles from "../styles/matchStyles";

const sortMatches = (matches: Match[]) =>
  [...matches].sort((a, b) => a.matchNumber - b.matchNumber);

const MatchScreen = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_wsStatus, setWsStatus] = useState<string>("Disconnected");

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMatches();
      setMatches(sortMatches(data.matches));
    } catch (error) {
      console.error("❌ Fel vid hämtning:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleWebSocketMessage = (data: any) => {
    if (data.action === "new_matches" && Array.isArray(data.matches)) {
      setMatches(sortMatches(data.matches));
    } else if (data.action === "update_match" && Array.isArray(data.matches)) {
      const updatedMatch = data.matches[0];
      setMatches((prev) =>
        sortMatches(
          prev.map((match) =>
            match.matchid === updatedMatch.matchid ? updatedMatch : match
          )
        )
      );
    }
  };

  useEffect(() => {
    connectWebSocket(setWsStatus, handleWebSocketMessage);
    fetchMatches();

    return () => {
      const ws = getWebSocket();
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [fetchMatches]);

  if (loading) {
    return <Text style={styles.subTitle}>Laddar matcher...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SHL Matcher</Text>
      <FlatList
        data={matches}
        keyExtractor={(match) => match.matchid}
        renderItem={({ item }) => <MatchListItem match={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default MatchScreen;
