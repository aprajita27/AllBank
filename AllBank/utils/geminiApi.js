// utils/geminiApi.js
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCSM6SCzUJbrdiZEBr0XMENA8jnvJYivD8";

/**
 * Sends fund data to Gemini AI for analysis.
 * @param {Array} funds - Array of fund objects.
 * @returns {Promise} - Response from Gemini AI.
 */
export const analyzeFunds = async (funds) => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: {
          text: `Analyze these funds and provide investment scenarios: ${JSON.stringify(funds)}`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini AI Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].output; // Extract the response text
  } catch (error) {
    console.error("Error analyzing funds:", error);
    throw error;
  }
};

/**
 * Sends fund data to optimize liquidity using Gemini AI.
 * @param {Array} funds - Array of fund objects.
 * @returns {Promise} - Response from Gemini AI.
 */
export const optimizeLiquidity = async (funds) => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: {
          text: `Optimize liquidity for these funds: ${JSON.stringify(funds)}`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini AI Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].output; // Extract the response text
  } catch (error) {
    console.error("Error optimizing liquidity:", error);
    throw error;
  }
};

/**
 * Fetches redemption alerts for funds using Gemini AI.
 * @param {Array} funds - Array of fund objects.
 * @returns {Promise} - Response from Gemini AI.
 */
export const fetchRedemptionAlerts = async (funds) => {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: {
          text: `Generate redemption alerts for these funds: ${JSON.stringify(funds)}`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini AI Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].output; // Extract the response text
  } catch (error) {
    console.error("Error fetching redemption alerts:", error);
    throw error;
  }
};
