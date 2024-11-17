import GoogleGenerativeAI from "@google/generative-ai";

const API_KEY = "AIzaSyCSM6SCzUJbrdiZEBr0XMENA8jnvJYivD8"; 
const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const DEFAULT_CONTEXT = `
  You are a financial assistant AI specializing in analyzing and optimizing investment funds.
  Provide clear and actionable insights based on the given data.
  `;

/**
 * Analyzes funds using Gemini Generative AI.
 * @param {Array} funds - Array of fund objects.
 * @returns {Promise} - AI-generated analysis.
 */
export const analyzeFunds = async (funds) => {
  try {
    const formattedFunds = funds
      .map(
        (fund, index) =>
          `${index + 1}. Fund Name: ${fund.fundName}, Total Invested: ${
            fund.totalInvested
          }, Current Value: ${fund.currentValue}, Liquidity: ${
            fund.liquidityType
          }, Lock-in Period: ${fund.lockInPeriod}, Redemption Penalty: ${
            fund.redemptionPenalty * 100
          }%.`
      )
      .join("\n");

    const prompt = `
        ${DEFAULT_CONTEXT}
        Analyze the following funds and provide investment scenarios:
        ${formattedFunds}
        Do not use Markdown in response
      `;

    const result = await model.generateContent(prompt);

    return result.response?.text() || "No analysis provided.";
  } catch (error) {
    console.error("Error analyzing funds with Gemini:", error);
    throw error;
  }
};

/**
 * Optimizes liquidity using Gemini Generative AI.
 * @param {Array} funds - Array of fund objects.
 * @returns {Promise} - AI-generated liquidity insights.
 */
export const optimizeLiquidity = async (funds) => {
  try {
    const formattedFunds = funds
      .map(
        (fund, index) =>
          `${index + 1}. Fund Name: ${fund.fundName}, Total Invested: ${
            fund.totalInvested
          }, Current Value: ${fund.currentValue}, Liquidity: ${
            fund.liquidityType
          }, Lock-in Period: ${fund.lockInPeriod}, Redemption Penalty: ${
            fund.redemptionPenalty * 100
          }%.`
      )
      .join("\n");

    const prompt = `
        ${DEFAULT_CONTEXT}
        Optimize liquidity for the following funds:
        ${formattedFunds}
        Do not use Markdown in response
      `;

    const result = await model.generateContent(prompt);

    return result.response?.text() || "No optimization insights provided.";
  } catch (error) {
    console.error("Error optimizing liquidity with Gemini:", error);
    throw error;
  }
};

/**
 * Fetches redemption alerts using Gemini Generative AI.
 * @param {Array} funds - Array of fund objects.
 * @returns {Promise} - AI-generated redemption alerts.
 */
export const fetchRedemptionAlerts = async (funds) => {
  try {
    const formattedFunds = funds
      .map(
        (fund, index) =>
          `${index + 1}. Fund Name: ${fund.fundName}, Total Invested: ${
            fund.totalInvested
          }, Current Value: ${fund.currentValue}, Liquidity: ${
            fund.liquidityType
          }, Lock-in Period: ${fund.lockInPeriod}, Redemption Penalty: ${
            fund.redemptionPenalty * 100
          }%.`
      )
      .join("\n");

    const prompt = `
        ${DEFAULT_CONTEXT}
        Generate redemption alerts for the following funds:
        ${formattedFunds}
        Do not use Markdown in response
      `;

    const result = await model.generateContent(prompt);

    return result.response?.text() || "No redemption alerts provided.";
  } catch (error) {
    console.error("Error fetching redemption alerts with Gemini:", error);
    throw error;
  }
};
