import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useState } from "react"; // ✅ useState FIXED
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import { ThemeProvider, ThemeContext } from "./src/context/ThemeContext";

import { LightNavTheme, DarkNavTheme } from "./src/styles/navigationTheme";
import { UserDataProvider } from "./src/context/UserDataContext";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import UserTabNavigator from "./src/navigation/UserTabNavigator";
import HistoryScreen from "./src/screens/user/HistoryScreen";
import EditProfileScreen from "./src/screens/user/EditProfileScreen";
import ChangePasswordScreen from "./src/screens/user/ChangePasswordScreen";
import AboutScreen from "./src/screens/user/AboutScreen";
import SplashScreen from "./src/screens/SplashScreen";

const Stack = createNativeStackNavigator();

function MainNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={UserTabNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{
              title: "Transaction History",
              headerTitleAlign: "center"
            }}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: "Edit Profile" }}
          />

          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{ title: "Change Password" }}
          />

          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ title: "About WasteCoin" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppContainer() {
  const { isDark } = useContext(ThemeContext);

  return (
    <NavigationContainer theme={isDark ? DarkNavTheme : LightNavTheme}>
      <MainNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true); // ✅ now valid

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <UserDataProvider>
          <AppContainer />
          </UserDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
