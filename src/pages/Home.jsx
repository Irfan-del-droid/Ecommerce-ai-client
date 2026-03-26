import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart, API_BASE_URL } from "../context/StoreContext";
import {
  GravityField, Typewriter,
  CountUp, Reveal, GlitchTitle, Toast, Marquee
} from "../components/Interactivity";
import "../index.css";
import "./Home.css";

/* ── ORBIT SATELLITES — now truly rotating ── */
const SATELLITES = [
  { emoji: "🧥", label: "Jackets",  angle: 0   },
  { emoji: "👟", label: "Sneakers", angle: 120 },
  { emoji: "⌚", label: "Watches",  angle: 240 },
];

const MARQUEE_ITEMS = [
  { text: "FREE SHIPPING ABOVE ₹999" }, { text: "ᛚ", rune: true },
  { text: "PREMIUM NORSE QUALITY" },    { text: "ᛟ", rune: true },
  { text: "EASY 30-DAY RETURNS" },      { text: "ᚲ", rune: true },
  { text: "EXCLUSIVE MEMBER DEALS" },   { text: "ᚷ", rune: true },
  { text: "NEW DROPS EVERY WEEK" },     { text: "ᚨ", rune: true },
];

export default function Home() {
  const location = useLocation();
  const [heroIn, setHeroIn]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [showTop, setShowTop]     = useState(false);
  const [nlEmail, setNlEmail]     = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const { cartCount, setDrawerOpen, addToCart } = useCart();

  const userName =
    location.state?.userName ||
    JSON.parse(localStorage.getItem("lokiLoggedIn") || "null")?.name ||
    JSON.parse(sessionStorage.getItem("lokiLoggedIn") || "null")?.name || null;

  useEffect(() => {
    setTimeout(() => setHeroIn(true), 80);
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // eslint-disable-next-line
  const handleAddToCart = (p) => {
    addToCart(p);
    setToast({ msg: `${p.name} added to cart!`, type: "success" });
  };

  const handleNewsletterSubmit = async () => {
    if (!nlEmail || !nlEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setToast({ msg: "Please enter a valid email address.", type: "error" });
      return;
    }
    setNlLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail })
      });
      const data = await res.json();
      setNlLoading(false);
      if (!res.ok) {
        setToast({ msg: data.error || "Subscription failed. Please try again.", type: "error" });
        return;
      }
      setNlEmail("");
      setToast({ msg: data.message || "Welcome to the Brotherhood!", type: "success" });
    } catch (err) {
      setNlLoading(false);
      setToast({ msg: "Network error. Please try again.", type: "error" });
    }
  };

  return (
    <div className="page-root">
      {/* 
        Note: MagneticCursor and CartDrawer have been removed from here 
        because they are already globally mounted in App.js! 
      */}
      <GravityField count={34} repelRadius={155} repelForce={0.52} />

      <div className="land-bg">
        <div className="bg-base" /><div className="bg-grid" />
        <div className="bg-r1" /><div className="bg-r2" /><div className="bg-r3" />
        <div className="bg-noise" /><div className="bg-vignette" />
      </div>

      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setDrawerOpen(true)}
        userName={userName}
      />

      {/* ─── HERO ─── */}
      <section id="home" className={`hero ${heroIn ? "hero-in" : ""}`}>
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="he-rune">ᚷ</span>
            <span className="he-bar" />
            <span className="he-text">New Collection 2024</span>
            <span className="he-bar" />
            <span className="he-rune">ᚷ</span>
          </div>

          <h1 className="hero-h1">
            <span className="hh-line1">Dress Like</span>
            <span className="hh-line2">
              <Typewriter words={["A God.", "A King.", "A Legend.", "A Warrior."]} />
            </span>
          </h1>

          <p className="hero-p">
            Premium men's fashion forged from Norse mythology.<br />
            <em>Where strength becomes style.</em>
          </p>

          <div className="hero-btns">
            <button className="hbtn-primary"
              onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })}>
              <span>Explore Collection</span>
              <span className="hbtn-arrow">→</span>
              <div className="hbtn-shimmer" />
            </button>
            <button className="hbtn-ghost">
              <span className="hbtn-play">▶</span>Watch Lookbook
            </button>
          </div>

          <div className="hero-stats">
            {[
              { n: 12000, s: "+", l: "Happy Kings" },
              { n: 500,   s: "+", l: "Products" },
              { raw: "4.9★",     l: "Avg Rating" },
            ].map((stat, i) => (
              <div key={i} className="hs-item">
                <div className="hs-num">
                  {stat.raw ? stat.raw : <CountUp end={stat.n} suffix={stat.s} />}
                </div>
                <div className="hs-label">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── ROTATING ORBIT — Task 3 ─── */}
        <div className="hero-right">
          <div className="hero-orb-wrap">
            {/* Static decorative rings */}
            <div className="orb-ring r1" />
            <div className="orb-ring r2" />
            <div className="orb-ring r3" />

            {/* Center logo core */}
            <div className="orb-core">
              <span className="orb-glyph">ᛚ</span>
            </div>

            {/* Orbit track — this div rotates, carrying all satellites */}
            <div className="orbit-track">
              {SATELLITES.map((sat, i) => (
                <div
                  key={i}
                  className="orb-satellite"
                  style={{ "--sa": `${sat.angle}deg` }}
                >
                  {/* Counter-rotate content so it stays upright */}
                  <div className="os-content">
                    <span className="os-emoji">{sat.emoji}</span>
                    <span className="os-label">{sat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-mouse"><div className="scroll-ball" /></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <Marquee items={MARQUEE_ITEMS} />

      {/* ─── FEATURE STRIP ─── */}
      <section className="feature-strip">
        <div className="fs-inner">
          {[
            { icon:"🛡", h:"Premium Quality",  d:"Every piece made to last generations" },
            { icon:"⚡", h:"Fast Delivery",     d:"Ships across India in 2–4 days" },
            { icon:"↩", h:"Easy Returns",       d:"30-day no-questions policy" },
            { icon:"🔒", h:"Secure Payments",  d:"100% encrypted checkout" },
          ].map((f, i) => (
            <Reveal key={i} delay={i * 90} from="bottom">
              <div className="fs-card">
                <span className="fs-icon">{f.icon}</span>
                <div className="fs-text">
                  <div className="fs-h">{f.h}</div>
                  <div className="fs-d">{f.d}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS (mini) ─── */}
      <section id="collections" className="home-featured">
        <div className="home-featured-inner">
          <Reveal from="bottom">
            <div className="sec-head">
              <div className="sec-eyebrow"><span className="sec-rune">ᛏ</span> Collections</div>
              <h2 className="sec-title"><GlitchTitle text="Forge Your Style" /></h2>
              <p className="sec-sub">Each piece crafted for the modern warrior</p>
            </div>
          </Reveal>

          <div className="home-feat-grid">
            {[
              { emoji:"🧥", label:"Clothing",    tag:"50+ Styles",  color:"#1a4a2a" },
              { emoji:"👟", label:"Footwear",    tag:"30+ Pairs",   color:"#0a3a1a" },
              { emoji:"⌚", label:"Accessories", tag:"20+ Pieces",  color:"#2a1a08" },
              { emoji:"🌿", label:"Grooming",    tag:"15+ Products",color:"#0a2a18" },
            ].map((cat, i) => (
              <Reveal key={i} delay={i * 80} from="bottom">
                <div className="hfcat-card" style={{ "--cat-glow": cat.color }}>
                  <div className="hfcat-bg" />
                  <span className="hfcat-emoji">{cat.emoji}</span>
                  <div className="hfcat-label">{cat.label}</div>
                  <div className="hfcat-tag">{cat.tag}</div>
                  <div className="hfcat-hover-line" />
                </div>
              </Reveal>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:"40px" }}>
            <a href="/collections" className="view-all-btn">
              View All Collections →
              <div className="vab-shimmer" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── PROMO ─── */}
      <section className="promo-section">
        <Reveal from="bottom">
          <div className="promo-card">
            <div className="promo-bg-glyph">ᚷ</div>
            <div className="promo-body-text">
              <span className="promo-tag">⚡ LIMITED OFFER</span>
              <h2 className="promo-h">Get 30% Off Your First Order</h2>
              <p className="promo-p">Use code <span className="promo-code">LOKI30</span> — valid for first-time customers.</p>
            </div>
            <button className="promo-btn">
              Claim Offer →
              <div className="promo-shimmer" />
            </button>
          </div>
        </Reveal>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="testimonials">
        <Reveal from="bottom">
          <div className="sec-head">
            <div className="sec-eyebrow"><span className="sec-rune">ᛊ</span> Reviews</div>
            <h2 className="sec-title">Kings Have Spoken</h2>
          </div>
        </Reveal>
        <div className="test-grid">
          {[
            { name:"Arjun S.",  city:"Mumbai",    a:"A", text:"The Norse King Jacket is an absolute head-turner. Premium quality and delivery was blazing fast.", stars:5 },
            { name:"Rahul M.",  city:"Delhi",     a:"R", text:"Best men's brand I've discovered. The Loki Noir perfume has everyone asking what I'm wearing!", stars:5 },
            { name:"Vikram P.", city:"Bangalore", a:"V", text:"Premium feel at a fair price. The unboxing experience feels like opening a gift from Valhalla.", stars:5 },
          ].map((t, i) => (
            <Reveal key={i} delay={i * 110} from="bottom">
              <div className="test-card">
                <div className="tc-stars">{"★".repeat(t.stars)}</div>
                <p className="tc-text">"{t.text}"</p>
                <div className="tc-author">
                  <div className="tc-avatar">{t.a}</div>
                  <div>
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-city">{t.city}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="newsletter">
        <Reveal from="bottom">
          <div className="nl-wrap">
            <div className="nl-runes">
              {["ᛟ","ᚱ","ᛞ"].map((r,i) => <span key={i} className="nl-r" style={{ animationDelay:`${i*0.45}s` }}>{r}</span>)}
            </div>
            <h2 className="nl-h">Join the Brotherhood</h2>
            <p className="nl-p">Exclusive deals, early access & drops — direct to your realm.</p>
            <div className="nl-form">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="nl-input" 
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                disabled={nlLoading}
              />
              <button className="nl-btn" onClick={handleNewsletterSubmit} disabled={nlLoading}>
                {nlLoading ? "Joining..." : "Enter the Realm"}
                <div className="nl-shimmer" />
              </button>
            </div>
            <p className="nl-fine">No spam. Unsubscribe anytime. By the gods, we promise.</p>
          </div>
        </Reveal>
      </section>

      <Footer />

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <button
        className={`back-top ${showTop ? "bt-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Back to top"
      >↑</button>
    </div>
  );
}
