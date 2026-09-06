import { useEffect, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../services/authService";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreUser() {
      const access = localStorage.getItem("accessToken");
      const refresh = localStorage.getItem("refreshToken");

      if (!access && !refresh) {
        setLoading(false);
        return;
      }

      try {
        if (access) {
          try {
            const currentUser = await getCurrentUser(access);
            setUser(currentUser);
            return;
          } catch {
            // Access token may be expired.
            // Continue below and try the refresh token.
          }
        }

        if (!refresh) {
          throw new Error("No refresh token available.");
        }

        const tokens = await refreshAccessToken(refresh);

        localStorage.setItem("accessToken", tokens.access);

        if (tokens.refresh) {
          localStorage.setItem("refreshToken", tokens.refresh);
        }

        const currentUser = await getCurrentUser(tokens.access);
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
  }, []);

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