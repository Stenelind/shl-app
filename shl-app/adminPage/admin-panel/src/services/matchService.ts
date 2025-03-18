import axios from 'axios';

const API_URL = 'https://uqlfqq469h.execute-api.eu-north-1.amazonaws.com/api/matches';

export const getMatches = async () => (await axios.get(API_URL)).data;

export const updateMatchScore = async (matchId: string, updatedScore: any) => {
  await axios.put(API_URL, {
    matchid: matchId,
    ...updatedScore
  });
};

export const deleteMatches = async () => axios.delete(API_URL);

// 👇 Här är din createMatches-funktion
export const createMatches = async () => {
  await axios.post(API_URL);
};
