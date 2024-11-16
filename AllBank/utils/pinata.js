import axios from 'axios';
import { PINATA_API_KEY, PINATA_SECRET_API_KEY } from '@env';

const PINATA_BASE_URL = 'https://api.pinata.cloud/pinning';

// Upload data to Pinata
export const uploadToPinata = async (data, fileName = 'data.json') => {
  const formData = new FormData();
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('file', blob, fileName);

  try {
    const response = await axios.post(`${PINATA_BASE_URL}/pinFileToIPFS`, formData, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Pinata Upload Error:', error);
    throw error;
  }
};

// Retrieve data from Pinata
export const getFromPinata = async (hash) => {
  try {
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`);
    return response.data;
  } catch (error) {
    console.error('Pinata Get Data Error:', error);
    throw error;
  }
};
