# 🚀 BluBeam: Bluetooth P2P Chat App

![BluBeam Logo](./assets/images/icon.png)

---

## 💬 What is BluBeam?

BluBeam is a modern, cross-platform **Bluetooth-based peer-to-peer (P2P) chat app** built with React Native and Expo. It lets you discover nearby users and chat with them — all **without the internet!**

---

## ✨ Features

- 🔒 **Secure Account Creation** (username & keypair)
- 📡 **Scan for Nearby Devices** using Bluetooth (BLE)
- 💬 **Chat** with users around you (P2P, no server needed)
- 📲 **Send & Receive Messages** (P2P foundation ready)
- 🎨 **Modern UI** with dark/light themes
- 🧩 **Expo Router** for smooth navigation
- 🛡️ **Secure Key Storage**
- 🦋 **Bluetooth Advertising** (your phone can be discovered by others)
- 🛠️ **Ready for Android** (iOS support limited by BLE restrictions)

---

## 📸 Screenshots

> _Add your screenshots here!_
>
> ![Home Screen](./assets/images/screenshot-home.png) > ![Chat Screen](./assets/images/screenshot-chat.png)

---

## 🛠️ Tech Stack

- **React Native** (with Expo)
- **Expo Router**
- **react-native-ble-plx** (BLE scanning/connecting)
- **react-native-ble-advertiser** (BLE advertising)
- **TypeScript**
- **AsyncStorage & Keychain** (secure storage)

---

## 🚦 How to Run

1. **Clone the repo:**
   ```sh
   git clone https://github.com/Madhav1716/BluBeam.git
   cd BluBeam
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the app:**
   ```sh
   npx expo run:android
   # or for iOS (limited BLE support):
   npx expo run:ios
   ```
4. **Permissions:**
   - Make sure to grant all Bluetooth and location permissions on your device.

---

## 🧑‍💻 Usage

- Open the app on two Android devices.
- Create an account on each.
- Tap the scan button to find nearby users.
- Tap a user to start chatting!
- (Both devices must have the app open and Bluetooth enabled.)

---

## ⚡ Roadmap

- [x] BLE scan/connect (central mode)
- [x] BLE advertising (peripheral mode)
- [x] P2P message sending
- [ ] P2P message receiving (in progress)
- [ ] Persistent chat history
- [ ] iOS full support
- [ ] UI polish & animations

---

## 🙏 Credits

- Built by [Madhav1716](https://github.com/Madhav1716) and contributors
- Powered by [Expo](https://expo.dev/) and the open-source community

---

## 📄 License

MIT
