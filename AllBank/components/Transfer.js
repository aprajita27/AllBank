import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

export default function Transfer() {
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const recipients = [
    { id: '1', name: 'Evelyn Smith', avatar: require('../assets/icons/logo.png') },
    { id: '2', name: 'Emily Atkinson', avatar: require('../assets/icons/logo.png') },
  ];

  const handleTransfer = (recipient) => {
    setSelectedRecipient(recipient);
    alert(`Transferred successfully to ${recipient.name}!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transfer</Text>
      <Text style={styles.subHeader}>Select a Recipient</Text>
      <FlatList
        data={recipients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipientCard}
            onPress={() => handleTransfer(item)}
          >
            <Image source={item.avatar} style={styles.recipientAvatar} />
            <Text style={styles.recipientName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {selectedRecipient && (
        <View style={styles.transferConfirmation}>
          <Text style={styles.confirmationText}>
            Successfully sent money to {selectedRecipient.name}.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F7F9FB' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#7399C6' },
  paymentCard: {
    alignItems: 'center',
    marginRight: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  paymentIcon: { width: 50, height: 50, marginBottom: 5 },
  paymentText: { fontSize: 12, fontWeight: 'bold' },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#7399C6' },
  recipientCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  recipientAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  recipientName: { fontSize: 16, fontWeight: 'bold' },
});
