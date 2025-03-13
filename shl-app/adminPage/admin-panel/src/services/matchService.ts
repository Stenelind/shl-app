import axios from 'axios';

const API_URL = 'https://uqlfqq469h.execute-api.eu-north-1.amazonaws.com/api/matches';

interface MatchScoreUpdate {
  poangLag1: number;
  poangLag2: number;
}

export const getMatches = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching matches:', error);
    throw error;
  }
};

export const updateMatchScore = async (matchId: string, updatedScore: MatchScoreUpdate) => {
  try {
    await axios.put(`${API_URL}/${matchId}`, updatedScore);
    console.log('✅ Match score updated:', matchId);
  } catch (error) {
    console.error('❌ Error updating match score:', error);
    throw error;
  }
};

export const deleteMatches = async () => {
  try {
    const response = await axios.delete(API_URL);
    console.log("✅ Alla matcher har raderats:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Fel vid radering av matcher:", error);
    throw error;
  }
};