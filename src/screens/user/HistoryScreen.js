import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useContext } from "react";

import { ThemeContext } from "../../context/ThemeContext";
import { getTransactionHistory } from "../../firebase/historyService";

export default function HistoryScreen() {
  const { theme } = useContext(ThemeContext);

  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all"); // all | earn | redeem

  useEffect(() => {
    getTransactionHistory().then(setHistory);
  }, []);

  const filteredHistory =
    filter === "all"
      ? history
      : history.filter(tx => tx.type === filter);

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: theme.card }]}>
      <View>
        <Text style={{ color: theme.text, fontWeight: "600" }}>
          {item.type === "earn" ? "♻ Recycled" : "🎟 Redeemed"}
        </Text>
        <Text style={{ color: theme.subText, fontSize: 13 }}>
          {item.material ?? item.title}
        </Text>
      </View>

      <Text
        style={
          item.type === "earn"
            ? styles.positive
            : styles.negative
        }
      >
        {item.type === "earn" ? "+" : "-"}
        {Number(item.coins).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>     

        {/* FILTER BUTTONS */}
        <View style={styles.filterRow}>
          <FilterButton
            label="All"
            active={filter === "all"}
            onPress={() => setFilter("all")}
            theme={theme}
          />
          <FilterButton
            label="Earned"
            active={filter === "earn"}
            onPress={() => setFilter("earn")}
            theme={theme}
          />
          <FilterButton
            label="Redeemed"
            active={filter === "redeem"}
            onPress={() => setFilter("redeem")}
            theme={theme}
          />
        </View>

        {/* LIST */}
        <FlatList
          data={filteredHistory}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={{
                color: theme.subText,
                textAlign: "center",
                marginTop: 30
              }}
            >
              No transactions found
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

/* ---------- FILTER BUTTON ---------- */
function FilterButton({ label, active, onPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterBtn,
        {
          backgroundColor: active ? theme.primary : theme.card,
          borderColor: theme.primary
        }
      ]}
    >
      <Text
        style={{
          color: active ? "#fff" : theme.text,
          fontWeight: "bold"
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },

  filterBtn: {
    width: "32%",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1
  },

  item: {
    padding: 15,
    borderRadius: 12,
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
  }
});
