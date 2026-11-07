import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("userData")
      .then((storedUser) => {
        if (storedUser) setUser(JSON.parse(storedUser));
      })
      .catch(() => setUser(null));
  }, []);

  const login = async (userData, token) => {
    setUser(userData);
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    if (token) await AsyncStorage.setItem("userToken", token);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.multiRemove(["userData", "userToken"]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};