import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";

import { auth } from "../../firebase/firebaseConfig";
import { ThemeContext } from "../../context/ThemeContext";

export default function ChangePasswordScreen() {
  const { theme } = useContext(ThemeContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "All fields are required");
    }

    if (newPassword.length < 6) {
      return Alert.alert("Error", "Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    try {
      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        user.email,
        oldPassword
      );

      // 🔐 Re-authenticate
      await reauthenticateWithCredential(user, credential);

      // 🔑 Update password
      await updatePassword(user, newPassword);

      Alert.alert("Success", "Password updated successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.text }]}>
          Current Password
        </Text>
        <TextInput
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
        />

        <Text style={[styles.label, { color: theme.text }]}>
          New Password
        </Text>
        <TextInput
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
        />

        <Text style={[styles.label, { color: theme.text }]}>
          Confirm New Password
        </Text>
        <TextInput
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleChangePassword}
        >
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    marginBottom: 5
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  button: {
    padding: 14,
    borderRadius: 8,
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
});
