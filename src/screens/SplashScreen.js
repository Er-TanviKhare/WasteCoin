import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SplashScreen({ onFinish }) {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      })
    ]).start(() => {
      setTimeout(onFinish, 600); // slight pause after animation
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          alignItems: "center"
        }}
      >
        <Ionicons name="leaf" size={72} color="#2e7d32" />
        <Text style={styles.title}>WasteCoin</Text>
        <Text style={styles.subtitle}>
          Recycle • Earn • Sustain 🌱
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2e7d32",
    marginTop: 10
  },
  subtitle: {
    marginTop: 6,
    color: "#555"
  }
});
