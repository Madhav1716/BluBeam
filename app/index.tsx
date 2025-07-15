import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import * as Keychain from "react-native-keychain";

export default function Index() {
  useEffect(() => {
    const checkUserAccount = async () => {
      try {
        const existingUsername = await AsyncStorage.getItem("username");
        const existingPublicKey = await AsyncStorage.getItem("publicKey");
        const existingPrivateKey = await Keychain.getGenericPassword();

        if (existingUsername && existingPublicKey && existingPrivateKey) {
          console.log("👤 User has account, redirecting to HomeScreen");
          router.replace("/HomeScreen");
        } else {
          console.log("❌ No account found, redirecting to create account");
          router.replace("/createAccountScreen");
        }
      } catch (error) {
        console.log("❌ Error checking account:", error);
        router.replace("/createAccountScreen");
      }
    };

    checkUserAccount();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
      }}>
      <ActivityIndicator size="large" color="#0077ff" />
      <Text style={{ marginTop: 20, fontSize: 16, color: "#666" }}>
        Checking account...
      </Text>
    </View>
  );
}
