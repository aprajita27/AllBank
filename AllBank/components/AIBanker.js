import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import Markdown from "react-native-markdown-display";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { GOOGLE_GEMINI_API } from "@env";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Alert } from "react-native";

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(false);
  const [userDetails, setUserDetails] = useState({name: "", phone: ""});
  const [userData, setUserData] = useState("");
  const [defaultContext, setDefaultContext] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [amount, setAmount] = useState("");

  const API_KEY = GOOGLE_GEMINI_API;

  useEffect(() => {
	const fetchUserData = async () => {
	  try {
		const user = auth.currentUser;	
				if (user) {
					const docRef = doc(db, "users", user.uid); 
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						const { firstName, lastName, phone } = docSnap.data();
						const fullName = `${firstName} ${lastName}`;
						setUserDetails({ name: fullName, phone });
						setUserData(docSnap.data());
		  				initializeChat(docSnap.data());
					}
					 else {
						Alert.alert(
							"Error",
							"User details not found in the database. Please update your profile."
						);
					}
				}
	  } catch (error) {
		console.error("Error fetching user data:", error);
	  }
	};
  
	fetchUserData();
  }, []);

  const initializeChat = (userData) => {
	const defaultContext = `
	  User Profile:
	  - Name: ${userData.name}
	  - Account Number: ${userData.accountNumber}
	  - Savings Account:
		- Current Balance: $${userData.accounts.savings.currentBalance}
		- Monthly Deposit: $${userData.accounts.savings.monthlyDeposit}
		- Annual Interest Rate: ${userData.accounts.savings.annualInterestRate * 100}%
		- Savings Goal: $${userData.accounts.savings.savingsGoal}
	  - Recent Transactions:
	  ${userData.accounts.transactions.map(
		(txn) =>
		  `- ${txn.timestamp}: ${txn.type} of $${txn.amount} (Transaction ID: ${txn.transactionId})`
	  ).join("\n")}
	  - Goals:
	  ${userData.accounts.goals.map(
		(goal) =>
		  `- Goal: ${goal.goalName}, Target: $${goal.targetAmount}, Saved: $${goal.savedAmount}, Motivation: ${goal.motivation}`
	  ).join("\n")}
	  - Investments:
	  ${userData.accounts.investments.funds.map(
		(fund) =>
		  `- Fund: ${fund.fundName}, Current Value: $${fund.currentValue}, Type: ${fund.liquidityType}`
	  ).join("\n")}
	`;
  
	const startMessage = {
	  text: `Hello, ${userData.name}! How can I assist you with your finances today?`,
	  user: false,
	};
  
	setMessages([startMessage]);
	setDefaultContext(defaultContext);
  };
  

  const sendMessage = async () => {
	setLoading(true);
  
	const userMessage = {
	  text: (
		<Text>
		  <Text style={{ fontWeight: 'bold' }}>{userData.name}</Text>: {userInput}
		</Text>
	  ),
	  user: true,
	};
	setMessages([...messages, userMessage]);
	// analyzeUserInput(userInput);
	try{
	// const sendMoneyRegex = /\b(?:send|transfer|pay|give|deposit|move)\s*(?:money|funds|cash|amount|payment)\b/i;
	// const sendMoneyRegex = /\bsend\b/i;
	// const sendMoneyMatch = input.match(sendMoneyRegex);
	// console.log(sendMoneyMatch)
	// if(sendMoneyMatch){
	// 	const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
	// 	const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	// 	const receiverAccountNo = await model.generateContent("Extract receiver account number");
	// 	setReceiverAccount(receiverAccountNo);
	// 	const routingNo = await model.generateContent("Extract routing number");
	// 	setRoutingNumber(routingNo);
	// 	const money = await model.generateContent("Extract money to be sent");
	// 	setAmount(money);
	// 	console.log(receiverAccount.response.text());
	// 	console.log(amount.response.text())
	// 	console.log(routingNumber.response.text())
	// 	// handleSendMoney();
	// }
}catch (error) {
	console.error("Error generating response:", error);
	setMessages([
	  ...messages,
	  userMessage,
	  { text: "**Assistant**: Error processing request.", user: false },
	]);
	setLoading(false);
  }
  
	// Updated prompt with broader context
	const prompt = `
	  Financial Context:
	  ${defaultContext}
  
	  General Knowledge: The assistant can answer questions beyond user-specific data using its broad knowledge.
  
	  User query: ${userInput}
	`;
  
	try {
	  const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
	  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const sendMoneyRegex = /\bsend\b/i;
		const sendMoneyMatch = userInput.match(sendMoneyRegex);
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
		console.log(sendMoneyMatch)
		if(sendMoneyMatch){
			const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
			const model = genAI.getGenerativeModel({ model: "gemini-pro" });
			const receiverAccountNo = await model.generateContent(userInput+"From the user input, What is the receiver account number");
			setReceiverAccount(receiverAccountNo.response.text());
			const routingNo = await model.generateContent(userInput+"From the user input, What is the routing number");
			setRoutingNumber(routingNo.response.text());
			const money = await model.generateContent(userInput+"From the user input, What is the money to be sent");
			console.log(userInput)
			setAmount(money.response.text());
			console.log(receiverAccount);
			console.log(amount)
			console.log(routingNumber)
			handleSendMoney();
			return;
		}



	  const result = await model.generateContent(prompt);
	  const responseText = result.response.text();
  
	  const assistantMessage = {
		text: `**Assistant**: ${responseText}`,
		user: false,
	  };
  
	  setMessages([...messages, userMessage, assistantMessage]);
	  setLoading(false);
	  setUserInput("");
	} catch (error) {
	  console.error("Error generating response:", error);
	  setMessages([
		...messages,
		userMessage,
		{ text: "**Assistant**: Error processing request.", user: false },
	  ]);
	  setLoading(false);
	}
	finally{

	}
  };


  const handleSendMoney = async () => {
	if (!receiverAccount || !routingNumber || !amount) {
		Alert.alert("Error", "All fields are mandatory.");
		return;
	}

	// Ask the user for confirmation before proceeding
	Alert.alert(
		"Confirm Transfer",
		`Are you sure you want to send $${amount} to account ${receiverAccount}?`,
		[
			{
				text: "Cancel",
				style: "cancel",
				onPress: () => {
					console.log("Transfer canceled by user.");
					return;
				},
			},
			{
				text: "Confirm",
				onPress: async () => {
					setLoading(true);
					try {
						// Fetch sender details
						const senderRef = doc(db, "users", auth.currentUser.uid);
						const senderSnap = await getDoc(senderRef);

						if (!senderSnap.exists()) {
							Alert.alert("Error", "Sender account not found.");
							setLoading(false);
							return;
						}

						const senderData = senderSnap.data();
						const senderBalance = senderData.accounts.savings.currentBalance;

						if (parseFloat(amount) > senderBalance) {
							Alert.alert("Error", "Insufficient balance.");
							setLoading(false);
							return;
						}

						// Check if receiver exists in `accountMappings`
						const mappingRef = doc(db, "accountMappings", receiverAccount);
						const mappingSnap = await getDoc(mappingRef);

						if (!mappingSnap.exists()) {
							Alert.alert("Error", "Receiver account does not exist.");
							setLoading(false);
							return;
						}

						// Fetch receiver details
						const receiverUid = mappingSnap.data().uid;
						const receiverRef = doc(db, "users", receiverUid);
						const receiverSnap = await getDoc(receiverRef);

						if (!receiverSnap.exists()) {
							Alert.alert("Error", "Receiver account data missing.");
							setLoading(false);
							return;
						}

						const receiverData = receiverSnap.data();

						// Update sender account
						await updateDoc(senderRef, {
							"accounts.savings.currentBalance": senderBalance - parseFloat(amount),
							"accounts.transactions": arrayUnion({
								transactionId: `txn_${Date.now()}`,
								senderAccountNumber: senderData.accountNumber,
								receiverAccountNumber: receiverAccount,
								type: "transfer",
								description: "Money Transfer",
								amount: parseFloat(amount),
								timestamp: new Date().toISOString(),
							}),
						});

						// Update receiver account
						await updateDoc(receiverRef, {
							"accounts.savings.currentBalance":
								receiverData.accounts.savings.currentBalance + parseFloat(amount),
							"accounts.transactions": arrayUnion({
								transactionId: `txn_${Date.now()}`,
								senderAccountNumber: senderData.accountNumber,
								receiverAccountNumber: receiverAccount,
								type: "receive",
								description: "Money Received",
								amount: parseFloat(amount),
								timestamp: new Date().toISOString(),
							}),
						});

						Alert.alert("Success", "Money sent successfully!");
						// navigation.navigate("Banking");
					} catch (error) {
						console.error("Error sending money:", error);
						Alert.alert("Error", "Failed to send money. Please try again.");
					} finally {
						setLoading(false);
					}
				},
			},
		]
	);
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
	body: {
	  color: "#2C3A47",
	  fontSize: 16,
	},
	strong: {
	  fontWeight: "bold",
	  color: "#000",
	},
	em: {
	  fontStyle: "italic",
	  color: "#8A9BB2",
	},
	paragraph: {
	  marginBottom: 10,
	},
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
          placeholderTextColor="#000"
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
	container: {
	  flex: 1,
	  backgroundColor: "#EAEFF5", // Light background for contrast
	  paddingTop: 50,
	},
	messageContainer: {
	  padding: 10,
	  marginVertical: 5,
	  borderRadius: 10,
	  maxWidth: "80%",
	  alignSelf: "flex-start",
	  backgroundColor: "#fff",
	  shadowColor: "#000",
	  shadowOffset: { width: 0, height: 2 },
	  shadowOpacity: 0.1,
	  shadowRadius: 4,
	  elevation: 2,
	},
	userMessage: {
	  alignSelf: "flex-end",
	  backgroundColor: "#fff", // User message background
	  color: "#000",
	},
	messageText: {
	  fontSize: 16,
	  color: "#000",
	},
	inputContainer: {
	  flexDirection: "row",
	  alignItems: "center",
	  padding: 10,
	  backgroundColor: "#7399C6",
	  paddingBottom: 10
	},
	input: {
	  flex: 1,
	  padding: 15,
	  backgroundColor: "#EAEFF5",
	  borderRadius: 20,
	  height: 50,
	  color: "#2C3A47",
	  fontSize: 16,
	},
	micIcon: {
	  padding: 10,
	  backgroundColor: "#2C3A47",
	  borderRadius: 25,
	  height: 50,
	  width: 50,
	  justifyContent: "center",
	  alignItems: "center",
	  marginRight: 5,
	},
	stopIcon: {
	  padding: 10,
	  backgroundColor: "#2C3A47",
	  borderRadius: 25,
	  height: 50,
	  width: 50,
	  justifyContent: "center",
	  alignItems: "center",
	  marginLeft: 5,
	},
  });
  

export default GeminiChat;
