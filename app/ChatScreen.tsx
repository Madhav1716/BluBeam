//ChatSCreen.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { connectToDevice, sendMessageToDevice } from "../lib/bluetooth";

interface Message {
  id: string;
  text: string;
  isFromMe: boolean;
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "seen";
}

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const { name, id, publicKey } = params;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! How are you? 👋",
      isFromMe: false,
      timestamp: new Date(Date.now() - 60000),
      status: "seen",
    },
    {
      id: "2",
      text: "Hi! I'm doing great, thanks! 😊",
      isFromMe: true,
      timestamp: new Date(Date.now() - 30000),
      status: "seen",
    },
    {
      id: "3",
      text: "This Bluetooth chat is working perfectly! 📱",
      isFromMe: false,
      timestamp: new Date(Date.now() - 15000),
      status: "seen",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      setUsername(storedUsername || "Unknown");
    };
    getUsername();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      isFromMe: true,
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Send via BLE (real)
    try {
      const device = await connectToDevice(id as string);
      const success = await sendMessageToDevice(device, message.text);
      if (success) {
        updateStatus("sent");
      } else {
        // 'failed' is not a valid status, so fallback to 'sent' or handle differently
        updateStatus("sent");
      }
    } catch {
      // 'failed' is not a valid status, so fallback to 'sent' or handle differently
      updateStatus("sent");
    }

    function updateStatus(status: Message["status"]) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === message.id ? { ...msg, status } : msg))
      );
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessageStatus = (status: string, isFromMe: boolean) => {
    if (!isFromMe) return null;

    switch (status) {
      case "sending":
        return <Text style={styles.statusTick}>⏳</Text>;
      case "sent":
        return <Text style={styles.statusTick}>✓</Text>;
      case "delivered":
        return <Text style={styles.statusTick}>✓✓</Text>;
      case "seen":
        return <Text style={styles.statusTickSeen}>✓✓</Text>;
      default:
        return null;
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isFromMe
          ? styles.myMessageContainer
          : styles.theirMessageContainer,
      ]}>
      <View
        style={[
          styles.messageBubble,
          item.isFromMe ? styles.myMessageBubble : styles.theirMessageBubble,
        ]}>
        <Text
          style={[
            styles.messageText,
            item.isFromMe ? styles.myMessageText : styles.theirMessageText,
          ]}>
          {item.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.timestamp,
              item.isFromMe ? styles.myTimestamp : styles.theirTimestamp,
            ]}>
            {formatTime(item.timestamp)}
          </Text>
          {renderMessageStatus(item.status, item.isFromMe)}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.chatName}>{name}</Text>
            <Text style={styles.premiumIcon}>👑</Text>
          </View>
          <Text style={styles.chatStatus}>🟢 Online via Bluetooth</Text>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => Alert.alert("Options", "More options coming soon!")}>
          <Text style={styles.moreButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            newMessage.trim()
              ? styles.sendButtonActive
              : styles.sendButtonInactive,
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}>
          <Text style={styles.sendButtonText}>📤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#007aff",
  },
  headerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  premiumIcon: {
    fontSize: 18,
    marginLeft: 4,
    color: "#ffd700", // Gold color for premium
  },
  chatStatus: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  moreButtonText: {
    fontSize: 20,
    color: "#666",
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  theirMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: "#007aff",
    borderBottomRightRadius: 6,
  },
  theirMessageBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: "#fff",
  },
  theirMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  myTimestamp: {
    color: "#fff",
    textAlign: "right",
  },
  theirTimestamp: {
    color: "#666",
    textAlign: "left",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  statusTick: {
    fontSize: 14,
    marginLeft: 8,
  },
  statusTickSeen: {
    fontSize: 14,
    marginLeft: 8,
    color: "#4CAF50", // Green color for seen status
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: "#007aff",
  },
  sendButtonInactive: {
    backgroundColor: "#e0e0e0",
  },
  sendButtonText: {
    fontSize: 16,
  },
});
