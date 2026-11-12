"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi, AuthUserResponse } from "./apis/auth.api";

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  role?: string;
  image?: string | null;
  status?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (redirectPath?: string) => void;
  refreshUser: () => Promise<void>;
}

const AUTH_SESSION_CACHE_KEY = "techstore.auth.session";
const LEGACY_USER_KEY = "fieldshift_current_user";

const AuthContext = createContext<AuthContextValue | null>(null);

function saveSession(accessToken?: string, refreshToken?: string, user?: AuthUser) {
  if (typeof window === "undefined") return;
  try {
    const sessionData = {
      accessToken: accessToken || "",
      refreshToken: refreshToken || "",
      user: user || null,
      cachedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(AUTH_SESSION_CACHE_KEY, JSON.stringify(sessionData));
    if (user) {
      window.localStorage.setItem(LEGACY_USER_KEY, JSON.stringify(user));
    }
  } catch {
    // ignore
  }
}

function clearSession() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_SESSION_CACHE_KEY);
    window.localStorage.removeItem(LEGACY_USER_KEY);
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res?.data) {
        const u = res.data;
        const normalized: AuthUser = {
          id: u.id,
          name: u.name || nameFromEmail(u.email),
          email: u.email,
          role: u.role,
          image: u.image,
          status: u.status,
        };
        setUser(normalized);
        saveSession(undefined, undefined, normalized);
      }
    } catch {
      // If unauthorized and no stored user, ensure user is null
    }
  }, []);

  useEffect(() => {
    // 1. Eagerly read cached user from localStorage to prevent UI flicker
    if (typeof window !== "undefined") {
      try {
        const cachedSession = window.localStorage.getItem(AUTH_SESSION_CACHE_KEY);
        if (cachedSession) {
          const parsed = JSON.parse(cachedSession);
          if (parsed?.user) {
            setUser(parsed.user);
          }
        } else {
          const legacy = window.localStorage.getItem(LEGACY_USER_KEY);
          if (legacy) {
            setUser(JSON.parse(legacy));
          }
        }
      } catch {
        // ignore
      }
    }

    // 2. Validate session with the backend
    fetchCurrentUser().finally(() => {
      setReady(true);
    });
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const data = response?.data;
    if (data) {
      const u = data.user;
      const normalizedUser: AuthUser = {
        id: u?.id,
        name: u?.name || nameFromEmail(email),
        email: u?.email || email,
        role: u?.role || "USER",
        image: u?.image,
        status: u?.status,
      };
      saveSession(data.accessToken, data.refreshToken, normalizedUser);
      setUser(normalizedUser);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authApi.register({ name, email, password });
    const data = response?.data;
    if (data) {
      const u = data.user;
      const normalizedUser: AuthUser = {
        id: u?.id,
        name: u?.name || name,
        email: u?.email || email,
        role: u?.role || "USER",
        image: u?.image,
        status: u?.status,
      };
      saveSession(data.accessToken, data.refreshToken, normalizedUser);
      setUser(normalizedUser);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      clearSession();
      setUser(null);
    }
  };

  const googleLogin = (redirectPath = "/dashboard") => {
    const url = authApi.getGoogleLoginUrl(redirectPath);
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        login,
        register,
        logout,
        googleLogin,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Fallback display name derived from an email, e.g. "farmer@field.com" -> "Farmer" */
export function nameFromEmail(email: string): string {
  const prefix = email.split("@")[0] || "Farmer";
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

export function initials(name?: string): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
