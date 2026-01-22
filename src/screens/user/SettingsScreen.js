import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.primary }]}>
          Settings
        </Text>

        {/* -------- Account Section -------- */}
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>
          Account
        </Text>

        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="person-outline" size={20} color={theme.primary} />
            <Text style={[styles.optionText, { color: theme.text }]}>
              Edit Profile
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.subText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="key-outline" size={20} color={theme.primary} />
            <Text style={[styles.optionText, { color: theme.text }]}>
              Change Password
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.subText} />
        </TouchableOpacity>

        {/* -------- Appearance Section -------- */}
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>
          Appearance
        </Text>

        <View style={[styles.optionCard, { backgroundColor: theme.card }]}>
          <View style={styles.optionLeft}>
            <Ionicons
              name={isDark ? "moon-outline" : "sunny-outline"}
              size={20}
              color={theme.primary}
            />
            <Text style={[styles.optionText, { color: theme.text }]}>
              Dark Mode
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? theme.primary : "#ccc"}
          />
        </View>

        {/* -------- About Section -------- */}
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>
          About
        </Text>

        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("About")}
        >
          <View style={styles.optionLeft}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={theme.primary}
            />
            <Text style={[styles.optionText, { color: theme.text }]}>
              About WasteCoin
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.subText} />
        </TouchableOpacity>

        {/* -------- Logout -------- */}
        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: theme.card }]}
          onPress={() => signOut(auth)}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="log-out-outline" size={20} color="#c62828" />
            <Text style={[styles.optionText, { color: "#c62828" }]}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
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
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center"
  },

  sectionTitle: {
    fontSize: 14,
    marginTop: 25,
    marginBottom: 10
  },

  optionCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  optionText: {
    fontSize: 16
  }
});
