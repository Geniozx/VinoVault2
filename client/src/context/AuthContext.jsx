import { useEffect, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/authService";
import { AuthContext } from "./authContext";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");
  // const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    async function restoreUser() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(accessToken);
        setUser(currentUser);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreUser();
  }, [accessToken]);

  async function login(credentials) {
    const tokens = await loginUser(credentials);

    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);

    const currentUser = await getCurrentUser(tokens.access);
    setUser(currentUser);

    return currentUser;
  }

  async function logout() {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");

    try {
      if (access && refresh) {
        await logoutUser(access, refresh);
      }
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

