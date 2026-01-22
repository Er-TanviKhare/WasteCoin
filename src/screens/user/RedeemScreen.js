import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useContext } from "react";

import { ThemeContext } from "../../context/ThemeContext";
import { getCoupons } from "../../firebase/couponService";
import { redeemCoupon } from "../../firebase/redeemService";
import { getUserProfile } from "../../firebase/userService";
import { UserDataContext } from "../../context/UserDataContext";

export default function RedeemScreen() {
  const { theme } = useContext(ThemeContext);
  const { profile, refreshProfile } = useContext(UserDataContext);
  const [coupons, setCoupons] = useState([]);
  const walletBalance = profile?.walletBalance ?? 0;

  useEffect(() => {
    getCoupons().then(setCoupons);
  }, []);

  const handleRedeem = async (coupon) => {
    try {
      await redeemCoupon(coupon);
      await refreshProfile();
      Alert.alert("Success 🎉", "Coupon redeemed");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const renderItem = ({ item }) => {
    const disabled = walletBalance < item.requiredCoins;

    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.brand, { color: theme.text }]}>
          {item.brand?.name ?? "Partner Brand"}
        </Text>
        
        <Text style={{ color: theme.subText }}>{item.title}</Text>

        <Text style={{ fontWeight: "bold", color: theme.text }}>
          {item.requiredCoins} Coins
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: disabled
                ? "#999"
                : theme.primary
            }
          ]}
          disabled={disabled}
          onPress={() => handleRedeem(item)}
        >
          <Text style={styles.buttonText}>
            {disabled ? "Insufficient Balance" : "Redeem"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.primary }]}>
          Redeem Rewards
        </Text>

        <FlatList
          data={coupons}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },

  card: {
    padding: 20,
    borderRadius: 14,
    marginBottom: 15
  },

  brand: {
    fontSize: 16,
    fontWeight: "bold"
  },

  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  }
});
