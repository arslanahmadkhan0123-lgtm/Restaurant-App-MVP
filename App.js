import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import LoginScreen from "./src/screen/LoginScreens";
import MenuScreen from "./src/screen/MenuScreen";
import CartScreen from "./src/screen/CartScreen";
import ReservationScreen from "./src/screen/ReservationScreen";
import ProfileScreen from "./src/screen/ProfileScreen";
import OrderSummaryScreen from "./src/screen/OrderSummaryScreen";
import OrderTrackingScreen from "./src/screen/OrderTrackingScreen";

function AppContent() {
  const [route, setRoute] = useState("Login");
  const [tab, setTab] = useState("Menu");

  const navigation = {
    replace: (name) => setRoute(name),
    navigate: (name) => setRoute(name),
  };

  if (route === "Login") {
    return <LoginScreen navigation={navigation} />;
  }

  if (route === "ManagerDashboard") {
    return (
      <SafeAreaView style={styles.manager}>
        <Text style={styles.managerTitle}>Manager Dashboard</Text>
        <Text style={styles.managerText}>Restaurant operations dashboard</Text>
        <TouchableOpacity style={styles.managerButton} onPress={() => setRoute("Login")}>
          <Text style={styles.managerButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const screens = {
    Menu: MenuScreen,
    Cart: CartScreen,
    Reservation: ReservationScreen,
    Summary: OrderSummaryScreen,
    Tracking: OrderTrackingScreen,
    Profile: ProfileScreen,
  };
  const ActiveScreen = screens[tab];

  return (
    <View style={styles.app}>
      <SafeAreaView style={styles.screen}>
        <ActiveScreen navigation={navigation} />
      </SafeAreaView>
      <View style={styles.tabs}>
        {Object.keys(screens).map((name) => (
          <TouchableOpacity
            key={name}
            style={[styles.tab, tab === name && styles.activeTab]}
            onPress={() => setTab(name)}
          >
            <Text style={[styles.tabText, tab === name && styles.activeTabText]}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1 },
  screen: { flex: 1 },
  tabs: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#ddd", backgroundColor: "#fff" },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12 },
  activeTab: { backgroundColor: "#fff1ee" },
  tabText: { fontSize: 12, color: "#666" },
  activeTabText: { color: "#FF6347", fontWeight: "bold" },
  manager: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  managerTitle: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  managerText: { color: "#666", marginBottom: 20 },
  managerButton: { backgroundColor: "#FF6347", padding: 14, borderRadius: 8 },
  managerButtonText: { color: "#fff", fontWeight: "bold" },
});
