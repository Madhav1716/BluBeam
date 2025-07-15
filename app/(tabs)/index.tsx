import "react-native-get-random-values"; // ✅ Add this first!

import { StyleSheet } from "react-native";

import CreateAccountScreen from "../createAccountScreen";

export default function HomeScreen() {
  return <CreateAccountScreen />;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
