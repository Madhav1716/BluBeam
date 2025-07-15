//createAccountScreen
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Keychain from "react-native-keychain";
import nacl from "tweetnacl";
import { encodeBase64 } from "tweetnacl-util";

export default function CreateAccountScreen() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("#444");

  // Check if user already has an account
  useEffect(() => {
    const checkExistingAccount = async () => {
      try {
        const existingUsername = await AsyncStorage.getItem("username");
        const existingPublicKey = await AsyncStorage.getItem("publicKey");
        const existingPrivateKey = await Keychain.getGenericPassword();

        if (existingUsername && existingPublicKey && existingPrivateKey) {
          console.log("👤 User already has account:", existingUsername);
          router.replace("/HomeScreen");
        }
      } catch (error) {
        console.log("❌ Error checking existing account:", error);
      }
    };

    checkExistingAccount();
  }, []);

  const createAccount = async () => {
    if (!username.trim()) {
      setStatus("⚠️ Please enter a username");
      setStatusColor("#e63946"); // red
      return;
    }

    try {
      const keyPair = nacl.box.keyPair();
      const publicKey = encodeBase64(keyPair.publicKey);
      const privateKey = encodeBase64(keyPair.secretKey);

      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("publicKey", publicKey);
      await Keychain.setGenericPassword("key", privateKey);

      console.log("✅ Account created!");
      console.log("🔐 Public Key:", publicKey);
      console.log("🔐 Private Key:", privateKey);

      setStatus("✅ Account created successfully!");
      setStatusColor("#2a9d8f");

      setTimeout(() => {
        router.push("/HomeScreen"); // 👈 Navigation triggered
      }, 500);
    } catch (err) {
      console.log("❌ Error:", err);
      setStatus("Something went wrong. Try again.");
      setStatusColor("#e63946");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}>
      <View style={styles.card}>
        <Text style={styles.heading}>🚀 Create Your Account</Text>

        <TextInput
          placeholder="Enter a cool username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={createAccount}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {!!status && (
          <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#0077ff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
});
