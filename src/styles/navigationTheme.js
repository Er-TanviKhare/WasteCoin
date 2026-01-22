import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const LightNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
    card: "#ffffff",
    text: "#000000",
    primary: "#2e7d32",
    border: "#e0e0e0"
  }
};

export const DarkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#121212",
    card: "#1e1e1e",
    text: "#ffffff",
    primary: "#81c784",
    border: "#333"
  }
};
