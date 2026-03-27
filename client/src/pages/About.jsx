import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/StoreContext";
import { GravityField, Reveal, CountUp, GlitchTitle } from "../components/Interactivity";
import "../index.css";
import "./About.css";

const VALUES = [
  { rune: "ᚠ", title: "Craftsmanship", desc: "Every garment is a relic. We partner with master artisans who treat each stitch as a vow to quality." },
  { rune: "ᚢ", title: "Heritage",      desc: "Norse mythology is our blueprint. Ancient symbols of power, reimagined for the streets of today." },
  { rune: "ᚦ", title: "Strength",      desc: "Our materials endure. Premium fabrics, reinforced construction — built to outlast trends." },
  { rune: "ᚨ", title: "Honour",        desc: "Transparent pricing, ethical sourcing, no compromise on worker welfare — ever." },
  { rune: "ᚱ", title: "Brotherhood",   desc: "We are a community of kings. Every purchase makes you part of the Loki legacy." },
  { rune: "ᚲ", title: "Innovation",    desc: "Norse tradition meets modern design. We push boundaries every season." },
];

const TEAM = [
  { name: "Arjun Mehta",     role: "Founder & King",         avatar: "A", city: "Mumbai" },
  { name: "Priya Sharma",    role: "Head of Design",          avatar: "P", city: "Bangalore" },
  { name: "Vikram Nair",     role: "Product Architect",       avatar: "V", city: "Chennai" },
  { name: "Riya Kapoor",     role: "Brand Storyteller",       avatar: "R", city: "Delhi" },
];

const MILESTONES = [
  { year: "2020", title: "The Forge is Lit",  desc: "Loki Stores founded in a tiny Mumbai workshop with just 3 designs and a big dream." },
  { year: "2021", title: "The First Kingdom", desc: "Reached 1,000 orders. Expanded to jackets and footwear. The realm began to grow." },
  { year: "2022", title: "Digital Dominion",  desc: "Launched online-first with nationwide shipping. Norse mythology meets e-commerce." },
  { year: "2023", title: "12,000 Kings",      desc: "Hit 12,000 happy customers. Introduced grooming and accessories collections." },
  { year: "2024", title: "The Legend Grows",  desc: "500+ products, 4.9★ rating, and a brotherhood that spans all corners of India." },
];

export default function About() {
  const location = useLocation();
  // eslint-disable-next-line
  const [openFaq, setOpenFaq] = useState(null);
  const { cartCount, setDrawerOpen } = useCart();

  const userName =
    location.state?.userName ||
    JSON.parse(localStorage.getItem("lokiLoggedIn") || "null")?.name ||
    JSON.parse(sessionStorage.getItem("lokiLoggedIn") || "null")?.name || null;

  return (
    <div className="page-root">
      <GravityField count={18} repelRadius={100} repelForce={0.3} />

      <div className="land-bg">
        <div className="bg-base" /><div className="bg-grid" />
        <div className="bg-r1" /><div className="bg-r2" /><div className="bg-r3" />
        <div className="bg-noise" /><div className="bg-vignette" />
      </div>

      <Navbar cartCount={cartCount} onCartOpen={() => setDrawerOpen(true)} userName={userName} />

      {/* ─── HERO ─── */}
      <div className="page-hero about-hero">
        <Reveal from="bottom">
          <div className="ph-eyebrow"><span>ᚦ</span> &nbsp;Our Story</div>
          <h1 className="ph-title"><GlitchTitle text="Born From Myth" /></h1>
          <p className="ph-sub">
            Loki Stores was forged in the belief that every man deserves to carry the energy of a god.
            We blend Norse mythology's primal power with modern fashion's precision.
          </p>
        </Reveal>
      </div>

      {/* ─── STATS ─── */}
      <section className="about-stats-bar">
        <div className="about-stats-inner">
          {[
            { n: 12000, s: "+", label: "Happy Kings",     icon: "👑" },
            { n: 500,   s: "+", label: "Products",        icon: "⚔️" },
            { n: 4,     s: " Years", label: "Forging",    icon: "🔥" },
            { n: 50,    s: "+", label: "Cities Reached",  icon: "🗺️" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 100} from="bottom">
              <div className="abs-item">
                <span className="abs-icon">{s.icon}</span>
                <div className="abs-num">
                  <CountUp end={s.n} suffix={s.s} />
                </div>
                <div className="abs-label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── BRAND STORY ─── */}
      <section className="about-story">
        <div className="about-inner">
          <div className="story-grid">
            <Reveal from="left">
              <div className="story-visual">
                <div className="sv-orb">
                  <div className="svo-ring r1" /><div className="svo-ring r2" />
                  <div className="svo-core">
                    <span className="svo-rune">ᛚ</span>
                  </div>
                  <div className="svo-runes">
                    {["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ"].map((r,i) => (
                      <span key={i} className="svo-float-r" style={{ "--i": i }}>{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal from="right">
              <div className="story-text">
                <div className="sec-eyebrow"><span className="sec-rune">ᚱ</span> The Legend</div>
                <h2 className="sec-title" style={{ textAlign:"left", marginBottom:"24px", fontSize:"clamp(1.8rem,3vw,2.6rem)" }}>
                  Where Warriors<br />Dress Themselves
                </h2>
                <p className="story-p">In Norse mythology, the gods didn't just possess power — they wore it. Every garment was an armour, every rune a weapon. <em>Loki Stores</em> was born from this truth.</p>
                <p className="story-p">Founded in 2020 by a small team obsessed with Norse lore and premium fashion, we set out to build clothing for the modern warrior — the man who conquers boardrooms, streets, and mountains alike.</p>
                <p className="story-p">Today, we ship across India, serve 12,000+ kings, and hold a 4.9-star rating. But our mission hasn't changed: <strong>make every man feel like a god.</strong></p>
                <div className="story-sig">
                  <div className="ss-avatar">A</div>
                  <div>
                    <div className="ss-name">Arjun Mehta</div>
                    <div className="ss-role">Founder, Loki Stores</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="about-values">
        <div className="about-inner">
          <Reveal from="bottom">
            <div className="sec-head">
              <div className="sec-eyebrow"><span className="sec-rune">ᚨ</span> Our Code</div>
              <h2 className="sec-title">The Six Pillars</h2>
              <p className="sec-sub">The runes that guide every decision we make</p>
            </div>
          </Reveal>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <Reveal key={i} delay={i * 70} from="bottom">
                <div className="val-card">
                  <div className="val-rune">{v.rune}</div>
                  <h3 className="val-title">{v.title}</h3>
                  <p className="val-desc">{v.desc}</p>
                  <div className="val-line" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="about-timeline">
        <div className="about-inner">
          <Reveal from="bottom">
            <div className="sec-head">
              <div className="sec-eyebrow"><span className="sec-rune">ᛏ</span> History</div>
              <h2 className="sec-title">Chronicle of Kings</h2>
            </div>
          </Reveal>
          <div className="timeline">
            {MILESTONES.map((m, i) => (
              <Reveal key={i} delay={i * 100} from={i % 2 === 0 ? "left" : "right"}>
                <div className={`tl-item ${i % 2 === 0 ? "tl-left" : "tl-right"}`}>
                  <div className="tl-card">
                    <div className="tl-year">{m.year}</div>
                    <h3 className="tl-title">{m.title}</h3>
                    <p className="tl-desc">{m.desc}</p>
                  </div>
                  <div className="tl-dot" />
                </div>
              </Reveal>
            ))}
            <div className="tl-spine" />
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="about-team">
        <div className="about-inner">
          <Reveal from="bottom">
            <div className="sec-head">
              <div className="sec-eyebrow"><span className="sec-rune">ᛜ</span> The Council</div>
              <h2 className="sec-title">Meet the Warriors</h2>
              <p className="sec-sub">The minds behind the myth</p>
            </div>
          </Reveal>
          <div className="team-grid">
            {TEAM.map((t, i) => (
              <Reveal key={i} delay={i * 80} from="bottom">
                <div className="team-card">
                  <div className="tc-avatar-lg">{t.avatar}</div>
                  <div className="team-rune-wrap">
                    {["ᚠ","ᚱ","ᛏ","ᚷ"][i]}
                  </div>
                  <h3 className="tc-name-lg">{t.name}</h3>
                  <div className="tc-role">{t.role}</div>
                  <div className="tc-city-tag">{t.city}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
