import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { auth } from "../api";
import "./Login.css";

// React Bits: Particle field background
const ParticleField = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    dur: Math.random() * 8 + 5,
    delay: Math.random() * 5,
  }));
  return (
    <div className="particle-field">
      <div className="field-bg" />
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <div className="field-grid" />
    </div>
  );
};

// React Bits: Scramble text
const ScrambleText = ({ text }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";

  useEffect(() => {
    let frame = 0;
    const totalFrames = 18;
    const interval = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(interval);
        return;
      }
      setDisplay(
        text
          .split("")
          .map((char, i) =>
            i < (frame / totalFrames) * text.length
              ? char
              : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("")
      );
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="scramble-text">{display}</span>;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (location.state?.fromSignup) {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 4000);
    }

    // Google OAuth Callback Handler
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      
      if (accessToken) {
        setLoading(true);
        auth.googleAuth(accessToken)
          .then(data => {
            setLoading(false);
            if (data.token && data.user) {
              // Store token and user info
              localStorage.setItem("lokiToken", data.token);
              localStorage.setItem("lokiLoggedIn", JSON.stringify({ email: data.user.email, name: data.user.firstName }));
              // Clear hash
              window.history.replaceState({}, document.title, window.location.pathname);
              navigate("/", { state: { userName: data.user.firstName } });
            } else {
              setErrors({ form: data.error || "Google authentication failed. Please try again." });
            }
          })
          .catch(err => {
            console.error("Google Auth Error:", err);
            setLoading(false);
            setErrors({ form: "Google authentication failed. Please try again." });
          });
      }
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Enter a valid email address";
    if (!formData.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const data = await auth.login({ email: formData.email, password: formData.password });
      
      setLoading(false);

      // Store token based on rememberMe preference
      if (rememberMe) {
        localStorage.setItem("lokiToken", data.token);
        localStorage.setItem("lokiLoggedIn", JSON.stringify({ email: data.user.email, name: data.user.firstName }));
      } else {
        sessionStorage.setItem("lokiToken", data.token);
        sessionStorage.setItem("lokiLoggedIn", JSON.stringify({ email: data.user.email, name: data.user.firstName }));
      }
      navigate("/", { state: { userName: data.user.firstName } });
    } catch (err) {
      setLoading(false);
      setErrors({ form: "Network error. Please check your connection and try again." });
    }
  };

  const handleGoogleAuth = () => {
    const clientId = "750710614115-8pkg5uue2cpg3copj3jnmhpr70v8eqc1.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent(window.location.origin + "/login");
    const scope = encodeURIComponent("openid email profile");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    window.location.href = url;
  };

  return (
    <div className="login-root">
      <ParticleField />

      {showWelcome && (
        <div className="welcome-toast">
          <span className="toast-rune">ᚦ</span>
          Account created! Sign in to enter the realm.
        </div>
      )}

      <div className="login-container">
        {/* Left decorative column */}
        <div className="login-deco">
          <div className="deco-circle deco-circle-1" />
          <div className="deco-circle deco-circle-2" />
          <div className="deco-vertical-text">LOKI STORES — SINCE 2024</div>
          <div className="deco-rune-stack">
            {["ᛚ", "ᛟ", "ᚲ", "ᛁ"].map((r, i) => (
              <span
                key={i}
                className="deco-rune"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Login card */}
        <div className="login-card">
          <div className="login-logo">
            <div className="logo-ring">
              <span className="logo-rune">ᛚ</span>
            </div>
          </div>

          <h1 className="login-title">
            <ScrambleText text="Welcome Back" />
          </h1>
          <p className="login-subtitle">Enter your realm</p>

          {errors.form && (
            <div className="form-error-banner">
              <span>⚠</span> {errors.form}
            </div>
          )}

          <button className="google-btn-login" onClick={handleGoogleAuth}>
            <svg className="google-icon" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.7 2.5 30.2 0 24 0 14.8 0 6.9 5.4 3 13.3l7.9 6.1C12.8 13.3 17.9 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.5-9.4 6.5-16.3z"/>
              <path fill="#FBBC05" d="M10.9 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L2.4 13.3A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8.4-6z"/>
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7-5.4c-2 1.4-4.6 2.2-8.2 2.2-6.1 0-11.2-3.8-13.1-9.2l-8 6.1C6.9 42.6 14.8 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">or</span>
            <span className="divider-line" />
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                autoComplete="email"
              />
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                autoComplete="current-password"
              />
              {errors.password && <span className="err-msg">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="checkmark" />
                Remember me
              </label>
              <a href="#!" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="loading-dots">
                  <span /><span /><span />
                </span>
              ) : (
                "Enter the Realm →"
              )}
            </button>
          </form>

          <p className="signup-prompt">
            New to Loki Stores?{" "}
            <Link to="/signup" className="gold-link">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
