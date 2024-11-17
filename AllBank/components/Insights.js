import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import Markdown from "react-native-markdown-display";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { GOOGLE_GEMINI_API } from "@env";

const mockData = {
  userId: "userId123",
  name: "Anushka Hedaoo",
  accounts: {
    savings: {
      currentBalance: 20700,
      monthlyDeposit: 500,
      annualInterestRate: 0.04,
      savingsGoal: 50000,
    },
    personalLoan: {
      principalAmount: 9650,
      interestRate: 0.06,
      remainingTermMonths: 24,
      currentMonthlyPayment: 450,
      extraPaymentAmount: 50,
      creditScore: 720,
    },
    creditCard: {
      outstandingBalance: 2800,
      interestRateAPR: 0.18,
      minimumMonthlyPayment: 100,
      currentMonthlyPayment: 200,
      transferFees: 50,
    },
  },
  transactions: [
    { transactionId: "txn001", date: "2024-11-01", type: "deposit", amount: 500 },
    { transactionId: "txn002", date: "2024-11-05", type: "withdrawal", amount: 300 },
    { transactionId: "txn003", date: "2024-11-10", type: "payment", amount: 450 },
    { transactionId: "txn004", date: "2024-11-12", type: "payment", amount: 200 },
    { transactionId: "txn005", date: "2024-11-15", type: "deposit", amount: 1000 },
  ],
};

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(false);

  const API_KEY = GOOGLE_GEMINI_API;

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = "Assistant: Hello! Welcome to your personalized financial assistant.";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(text);
      showMessage({
        message: "Welcome to Gemini Chat 🤖",
        description: text,
        type: "info",
        icon: "info",
        duration: 2000,
      });
      setMessages([{ text, user: false }]);
    };

    startChat();
  }, []);

  const sendMessage = async () => {
    setLoading(true);
  
    // User message with bold formatting
    const userMessage = {
      text: `**${mockData.name}**: ${userInput}`,
      user: true,
    };
    setMessages([...messages, userMessage]);
  
    // Construct the prompt with default user information
    const userData = mockData;
    const defaultContext = `
      User Profile:
      - Name: ${userData.name}
      - Savings Account: 
        - Balance: $${userData.accounts.savings.currentBalance}
        - Monthly Deposit: $${userData.accounts.savings.monthlyDeposit}
        - Annual Interest Rate: ${userData.accounts.savings.annualInterestRate * 100}%
        - Savings Goal: $${userData.accounts.savings.savingsGoal}
      - Personal Loan:
        - Principal Amount: $${userData.accounts.personalLoan.principalAmount}
        - Interest Rate: ${userData.accounts.personalLoan.interestRate * 100}%
        - Remaining Term: ${userData.accounts.personalLoan.remainingTermMonths} months
        - Current Monthly Payment: $${userData.accounts.personalLoan.currentMonthlyPayment}
        - Extra Payment: $${userData.accounts.personalLoan.extraPaymentAmount}
        - Credit Score: ${userData.accounts.personalLoan.creditScore}
      - Credit Card:
        - Outstanding Balance: $${userData.accounts.creditCard.outstandingBalance}
        - APR: ${userData.accounts.creditCard.interestRateAPR * 100}%
        - Minimum Monthly Payment: $${userData.accounts.creditCard.minimumMonthlyPayment}
        - Current Monthly Payment: $${userData.accounts.creditCard.currentMonthlyPayment}
        - Transfer Fees: $${userData.accounts.creditCard.transferFees}
      - Recent Transactions:
        ${userData.transactions
          .map(
            (txn) =>
              `- ${txn.date}: ${txn.type} of $${txn.amount} (Transaction ID: ${txn.transactionId})`
          )
          .join("\n")}
    `;
  
    // Combine the default context with the user's input query
    const prompt = `
      ${defaultContext}
  
      User query: ${userInput}
    `;
  
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
  
      // Assistant message with bold formatting
      const assistantMessage = {
        text: `**Assistant**: ${text}`,
        user: false,
      };
  
      // Update messages state with both user and assistant messages
      setMessages([...messages, userMessage, assistantMessage]);
      setLoading(false);
      setUserInput("");
  
      // Speak the response if needed
      if (text && !isSpeaking) {
        Speech.speak(text);
        setIsSpeaking(true);
        setShowStopIcon(true);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = {
        text: "**Assistant**: There was an error processing your request. Please try again later.",
        user: false,
      };
      setMessages([...messages, userMessage, errorMessage]);
      setLoading(false);
    }
  };
  
  
  

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(messages[messages.length - 1].text);
      setIsSpeaking(true);
    }
  };

  const ClearMessage = () => {
    setMessages("");
    setIsSpeaking(false);
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      {item.user ? (
        <Text style={[styles.messageText, styles.userMessage]}>{item.text}</Text>
      ) : (
        <Markdown style={markdownStyles}>{item.text}</Markdown>
      )}
    </View>
  );

  const markdownStyles = {
    body: { color: "#000", fontSize: 16 },
    strong: { fontWeight: "bold", color: "#000" }, // Bold text
    em: { fontStyle: "italic", color: "#f0e68c" }, // Italic text
    paragraph: { marginBottom: 10 },
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.text}
        inverted
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.micIcon} onPress={toggleSpeech}>
          {isSpeaking ? (
            <FontAwesome name="microphone-slash" size={24} color="white" />
          ) : (
            <FontAwesome name="microphone" size={24} color="white" />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          onSubmitEditing={sendMessage}
          style={styles.input}
          placeholderTextColor="#fff"
        />
        {showStopIcon && (
          <TouchableOpacity style={styles.stopIcon} onPress={ClearMessage}>
            <Entypo name="controller-stop" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffff", marginTop: 50 },
  messageContainer: { padding: 10, marginVertical: 5 },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 10,
    height: 50,
    color: "white",
  },
  micIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  stopIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
});

export default GeminiChat;
