import axios from 'axios';
import { SAMBANOVA_API_KEY } from '@env';

const SAMBANOVA_API_URL = 'https://api.sambanova.ai';

// Fetch AI-based insights
export const fetchAIInsights = async (data) => {
  try {
    const response = await axios.post(`${SAMBANOVA_API_URL}/insights`, data, {
      headers: {
        'Authorization': `Bearer ${SAMBANOVA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('SambaNova AI Error:', error);
    throw error;
  }
};

// Parse user commands using AI
export const parseCommand = async (command) => {
  try {
    const response = await axios.post(
      `${SAMBANOVA_API_URL}/parse`,
      { command },
      {
        headers: {
          'Authorization': `Bearer ${SAMBANOVA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Command Parsing Error:', error);
    throw error;
  }
};
