import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "fullName") setFullName(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password || password.length < 8 || !/\d/.test(password)) {
      newErrors.password = "Password must be at least 8 chars and contain 1 digit.";
    }

    if (!isLoginMode) {
      if (!fullName.trim()) newErrors.fullName = "Full name is required.";
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (isLoginMode) {
        const result = await apiClient("/auth/login", "POST", { email, password });
        await login(result.user, result.token);
        if (result.user.role === "manager") {
          navigation.replace("ManagerDashboard");
        } else {
          navigation.replace("MainApp");
        }
      } else {
        await apiClient("/auth/register", "POST", {
          name: fullName.trim(),
          email,
          password,
          role,
        });
        Alert.alert("Success", "Account created successfully! Please login.");
        setIsLoginMode(true);
      }
    } catch (error) {
      Alert.alert(isLoginMode ? "Login Failed" : "Registration Failed", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLoginMode ? "Welcome Back" : "Create Account"}
      </Text>

      {!isLoginMode && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={(val) => handleInputChange("fullName", val)}
          />
          {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(val) => handleInputChange("email", val)}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(val) => handleInputChange("password", val)}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      {!isLoginMode && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(val) => handleInputChange("confirmPassword", val)}
          />
          {errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === "customer" && styles.roleActive]}
              onPress={() => setRole("customer")}
            >
              <Text>Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === "manager" && styles.roleActive]}
              onPress={() => setRole("manager")}
            >
              <Text>Manager</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.mainButton}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.mainButtonText}>
            {isLoginMode ? "Login" : "Sign Up"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsLoginMode(!isLoginMode)}
        style={styles.switchMode}
      >
        <Text style={styles.switchText}>
          {isLoginMode
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 10 },
  error: { color: "red", fontSize: 12, marginBottom: 10, marginLeft: 4 },
  mainButton: { backgroundColor: "#FF6347", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  mainButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  switchMode: { marginTop: 15, alignItems: "center" },
  switchText: { color: "#007BFF" },
  roleContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
  roleButton: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, width: "45%", alignItems: "center" },
  roleActive: { backgroundColor: "#e2e2e2", borderColor: "#333" },
});