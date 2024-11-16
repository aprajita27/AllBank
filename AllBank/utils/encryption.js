import CryptoJS from "react-native-crypto-js";
import { ENCRYPTION_KEY } from "@env";

// Validate the encryption key
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
	throw new Error(
		"ENCRYPTION_KEY is missing or invalid. It must be a 32-character string for AES-256 encryption."
	);
}

// Encrypt data
export const encryptData = (data) => {
	try {
		// Stringify the data before encryption
		const encrypted = CryptoJS.AES.encrypt(
			JSON.stringify(data),
			ENCRYPTION_KEY
		).toString();

		console.log("Encryption successful:", encrypted); // Optional debug
		return encrypted;
	} catch (error) {
		console.error("Encryption Error:", error.message); // Log error
		throw new Error("Failed to encrypt data.");
	}
};

// Decrypt data
export const decryptData = (encryptedData) => {
	try {
		// Decrypt the encrypted string
		const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);

		// Convert bytes to UTF-8 string
		const decrypted = bytes.toString(CryptoJS.enc.Utf8);

		if (!decrypted) {
			throw new Error("Decryption failed. Data or key might be invalid.");
		}

		console.log("Decryption successful:", decrypted); // Optional debug
		return JSON.parse(decrypted);
	} catch (error) {
		console.error("Decryption Error:", error.message); // Log error
		throw new Error(
			"Failed to decrypt data. Ensure the data and key are valid."
		);
	}
};
