// lib/bluetooth.ts
import { decode as atob, encode as btoa } from "base-64";
import { BleManager } from "react-native-ble-plx";

export const manager = new BleManager();

export const SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
export const CHAR_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";

export const connectToDevice = async (id: string) => {
  const device = await manager.connectToDevice(id);
  await device.discoverAllServicesAndCharacteristics();
  return device;
};

export const sendMessageToDevice = async (device: any, message: string) => {
  try {
    const encoded = btoa(message);
    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      CHAR_UUID,
      encoded
    );
    return true;
  } catch (error) {
    console.log("❌ Send Error:", error);
    return false;
  }
};

export const monitorIncomingMessages = (
  device: any,
  onReceive: (text: string) => void
) => {
  return device.monitorCharacteristicForService(
    SERVICE_UUID,
    CHAR_UUID,
    (error: any, characteristic: any) => {
      if (error) {
        console.log("❌ Monitor Error:", error);
        return;
      }
      const base64Value = characteristic?.value;
      if (base64Value) {
        const decoded = atob(base64Value);
        onReceive(decoded);
      }
    }
  );
};
