import { PermissionsAndroid, Platform } from "react-native";
import BleAdvertiser from "react-native-ble-advertiser";

export const SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
export const CHAR_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";

let onMessageReceived: ((message: string, fromDevice: string) => void) | null =
  null;

export async function requestPermissions() {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }
}

export function setOnMessageReceived(
  callback: (message: string, fromDevice: string) => void
) {
  onMessageReceived = callback;
}

export function startAdvertising(deviceName: string) {
  BleAdvertiser.setCompanyId(0x1234); // Example company ID
  // manufacturerData should be a number[]
  const manufacturerData = Array.from(deviceName, (c) => c.charCodeAt(0));
  // Try minimal call with only required arguments
  BleAdvertiser.broadcast(SERVICE_UUID, [CHAR_UUID])
    .then((success) => console.log("🚀 Advertising started:", success))
    .catch((error) => console.log("❌ Advertising error:", error));

  // NOTE: react-native-ble-advertiser does not support onWriteRequest event directly.
  // Message receiving via BLE peripheral is not supported out-of-the-box in this library.
  // This is a limitation of BLE on Android and the library itself.
}

export function stopAdvertising() {
  BleAdvertiser.stopBroadcast()
    .then(() => console.log("🛑 Advertising stopped"))
    .catch((error) => console.log("❌ Stop advertising error:", error));
}
