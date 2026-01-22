import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { ThemeContext } from "../../context/ThemeContext";
import { UserDataContext } from "../../context/UserDataContext";

export default function EditProfileScreen() {
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState("");
  const { profile, setProfile } = useContext(UserDataContext);
  const email = auth.currentUser?.email;

  useEffect(() => {
    const loadProfile = async () => {
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setName(snap.data().name || "");
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await updateDoc(
        doc(db, "users", auth.currentUser.uid),
        { name }
      );

      setProfile({ ...profile, name });

      Alert.alert("Success", "Profile updated successfully");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.text }]}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
        />

        <Text style={[styles.label, { color: theme.text }]}>Email</Text>
        <TextInput
          value={email}
          editable={false}
          style={[styles.input, { backgroundColor: "#e0e0e0" }]}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginBottom: 5 },
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
