import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../context/StoreContext";
import "./Signup.css";

// React Bits: Aurora animated background
const AuroraBackground = () => (
  <div className="aurora-wrapper">
    <div className="aurora aurora-1" />
    <div className="aurora aurora-2" />
    <div className="aurora aurora-3" />
    <div className="aurora-noise" />
  </div>
);

// React Bits: Animated split text
const SplitText = ({ text, className }) => {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="split-char"
          style={{ animationDelay: `${i * 0.04}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "password") evaluateStrength(value);
  };

  const evaluateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setPasswordStrength(score);
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthClass = ["", "weak", "fair", "good", "strong"];

  const validateStep1 = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Enter a valid email";
    if (!formData.phone.match(/^[0-9]{10}$/))
      e.phone = "Enter a valid 10-digit phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (formData.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        })
      });
      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setErrors({ form: data.error || "Signup failed. Please try again." });
        return;
      }

      // Store token and user info
      localStorage.setItem("lokiToken", data.token);
      localStorage.setItem("lokiLoggedIn", JSON.stringify({ email: data.user.email, name: data.user.firstName }));
      navigate("/", { state: { userName: data.user.firstName } });
    } catch (err) {
      setLoading(false);
      setErrors({ form: "Network error. Please check your connection and try again." });
    }
  };

  const handleGoogleAuth = () => {
    // Placeholder: Replace YOUR_GOOGLE_CLIENT_ID with actual client ID
    const clientId = "750710614115-8pkg5uue2cpg3copj3jnmhpr70v8eqc1.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent("http://localhost:3000/login");
    const scope = encodeURIComponent("openid email profile");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    window.location.href = url;
  };

  return (
    <div className="signup-root">
      <AuroraBackground />

      <div className="signup-left">
        <div className="signup-brand">
          <div className="brand-rune">ᛚ</div>
          <SplitText text="LOKI STORES" className="brand-name-split" />
          <p className="brand-tagline">Dress Like a God</p>
        </div>
        <div className="signup-left-features">
          {["Exclusive Men's Collections", "Premium Quality Guaranteed", "Free Shipping Over ₹999"].map(
            (f, i) => (
              <div key={i} className="feature-item" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
                <span className="feature-dot" />
                {f}
              </div>
            )
          )}
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-card">
          {/* Step indicator */}
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? "active" : ""}`}>
              <span>1</span>
            </div>
            <div className={`step-line ${step >= 2 ? "filled" : ""}`} />
            <div className={`step-dot ${step >= 2 ? "active" : ""}`}>
              <span>2</span>
            </div>
          </div>

          <h2 className="signup-title">
            {step === 1 ? "Create Account" : "Set Password"}
          </h2>
          <p className="signup-sub">
            {step === 1
              ? "Join the Loki Brotherhood"
              : "Secure your divine account"}
          </p>

          {errors.form && (
            <div className="form-error-banner" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#f87171', fontSize: '14px' }}>
              <span>⚠</span> {errors.form}
            </div>
          )}

          {step === 1 && (
            <>
              <button className="google-btn" onClick={handleGoogleAuth}>
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
                <span className="divider-text">or sign up manually</span>
                <span className="divider-line" />
              </div>
            </>
          )}

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
            {step === 1 ? (
              <div className="form-step fade-in">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Thor"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? "error" : ""}
                    />
                    {errors.firstName && <span className="err-msg">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Odinson"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? "error" : ""}
                    />
                    {errors.lastName && <span className="err-msg">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="thor@asgard.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && <span className="err-msg">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="phone-input-wrap">
                    <span className="phone-code">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "error" : ""}
                      maxLength={10}
                    />
                  </div>
                  {errors.phone && <span className="err-msg">{errors.phone}</span>}
                </div>

                <button type="submit" className="submit-btn">
                  Continue <span className="btn-arrow">→</span>
                </button>
              </div>
            ) : (
              <div className="form-step fade-in">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "error" : ""}
                  />
                  {formData.password && (
                    <div className="strength-bar">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`strength-segment ${i <= passwordStrength ? strengthClass[passwordStrength] : ""}`}
                        />
                      ))}
                      <span className="strength-label">{strengthLabel[passwordStrength]}</span>
                    </div>
                  )}
                  {errors.password && <span className="err-msg">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <span className="match-ok">✓ Passwords match</span>
                  )}
                  {errors.confirmPassword && <span className="err-msg">{errors.confirmPassword}</span>}
                </div>

                <div className="form-actions">
                  <button type="button" className="back-btn" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? (
                      <span className="loading-dots">
                        <span /><span /><span />
                      </span>
                    ) : (
                      <>Create Account <span className="btn-arrow">→</span></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="login-link">
            Already have an account?{" "}
            <Link to="/login" className="gold-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
