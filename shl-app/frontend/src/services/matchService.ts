import axios from 'axios';

const API_URL = 'https://uqlfqq469h.execute-api.eu-north-1.amazonaws.com/api/matches';

export const getMatches = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};
