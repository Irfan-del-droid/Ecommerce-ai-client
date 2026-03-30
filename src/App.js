import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";

import { CartProvider, CartDrawer } from "./context/StoreContext";
import { MagneticCursor, useClickBurst } from "./components/Interactivity";

// Protected Route: requires login (check token and user info)
const ProtectedRoute = ({ children }) => {
  const hasToken = localStorage.getItem("lokiToken") || sessionStorage.getItem("lokiToken");
  const hasUser = localStorage.getItem("lokiLoggedIn") || sessionStorage.getItem("lokiLoggedIn");
  return (hasToken || hasUser) ? children : <Navigate to="/login" replace />;
};

function App() {
  const { trigger, BurstLayer } = useClickBurst();

  return (
    <CartProvider>
      <div onClick={trigger} className="page-root">
        <MagneticCursor />
        <BurstLayer />
        <CartDrawer />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collections"
              element={
                <ProtectedRoute>
                  <Collections />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/signup" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;