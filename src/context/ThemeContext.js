import { createContext, useState } from "react";
import { lightTheme } from "../styles/lightTheme";
import { darkTheme } from "../styles/darkTheme";
import { TextInput } from "react-native";

TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  placeholderTextColor: "#9e9e9e"
};

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
