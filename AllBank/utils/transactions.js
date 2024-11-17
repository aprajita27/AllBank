import {
	doc,
	getDoc,
	updateDoc,
	collection,
	addDoc,
	query,
	where,
	getDocs,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const sendMoney = async ({
	senderUid,
	receiverAccountNumber,
	routingNumber,
	amount,
	description,
}) => {
	const staticRoutingNumber = "021000021";

	if (routingNumber !== staticRoutingNumber) {
		throw new Error("Invalid routing number.");
	}

	// Fetch sender account
	const senderRef = doc(db, "accounts", senderUid);
	const senderSnap = await getDoc(senderRef);

	if (!senderSnap.exists()) throw new Error("Sender account not found.");
	const senderData = senderSnap.data();

	// Check balance
	if (senderData.balance < amount) throw new Error("Insufficient balance.");

	// Deduct from sender
	await updateDoc(senderRef, { balance: senderData.balance - amount });

	// Find receiver
	const receiverQuery = query(
		collection(db, "accounts"),
		where("accountNumber", "==", receiverAccountNumber)
	);
	const receiverSnap = await getDocs(receiverQuery);

	if (receiverSnap.empty) throw new Error("Receiver account not found.");
	const receiverDoc = receiverSnap.docs[0];
	const receiverRef = doc(db, "accounts", receiverDoc.id);
	const receiverData = receiverDoc.data();

	// Credit to receiver
	await updateDoc(receiverRef, { balance: receiverData.balance + amount });

	// Log transaction
	const transaction = {
		senderAccountNumber: senderData.accountNumber,
		receiverAccountNumber,
		routingNumber,
		amount,
		type: "debit",
		description,
		timestamp: serverTimestamp(),
	};
	await addDoc(collection(db, "transactions"), transaction);

	const receiverTransaction = { ...transaction, type: "credit" };
	await addDoc(collection(db, "transactions"), receiverTransaction);

	return { success: true, message: "Transaction successful." };
};
