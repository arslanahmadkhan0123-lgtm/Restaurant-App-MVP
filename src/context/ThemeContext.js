import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext(null);

export const themes = {
  light: { background: "#f8f9fa", card: "#ffffff", text: "#333333", primary: "#FF6347", border: "#cccccc" },
  dark: { background: "#121212", card: "#1e1e1e", text: "#ffffff", primary: "#FF6347", border: "#444444" },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};