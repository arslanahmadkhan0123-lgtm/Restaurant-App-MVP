import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function OrderTrackingScreen({ route }) {
  const [status, setStatus] = useState("Pending");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Status Progression Timer (Demo Timings)
  useEffect(() => {
    const statusTimer = setTimeout(() => setStatus("Preparing"), 10000);
    const statusTimer2 = setTimeout(() => setStatus("Ready"), 20000);
    const statusTimer3 = setTimeout(() => setStatus("Served"), 30000);

    return () => {
      clearTimeout(statusTimer);
      clearTimeout(statusTimer2);
      clearTimeout(statusTimer3);
    };
  }, []);

  // Elapsed Time Counter
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status: {status}</Text>
      <Text style={styles.timer}>Elapsed Time: {elapsedSeconds}s</Text>

      <View style={styles.stepsContainer}>
        <Text style={[styles.step, status === "Pending" && styles.activeStep]}>1. Pending</Text>
        <Text style={[styles.step, status === "Preparing" && styles.activeStep]}>2. Preparing</Text>
        <Text style={[styles.step, status === "Ready" && styles.activeStep]}>3. Ready</Text>
        <Text style={[styles.step, status === "Served" && styles.activeStep]}>4. Served</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#FF6347" },
  timer: { fontSize: 16, color: "#666", marginBottom: 30 },
  stepsContainer: { width: "100%", paddingHorizontal: 40 },
  step: { fontSize: 18, paddingVertical: 10, color: "#999" },
  activeStep: { color: "#007BFF", fontWeight: "bold" },
});