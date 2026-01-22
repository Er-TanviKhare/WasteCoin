import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function AboutScreen() {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.primary }]}>
          WasteCoin 🌱
        </Text>

        <Text style={[styles.text, { color: theme.text }]}>
          WasteCoin is a digital reward platform that encourages recycling by
          converting waste deposits into redeemable coins.
        </Text>

        <Text style={[styles.text, { color: theme.text }]}>
          The app promotes sustainable habits, environmental awareness, and
          responsible waste management.
        </Text>

        <Text style={[styles.version, { color: theme.subText }]}>
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  text: {
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 22
  },
  version: {
    marginTop: 20,
    textAlign: "center"
  }
});
