// app/SplashScreen.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    const checkUsername = async () => {
      const name = await AsyncStorage.getItem("username");
      if (name) {
        router.replace("/HomeScreen");
      } else {
        router.replace("/CreateAccountScreen");
      }
    };

    checkUsername();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007aff" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { marginTop: 16, fontSize: 16, color: "#555" },
});
