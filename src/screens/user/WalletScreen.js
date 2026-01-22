import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useContext } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { ThemeContext } from "../../context/ThemeContext";
import { getUserProfile } from "../../firebase/userService";
import { getTransactionHistory } from "../../firebase/historyService";

export default function WalletScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();

  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const profile = await getUserProfile();
        const txns = await getTransactionHistory();

        setWallet(profile);
        setHistory(txns.slice(0, 5)); // latest 5
      };

      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.primary }]}>
          My Wallet
        </Text>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
          <Ionicons name="wallet" size={40} color="#fff" />
          <Text style={styles.balanceText}>
            {wallet?.walletBalance?.toFixed(2) ?? "0.00"}
          </Text>
          <Text style={styles.balanceLabel}>WasteCoins</Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.subText }}>Total Waste</Text>
            <Text style={{ color: theme.text, fontWeight: "bold" }}>
              {(wallet?.totalWasteKg ?? 0).toFixed(2)} kg
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.subText }}>CO₂ Saved</Text>
            <Text style={{ color: theme.text, fontWeight: "bold" }}>
              {((wallet?.totalWasteKg ?? 0) * 1.4).toFixed(2)} kg
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Recent Activity
        </Text>

        {history.length === 0 && (
          <Text style={[styles.emptyText, { color: theme.subText }]}>
            No transactions yet
          </Text>
        )}

        {history.map((tx) => (
          <View
            key={tx.id}
            style={[styles.activityItem, { backgroundColor: theme.card }]}
          >
            <Text style={{ color: theme.text }}>
              {tx.type === "earn" ? "♻" : "🎟"} {tx.material ?? tx.title}
            </Text>

            <Text
              style={
                tx.type === "earn"
                  ? styles.positive
                  : styles.negative
              }
            >
              {tx.type === "earn" ? "+" : "-"}
              {Number(tx.coins).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* View All Button */}
        <TouchableOpacity
          style={[styles.viewAllBtn, { borderColor: theme.primary }]}
          onPress={() => navigation.navigate("History")}
        >
          <Text style={{ color: theme.primary, fontWeight: "bold" }}>
            View All Transactions →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },

  balanceCard: {
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 25
  },

  balanceText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff"
  },

  balanceLabel: {
    color: "#e0e0e0"
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  summaryCard: {
    width: "48%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center"
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15
  },

  activityItem: {
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  positive: {
    color: "#2e7d32",
    fontWeight: "bold"
  },

  negative: {
    color: "#c62828",
    fontWeight: "bold"
  },

  emptyText: {
    textAlign: "center"
  },

  viewAllBtn: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center"
  }
});
