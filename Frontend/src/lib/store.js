import { useEffect, useState, useCallback, useRef } from "react";
const PREFIX = "yp_store_";
const memoryCache = new Map();

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    if (memoryCache.has(key)) {
      return memoryCache.get(key);
    }
    const raw = sessionStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[store] Storage quota exceeded or disabled for key "${key}". Falling back to in-memory store.`, err);
  }
  memoryCache.set(key, value);
  window.dispatchEvent(new CustomEvent("yp-store-change", { detail: key }));
}
function useStore(key, initial) {
  const initialRef = useRef(initial);
  const [value, setValue] = useState(initial);
  useEffect(() => {
    setValue(read(key, initialRef.current));
    const h = (e) => {
      const ev = e;
      if (!ev.detail || ev.detail === key) setValue(read(key, initialRef.current));
    };
    window.addEventListener("yp-store-change", h);
    return () => window.removeEventListener("yp-store-change", h);
  }, [key]);
  const update = useCallback((updater) => {
    setValue((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      write(key, next);
      return next;
    });
  }, [key]);
  return [value, update];
}
const uid = () => Math.random().toString(36).slice(2, 10);
export {
  uid,
  useStore
};
