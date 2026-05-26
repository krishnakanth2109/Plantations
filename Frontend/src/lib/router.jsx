import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const OutletContext = createContext(null);
const LocationContext = createContext({ pathname: "/" });

function normalizePath(path) {
  if (!path) return "/";
  const clean = path.split("#")[0].split("?")[0] || "/";
  return clean.length > 1 ? clean.replace(/\/+$/, "") : clean;
}

function navigateTo(to) {
  const path = normalizePath(typeof to === "string" ? to : to?.to);
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
}

function Link({ to, activeProps, className = "", onClick, children, ...props }) {
  const location = useLocation();
  const href = normalizePath(to);
  const isActive = location.pathname === href;
  const activeClass = isActive ? activeProps?.className || "" : "";

  return (
    <a
      href={href}
      className={[className, activeClass].filter(Boolean).join(" ")}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey
        ) {
          return;
        }
        event.preventDefault();
        navigateTo(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function Outlet() {
  return useContext(OutletContext);
}

function useLocation() {
  return useContext(LocationContext);
}

function useNavigate() {
  return useMemo(() => (options) => navigateTo(options), []);
}

function createFileRoute(path) {
  return (config) => ({ path, ...config });
}

function Router({ children }) {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handleLocationChange = () => setPathname(normalizePath(window.location.pathname));
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  return (
    <LocationContext.Provider value={{ pathname }}>
      {children}
    </LocationContext.Provider>
  );
}

function WithOutlet({ outlet, children }) {
  return <OutletContext.Provider value={outlet}>{children}</OutletContext.Provider>;
}

export { Link, Outlet, Router, WithOutlet, createFileRoute, useLocation, useNavigate };
