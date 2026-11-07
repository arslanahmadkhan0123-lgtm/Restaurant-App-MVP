import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const defaultHost =
  Platform.OS === "web"
    ? "http://localhost:5000/api"
    : Platform.OS === "android"
      ? "http://10.0.2.2:5000/api"
      : "http://localhost:5000/api";

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || defaultHost;

export const apiClient = async (endpoint, method = "GET", body = null) => {
  const token = await AsyncStorage.getItem("userToken");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
};
