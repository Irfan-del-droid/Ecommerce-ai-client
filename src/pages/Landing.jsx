import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Landing.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart, CATEGORIES } from "../context/StoreContext";
import {
  GravityField,
  Typewriter,
  CountUp,
  Reveal,
  GlitchTitle,
  ShinyCard,
  Marquee,
  SpotlightSection,
  StaggerIn,
} from "../components/Interactivity";
import { newsletter as apiNewsletter } from "../api";

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCat, setActiveCat] = useState("All");
  const [heroIn, setHeroIn] = useState(false);
  const [nlEmail, setNlEmail] = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { addToCart, wishlist, toggleWish, addedId, setDrawerOpen, products, productsLoading } = useCart();

  const userName =
    location.state?.userName ||
    JSON.parse(localStorage.getItem("lokiLoggedIn") || "null")?.name ||
    JSON.parse(sessionStorage.getItem("lokiLoggedIn") || "null")?.name ||
    null;

  useEffect(() => {
    setTimeout(() => setHeroIn(true), 80);
  }, []);

  const handleNewsletterSubmit = async () => {
    if (!nlEmail || !nlEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setToast({ msg: "Please enter a valid email address.", type: "error" });
      return;
    }
    setNlLoading(true);
    try {
      const data = await apiNewsletter.subscribe(nlEmail);
      setNlLoading(false);
      setNlEmail("");
      setToast({ msg: data.message || "Welcome to the Brotherhood!", type: "success" });
    } catch (err) {
      setNlLoading(false);
      setToast({ msg: err.message || "Network error. Please try again.", type: "error" });
    }
  };

  const filtered = activeCat === "All" ? products : products.filter(p => p.category === activeCat);

  const marqueeItems = [
    { text: "FREE SHIPPING ABOVE ₹999", rune: false },
    { text: "ᛚ", rune: true },
    { text: "PREMIUM NORSE QUALITY", rune: false },
    { text: "ᛟ", rune: true },
    { text: "EASY 30-DAY RETURNS", rune: false },
    { text: "ᚲ", rune: true },
    { text: "EXCLUSIVE MEMBER DEALS", rune: false },
    { text: "ᚷ", rune: true },
    { text: "NEW DROPS EVERY WEEK", rune: false },
    { text: "ᚨ", rune: true },
  ];

  return (
    <div className="land-root">
      {/* Anti-Gravity Rune Field */}
      <GravityField count={34} repelRadius={155} repelForce={0.52} />

      {/* Deep BG layers */}
      <div className="land-bg">
        <div className="bg-base" />
        <div className="bg-grid" />
        <div className="bg-r1" /><div className="bg-r2" /><div className="bg-r3" />
        <div className="bg-noise" />
        <div className="bg-vignette" />
      </div>

      <Navbar cartCount={useCart().cartCount} onCartOpen={() => setDrawerOpen(true)} userName={userName} />

      {/* ─── HERO ─── */}
      <section id="home" className={`page-hero ${heroIn ? "hero-in" : ""}`}>
        <div className="hero-left">
          <div className="ph-eyebrow">
            <span className="he-rune">ᚷ</span>
            <span className="he-bar" />
            <span className="he-text">New Collection 2024</span>
            <span className="he-bar" />
            <span className="he-rune">ᚷ</span>
          </div>

          <h1 className="ph-title">
            <span className="hh-line1">Dress Like</span>
            <span className="hh-line2" style={{ display: "block" }}>
              <Typewriter words={["A God.", "A King.", "A Legend.", "A Warrior."]} />
            </span>
          </h1>

          <p className="ph-sub">
            Premium men's fashion forged from Norse mythology.<br />
            <em>Where strength becomes style.</em>
          </p>

          <div className="hero-btns" style={{ display: "flex", gap: "16px", marginTop: "32px", marginBottom: "48px" }}>
            <button className="hbtn-primary"
              onClick={() => document.getElementById("collections")?.scrollIntoView({ behavior:"smooth" })}
              style={{ padding: "14px 28px", borderRadius: "8px", background: "var(--gold)", color: "var(--bg)", border: "none", fontWeight: "bold" }}>
              Explore Collection →
            </button>
          </div>

          <div className="hero-stats" style={{ display: "flex", gap: "32px" }}>
            {[
              { n: 12000, s: "+", l: "Happy Kings" },
              { n: 500,   s: "+", l: "Products" },
              { raw: "4.9★", l: "Avg Rating" },
            ].map((stat, i) => (
              <div key={i} className="hs-item">
                <div className="hs-num" style={{ fontSize: "24px", color: "var(--gold)", fontWeight: "bold" }}>
                  {stat.raw ? stat.raw : <CountUp end={stat.n} suffix={stat.s} />}
                </div>
                <div className="hs-label" style={{ fontSize: "12px", color: "var(--txt-dim)" }}>{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={marqueeItems} />

      {/* ─── FEATURE STRIP ─── */}
      <SpotlightSection className="feature-strip">
        <div className="fs-inner">
          {[
            { icon:"🛡", h:"Premium Quality",    d:"Every piece made to last generations" },
            { icon:"⚡", h:"Fast Delivery",       d:"Ships across India in 2–4 days" },
            { icon:"↩", h:"Easy Returns",         d:"30-day no-questions policy" },
            { icon:"🔒", h:"Secure Payments",    d:"100% encrypted checkout" },
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
      </SpotlightSection>

      {/* ─── COLLECTIONS ─── */}
      <section id="collections" className="collections" style={{ padding: "80px 44px", maxWidth: "1240px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Reveal from="bottom">
          <div className="sec-head">
            <div className="sec-eyebrow"><span className="sec-rune">ᛏ</span> Collections</div>
            <h2 className="sec-title"><GlitchTitle text="Forge Your Style" /></h2>
            <p className="sec-sub">Each piece crafted for the modern warrior</p>
          </div>
        </Reveal>

        <div className="cat-bar">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`cat-btn ${activeCat === cat ? "cat-on" : ""}`}
              onClick={() => setActiveCat(cat)}>
              {cat}
              {activeCat === cat && <span className="cat-pill-glow" />}
            </button>
          ))}
        </div>

        <div className="prod-grid">
          {filtered.map((p, i) => (
            <ShinyCard key={p.id} style={{ animationDelay:`${i * 0.06}s` }}>
              <div className="pc-visual" style={{ background:`radial-gradient(circle at 38% 38%, ${p.glow}, #040504 72%)` }}>
                <div className="pc-glow-ring" />
                <span className="pc-emoji">{p.emoji}</span>
                <span className={`pc-badge pcb-${p.badge.toLowerCase()}`}>{p.badge}</span>
                <button className={`pc-wish ${wishlist.includes(p.id) ? "wished" : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}>
                  {wishlist.includes(p.id) ? "♥" : "♡"}
                </button>
              </div>
              <div className="pc-body">
                <span className="pc-cat">{p.category}</span>
                <h3 className="pc-name">{p.name}</h3>
                <div className="pc-prices">
                  <span className="pc-now">₹{p.price.toLocaleString()}</span>
                  <span className="pc-was">₹{p.originalPrice.toLocaleString()}</span>
                  <span className="pc-pct">{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF</span>
                </div>
                <button className={`pc-cart ${addedId === p.id ? "pc-added" : ""}`} onClick={() => addToCart(p)}>
                  <span>{addedId === p.id ? "✓ Added!" : "Add to Cart"}</span>
                  <div className="pc-cart-bg" />
                </button>
              </div>
            </ShinyCard>
          ))}
        </div>
      </section>

      {/* ─── PROMO ─── */}
      <section className="promo-section">
        <Reveal from="bottom">
          <div className="promo-card">
            <div className="promo-bg-glyph">ᚷ</div>
            <div className="promo-body-text" style={{ zIndex: 2 }}>
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
      <section id="about" className="testimonials">
        <Reveal from="bottom">
          <div className="sec-head">
            <div className="sec-eyebrow"><span className="sec-rune">ᛊ</span> Reviews</div>
            <h2 className="sec-title">Kings Have Spoken</h2>
          </div>
        </Reveal>
        <div className="test-grid">
          <StaggerIn baseDelay={100} stagger={100}>
            {[
              { name:"Arjun S.",  city:"Mumbai",    a:"A", text:"The Norse King Jacket is an absolute head-turner. Premium quality and delivery was blazing fast.", stars:5 },
              { name:"Rahul M.",  city:"Delhi",     a:"R", text:"Best men's brand I've discovered. The Loki Noir perfume has everyone asking what I'm wearing!", stars:5 },
              { name:"Vikram P.", city:"Bangalore", a:"V", text:"Premium feel at a fair price. The unboxing experience feels like opening a gift from Valhalla.", stars:5 },
            ].map((t, i) => (
              <div key={i} className="test-card">
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
            ))}
          </StaggerIn>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section id="contact" className="newsletter" style={{ paddingBottom: "120px" }}>
        <Reveal from="bottom">
          <div className="nl-wrap">
            <div className="nl-runes">
              {["ᛟ","ᚱ","ᛞ"].map((r,i) => <span key={i} className="nl-r" style={{animationDelay:`${i*0.45}s`}}>{r}</span>)}
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

      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          padding: '14px 24px', borderRadius: '8px', zIndex: 9999, fontSize: '14px',
          background: toast.type === 'success' ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)',
          color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
