import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ❌ NO navigation here
      // Firebase auth listener in App.js will redirect
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WasteCoin 🌱</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        color="#000"
        placeholderTextColor={"#000"}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        color="#000"
        placeholderTextColor={"#000"}

      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text
        style={styles.linkText}
        onPress={() => navigation.navigate("Register")}
      >
        Don’t have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#2e7d32"
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#555"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  button: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 8,
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  linkText: {
    textAlign: "center",
    marginTop: 20,
    color: "#2e7d32"
  }
});
