import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";

import DashboardScreen from "../screens/user/DashboardScreen";
import ScanScreen from "../screens/user/ScanScreen";
import WalletScreen from "../screens/user/WalletScreen";
import RedeemScreen from "../screens/user/RedeemScreen";
import SettingsScreen from "../screens/user/SettingsScreen";


const Tab = createBottomTabNavigator();

export default function UserTabNavigator() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // 🔥 THEME-AWARE TAB BAR
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 0
        },

        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subText,

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Scan") iconName = "qr-code";
          else if (route.name === "Wallet") iconName = "wallet";
          else if (route.name === "Redeem") iconName = "gift";
          else if (route.name === "Settings") iconName = "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Redeem" component={RedeemScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
