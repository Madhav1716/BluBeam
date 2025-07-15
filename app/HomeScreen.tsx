//HomeScreen.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  requestPermissions,
  startAdvertising,
  stopAdvertising,
} from "../lib/bleAdvertiser";
import { manager } from "../lib/bluetooth";

// ❌ BLE disabled for now – enable when using Dev Client or APK
// import { BleManager } from "react-native-ble-plx";
// const manager = new BleManager();

export default function HomeScreen() {
  const [username, setUsername] = useState("");
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const checkUserAccount = async () => {
      const existingUsername = await AsyncStorage.getItem("username");
      const existingPublicKey = await AsyncStorage.getItem("publicKey");

      if (!existingUsername || !existingPublicKey) {
        console.log("❌ No account found, redirecting...");
        router.replace("/createAccountScreen");
        return;
      }

      setUsername(existingUsername);
      console.log("👤 Logged in as:", existingUsername);

      // Request BLE permissions and start advertising
      await requestPermissions();
      startAdvertising(existingUsername);

      // ⛔ Skip BLE scanning if you're testing with one device
      // ✅ Insert dummy users for testing
      setNearbyUsers([
        {
          id: "mock-1",
          name: "Test User 💡",
          publicKey: "mock-public-key-1",
        },
      ]);
    };

    checkUserAccount();

    return () => {
      stopAdvertising();
      if (Platform.OS === "android") {
        manager.stopDeviceScan();
        setScanning(false);
      }
    };
  }, []);

  // BLE scan logic
  const startBLEScan = () => {
    setNearbyUsers([]);
    setScanning(true);
    const found: Record<string, boolean> = {};
    console.log("🔍 Scanning for BLE devices...");
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("❌ BLE Scan Error:", error);
        setScanning(false);
        return;
      }
      if (device?.name && !found[device.id]) {
        found[device.id] = true;
        setNearbyUsers((prev) => [
          ...prev,
          { id: device.id, name: device.name, publicKey: "TBD" },
        ]);
      }
    });
    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
      console.log("⏹ Stopped BLE scan");
    }, 8000);
  };

  const stopBLEScan = () => {
    manager.stopDeviceScan();
    setScanning(false);
    console.log("⏹ Stopped BLE scan");
  };

  const onUserPress = (user: any) => {
    Alert.alert("Start Chat", `Start chat with ${user.name}?`);
    router.push({
      pathname: "/ChatScreen",
      params: {
        name: user.name,
        id: user.id,
        publicKey: user.publicKey,
      },
    });
  };

  const renderUser = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => onUserPress(item)}>
      <Text style={styles.userAvatar}>👤</Text>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userStatus}>🟢 Online</Text>
      </View>
      <Text style={styles.chatIcon}>💬</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.avatar}>👤</Text>
        <View>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
        {/* Optionally, you can remove the scan button for Android, or keep it for manual refresh on iOS. */}
      </View>

      <Text style={styles.heading}>Nearby Users</Text>

      <FlatList
        data={nearbyUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={
          nearbyUsers.length === 0 ? { flex: 1, justifyContent: "center" } : {}
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No users found nearby.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    fontSize: 32,
    marginRight: 12,
  },
  welcome: {
    fontSize: 14,
    color: "#666",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007aff",
  },
  refreshBtn: {
    marginLeft: "auto",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    elevation: 2,
  },
  refreshText: {
    fontSize: 14,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  userAvatar: {
    fontSize: 24,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  userStatus: {
    fontSize: 13,
    color: "#777",
  },
  chatIcon: {
    fontSize: 22,
    color: "#007aff",
  },
  empty: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 40,
  },
});
