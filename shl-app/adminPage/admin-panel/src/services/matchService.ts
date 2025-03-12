import axios from 'axios';

const API_URL = 'https://uqlfqq469h.execute-api.eu-north-1.amazonaws.com/api/matches';

export const getMatches = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching matches:', error);
    throw error;
  }
};

export const updateMatchScore = async (matchId: string, updatedScore: any) => {
  try {
    await axios.put(`${API_URL}/${matchId}`, updatedScore);
    console.log('✅ Match score updated:', matchId);
  } catch (error) {
    console.error('❌ Error updating match score:', error);
    throw error;
  }
};
