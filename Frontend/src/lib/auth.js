import { useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../api";
const USER_KEY = "yp_auth_user";
const TOKEN_KEY = "yp_auth_token";
const REFRESH_TOKEN_KEY = "yp_auth_refresh_token";
function emitAuthChange() {
  window.dispatchEvent(new Event("yp-auth-change"));
}
function saveSession(session) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(session.user));
  sessionStorage.setItem(TOKEN_KEY, session.token);
  if (session.refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  }
  emitAuthChange();
}
function getToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}
async function login(email, password) {
  const session = await loginUser(email, password);
  saveSession(session);
  return session.user;
}
async function register(input) {
  const session = await registerUser(input);
  saveSession(session);
  return session.user;
}
async function refreshMe() {
  if (!getToken()) return null;
  try {
    const data = await getCurrentUser();
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    emitAuthChange();
    return data.user;
  } catch {
    logout();
    return null;
  }
}
function logout() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    emitAuthChange();
  }
}
function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function useAuth() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setUser(getUser());
    setReady(true);
    if (getToken()) {
      void refreshMe();
    }
    const handleAuthChange = () => setUser(getUser());
    window.addEventListener("yp-auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("yp-auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);
  return { user, ready };
}
export {
  getToken,
  getUser,
  login,
  logout,
  refreshMe,
  register,
  useAuth
};
