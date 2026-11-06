import React from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, theme } = useTheme();

  const handleLogout = () => {
    logout();
    navigation.replace("Login");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>User Profile</Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.text }]}>Name: {user?.name || "Guest"}</Text>
        <Text style={[styles.label, { color: theme.text }]}>Email: {user?.email || "N/A"}</Text>
        <Text style={[styles.label, { color: theme.text }]}>Role: {user?.role || "Customer"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={{ color: theme.text, fontSize: 16 }}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: { padding: 20, borderRadius: 10, borderWidth: 1, marginBottom: 20, elevation: 2 },
  label: { fontSize: 16, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30, paddingHorizontal: 10 },
  logoutButton: { backgroundColor: "#ff3b30", padding: 15, borderRadius: 8, alignItems: "center" },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});