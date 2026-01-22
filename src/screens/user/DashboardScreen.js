import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { useContext, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { ThemeContext } from "../../context/ThemeContext";
import { getTransactionHistory } from "../../firebase/historyService";
import {UserDataContext} from "../../context/UserDataContext";
export default function DashboardScreen() {
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigation();

  const { profile : user} = useContext(UserDataContext);
  const [recentTx, setRecentTx] = useState([]);
  const [streak, setStreak] = useState(0);

  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  useFocusEffect(
    useCallback(() => {
      const loadDashboard = async () => {
      const history = await getTransactionHistory();

      setRecentTx(history.slice(0, 3));
      calculateStreak(history);
      prepareCalendar(history);


      };

      loadDashboard();
    }, [])
  );

  /* 🔥 STRICT DAILY STREAK */
  const calculateStreak = (history) => {
    if (!history || history.length === 0) {
      setStreak(0);
      return;
    }

    const earnTx = history.filter(tx => tx.type === "earn");
    if (earnTx.length === 0) {
      setStreak(0);
      return;
    }

    const days = earnTx.map(tx => {
      const d = new Date(tx.timestamp.seconds * 1000);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

    const uniqueDays = [...new Set(days)].sort((a, b) => b - a);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (uniqueDays[0] !== today.getTime()) {
      setStreak(0);
      return;
    }

    let count = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(today);
      prev.setDate(prev.getDate() - count);

      if (uniqueDays[i] === prev.getTime()) count++;
      else break;
    }

    setStreak(count);
  };

  /* 📅 CALENDAR MARKS */
  const prepareCalendar = (history) => {
    const marks = {};

    history
      .filter(tx => tx.type === "earn")
      .forEach(tx => {
        const date = new Date(tx.timestamp.seconds * 1000)
          .toISOString()
          .split("T")[0];

        marks[date] = {
          marked: true,
          dotColor: "#ff7043"
        };
      });

    setMarkedDates(marks);
  };

  const totalWaste = user?.totalWasteKg ?? 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 👋 HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Hi, {user?.name ?? "User"} 👋
            </Text>
            <Text style={{ color: theme.subText }}>
              Let’s recycle today 🌱
            </Text>
          </View>

          {/* 🔥 STREAK (CLICKABLE) */}
          {streak > 0 && (
            <TouchableOpacity
              style={styles.streakBadge}
              onPress={() => setShowCalendar(true)}
            >
              <Ionicons name="flame" size={18} color="#ff7043" />
              <Text style={styles.streakText}>{streak}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 💰 WALLET */}
        <View style={[styles.walletCard, { backgroundColor: theme.primary }]}>
          <Text style={styles.walletLabel}>Wallet Balance</Text>
          <Text style={styles.walletAmount}>
            {(user?.walletBalance ?? 0).toFixed(2)} Coins
          </Text>
        </View>

        {/* ⚡ QUICK ACTIONS */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Quick Actions
        </Text>

        <View style={styles.actionsRow}>
          <ActionButton icon="qr-code" label="Scan" onPress={() => navigation.navigate("Scan")} theme={theme} />
          <ActionButton icon="gift" label="Redeem" onPress={() => navigation.navigate("Redeem")} theme={theme} />
          <ActionButton icon="time" label="History" onPress={() => navigation.navigate("History")} theme={theme} />
        </View>

        {/* 🧾 RECENT ACTIVITY */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Recent Activity
        </Text>

        {recentTx.length === 0 && (
          <Text style={{ color: theme.subText }}>No activity yet</Text>
        )}

        {recentTx.map(tx => (
          <View key={tx.id} style={[styles.activityItem, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.text }}>
              {tx.type === "earn" ? "♻" : "🎟"} {tx.material ?? tx.title}
            </Text>
            <Text style={tx.type === "earn" ? styles.positive : styles.negative}>
              {tx.type === "earn" ? "+" : "-"}
              {Number(tx.coins).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* 🌍 IMPACT */}
        <View style={[styles.impactHighlight, { backgroundColor: theme.primary + "15" }]}>
          <Text style={[styles.impactTitle, { color: theme.primary }]}>
            Your Impact 🌍
          </Text>

          <View style={styles.impactRow}>
              <Text style={{ color: theme.primary, fontSize: 20 }}>♻</Text>
              <Text style={[styles.impactText, { color: theme.text }]}>
                {totalWaste.toFixed(2)} kg waste recycled
              </Text>
            </View>

          <View style={styles.impactRow}>
            <Ionicons name="cloud" size={20} color={theme.primary} />
            <Text style={[styles.impactText, { color: theme.text }]}>
              {(totalWaste * 1.4).toFixed(2)} kg CO₂ saved
            </Text>
          </View>

          <View style={styles.impactRow}>
            <Ionicons name="leaf" size={20} color={theme.primary} />
            <Text style={[styles.impactText, { color: theme.text }]}>
              Equivalent to planting {Math.floor(totalWaste / 0.8)} trees
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 📅 STREAK CALENDAR OVERLAY */}
      <Modal visible={showCalendar} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.calendarBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.calendarTitle, { color: theme.primary }]}>
              🔥 Recycling Streak
            </Text>

            <Calendar
              markedDates={markedDates}
              theme={{
                calendarBackground: theme.card,
                dayTextColor: theme.text,
                monthTextColor: theme.text,
                todayTextColor: theme.primary,
                arrowColor: theme.primary
              }}
            />

            <TouchableOpacity onPress={() => setShowCalendar(false)}>
              <Text style={{ color: theme.primary, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* 🔘 QUICK ACTION BUTTON */
function ActionButton({ icon, label, onPress, theme }) {
  return (
    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.card }]} onPress={onPress}>
      <Ionicons name={icon} size={24} color={theme.primary} />
      <Text style={{ color: theme.text, marginTop: 5 }}>{label}</Text>
    </TouchableOpacity>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  greeting: { fontSize: 24, fontWeight: "bold" },

  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe0b2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20
  },

  streakText: { marginLeft: 4, fontWeight: "bold", color: "#e65100" },

  walletCard: { marginTop: 20, padding: 25, borderRadius: 16, alignItems: "center" },

  walletLabel: { color: "#e0e0e0" },
  walletAmount: { fontSize: 32, fontWeight: "bold", color: "#fff" },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 25, marginBottom: 10 },

  actionsRow: { flexDirection: "row", justifyContent: "space-between" },

  actionBtn: { width: "30%", padding: 15, borderRadius: 12, alignItems: "center" },

  activityItem: { padding: 15, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },

  positive: { color: "#2e7d32", fontWeight: "bold" },
  negative: { color: "#c62828", fontWeight: "bold" },

  impactHighlight: { marginTop: 30, padding: 20, borderRadius: 18 },
  impactTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },

  impactRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  impactText: { marginLeft: 5, fontSize: 15 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },

  calendarBox: { width: "90%", borderRadius: 16, padding: 15 },
  calendarTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 }
});
