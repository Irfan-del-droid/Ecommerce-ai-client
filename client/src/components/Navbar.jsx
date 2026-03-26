import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ cartCount = 0, onCartOpen, userName }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);

  const logout = () => {
    localStorage.removeItem("lokiLoggedIn");
    sessionStorage.removeItem("lokiLoggedIn");
    localStorage.removeItem("lokiToken");
    sessionStorage.removeItem("lokiToken");
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/collections" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`nav ${scrolled ? "nav-solid" : ""}`}>
      <div className="nav-wrap">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-mark">
            <span className="nlm-rune">ᛚ</span>
            <div className="nlm-orbit" />
          </div>
          <div className="nav-logo-words">
            <span className="nlw-main">LOKI</span>
            <span className="nlw-sub">STORES</span>
          </div>
        </Link>

        <div className={`nav-menu ${menuOpen ? "nav-menu-open" : ""}`}>
          {navLinks.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`nm-link ${isActive ? "nm-active" : ""}`}
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <span className="nm-line" />
              </Link>
            );
          })}
        </div>

        <div className="nav-right">
          {userName && (
            <div className="nav-user">
              <div className="nu-avatar">{userName[0].toUpperCase()}</div>
              <span className="nu-label">Hail, <b>{userName}</b></span>
            </div>
          )}
          <button className="nav-icon-btn" onClick={onCartOpen} title="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && <span className="nib-badge">{cartCount}</span>}
          </button>
          {userName
            ? <button className="nav-btn nav-btn-ghost" onClick={logout}>Logout</button>
            : <button className="nav-btn" onClick={() => navigate("/login")}>Sign In</button>
          }
          <button className={`hamburger ${menuOpen ? "ham-active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span/><span/><span/>
          </button>
        </div>
      </div>
    </nav>
  );
}
