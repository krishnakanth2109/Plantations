import React from "react";
import {
  BrowserRouter,
  Link as RRLink,
  Outlet as RROutlet,
  useLocation as RRUseLocation,
  useNavigate as RRUseNavigate,
} from "react-router-dom";

function Router({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

function Link({ to, activeProps, className = "", children, ...props }) {
  const location = RRUseLocation();
  const href = to === "/" ? "/" : (to ? to.replace(/\/+$/, "") : "");
  const isActive = location.pathname === href;
  const activeClass = isActive ? activeProps?.className || "" : "";

  return (
    <RRLink
      to={to}
      className={[className, activeClass].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </RRLink>
  );
}

function Outlet() {
  return <RROutlet />;
}

function useLocation() {
  return RRUseLocation();
}

function useNavigate() {
  const navigate = RRUseNavigate();
  return React.useMemo(() => (to, options) => {
    const path = typeof to === "string" ? to : to?.to;
    navigate(path, options);
  }, [navigate]);
}

function createFileRoute(path) {
  return (config) => ({ path, ...config });
}

export { Link, Outlet, Router, createFileRoute, useLocation, useNavigate };
