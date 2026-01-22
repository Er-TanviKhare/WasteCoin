import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useContext } from "react";
import {UserDataContext} from "../../context/UserDataContext";
import { ThemeContext } from "../../context/ThemeContext";
import { calculateCoins } from "../../utils/rewardCalculator";
import { addEarnTransaction } from "../../firebase/transactionService";

export default function ScanScreen() {
  const { theme } = useContext(ThemeContext);
  const { refreshProfile } = useContext(UserDataContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  

  const handleScan = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const { qrId, material, weight } = JSON.parse(data);

      if (!qrId || !material || !weight) {
        throw new Error("Invalid QR Code");
      }

      const coins = calculateCoins(material, weight);
      await addEarnTransaction({ qrId, material, weight, coins });

      await refreshProfile();


      Alert.alert(
        "Success 🎉",
        `You earned ${coins.toFixed(2)} WasteCoins`
      );
    } catch (e) {
      Alert.alert("Error", e.message);
    }

    setTimeout(() => setScanned(false), 2000);
  };

  /* ---------------- Permission UI ---------------- */
  if (!permission?.granted) {
    return (
      <SafeAreaView
        style={[
          styles.center,
          { backgroundColor: theme.background }
        ]}
      >
        <Text style={{ color: theme.text, marginBottom: 10 }}>
          Camera permission is required
        </Text>

        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: theme.primary, fontWeight: "bold" }}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /* ---------------- Scanner UI ---------------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.primary }]}>
          Scan Waste QR
        </Text>

        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleScan}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },

  camera: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden"
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
