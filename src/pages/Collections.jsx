import React, { useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart, CATEGORIES } from "../context/StoreContext";
import { GravityField, Reveal, GlitchTitle, Toast } from "../components/Interactivity";
import "../index.css";
import "./Collections.css";

/* ── SHINY CARD — Task 4: 3D tilt + radial gold shine ── */
function ShinyProductCard({ p, onAddToCart, isAdded, wishlist, onToggleWish }) {
  const ref = useRef(null);

  const handleMove = useCallback((e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--shine-x", `${x}%`);
    card.style.setProperty("--shine-y", `${y}%`);
    const rotX = ((y - 50) / 50) * -7;
    const rotY = ((x - 50) / 50) * 7;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
  }, []);

  const handleLeave = useCallback(() => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = "";
    card.style.setProperty("--shine-x", "50%");
    card.style.setProperty("--shine-y", "50%");
  }, []);

  return (
    <div
      ref={ref}
      className="prod-card shiny-prod-card"
      style={{ "--shine-x": "50%", "--shine-y": "50%" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Shiny overlay layers */}
      <div className="sc-shine-radial" />
      <div className="sc-shine-streak" />
      <div className="sc-edge-light" />

      <div className="pc-visual" style={{ background: `radial-gradient(circle at 38% 38%, ${p.glow}, #040504 72%)` }}>
        <div className="pc-glow-ring" />
        <span className="pc-emoji">{p.emoji}</span>
        <span className={`pc-badge pcb-${p.badge.toLowerCase()}`}>{p.badge}</span>
        <button
          className={`pc-wish ${wishlist.includes(p.id) ? "wished" : ""}`}
          onClick={() => onToggleWish(p.id)}
        >
          {wishlist.includes(p.id) ? "♥" : "♡"}
        </button>
      </div>

      <div className="pc-body">
        <span className="pc-cat">{p.category}</span>
        <h3 className="pc-name">{p.name}</h3>
        {p.desc && <p className="pc-desc">{p.desc}</p>}
        <div className="pc-prices">
          <span className="pc-now">₹{p.price.toLocaleString()}</span>
          <span className="pc-was">₹{p.originalPrice.toLocaleString()}</span>
          <span className="pc-pct">{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF</span>
        </div>
        <button
          className={`pc-cart ${isAdded ? "pc-added" : ""}`}
          onClick={() => onAddToCart(p)}
        >
          <span>{isAdded ? "✓ Added to Cart!" : "Add to Cart"}</span>
          <div className="pc-cart-bg" />
        </button>
      </div>
    </div>
  );
}

/* ── SORT OPTIONS ── */
const SORT_OPTIONS = [
  { val: "default",  label: "Featured" },
  { val: "price-asc",label: "Price: Low to High" },
  { val: "price-desc",label: "Price: High to Low" },
  { val: "discount", label: "Biggest Discount" },
];

export default function Collections() {
  const location = useLocation();
  const [activeCat, setActiveCat] = useState("All");
  const [sort, setSort]           = useState("default");
  const [search, setSearch]       = useState("");
  const [toast, setToast]         = useState(null);
  const { cartCount, setDrawerOpen, addToCart, addedId, wishlist, toggleWish, products, productsLoading } = useCart();

  const userName =
    location.state?.userName ||
    JSON.parse(localStorage.getItem("lokiLoggedIn") || "null")?.name ||
    JSON.parse(sessionStorage.getItem("lokiLoggedIn") || "null")?.name || null;

  let filtered = activeCat === "All" ? products : products.filter(p => p.category === activeCat);

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (sort === "price-asc")  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "discount")   filtered = [...filtered].sort((a, b) => (b.originalPrice - b.price) / b.originalPrice - (a.originalPrice - a.price) / a.originalPrice);

  const handleAdd = (p) => {
    addToCart(p);
    setToast({ msg: `${p.name} added to cart!`, type: "success" });
  };

  return (
    <div className="page-root">
      <GravityField count={20} repelRadius={120} repelForce={0.4} />

      <div className="land-bg">
        <div className="bg-base" /><div className="bg-grid" />
        <div className="bg-r1" /><div className="bg-r2" /><div className="bg-r3" />
        <div className="bg-noise" /><div className="bg-vignette" />
      </div>

      <Navbar cartCount={cartCount} onCartOpen={() => setDrawerOpen(true)} userName={userName} />

      {/* ─── PAGE HERO ─── */}
      <div className="page-hero coll-hero">
        <Reveal from="bottom">
          <div className="ph-eyebrow"><span>ᛏ</span> &nbsp;Collections</div>
          <h1 className="ph-title"><GlitchTitle text="Forge Your Style" /></h1>
          <p className="ph-sub">
            Every piece is a weapon of war — crafted for the man who dresses like a god.
            {filtered.length > 0 && <span className="coll-count"> {filtered.length} items</span>}
          </p>
        </Reveal>
      </div>

      {/* ─── FILTERS ─── */}
      <section className="coll-section">
        <div className="coll-inner">

          {/* Search + Sort bar */}
          <div className="coll-toolbar">
            <div className="coll-search-wrap">
              <span className="cs-icon">⚡</span>
              <input
                type="text"
                placeholder="Search the realm..."
                className="coll-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="cs-clear" onClick={() => setSearch("")}>✕</button>}
            </div>
            <div className="coll-sort-wrap">
              <select
                className="coll-sort"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.val} value={o.val}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category pills */}
          <div className="cat-bar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${activeCat === cat ? "cat-on" : ""}`}
                onClick={() => setActiveCat(cat)}
              >
                {cat}
                {activeCat === cat && <span className="cat-pill-glow" />}
              </button>
            ))}
          </div>

          {/* Product grid — shiny cards */}
          {filtered.length > 0 ? (
            <div className="prod-grid">
              {filtered.map((p, i) => (
                <ShinyProductCard
                  key={p.id}
                  p={p}
                  onAddToCart={handleAdd}
                  isAdded={addedId === p.id}
                  wishlist={wishlist}
                  onToggleWish={toggleWish}
                />
              ))}
            </div>
          ) : (
            <div className="coll-empty">
              <span className="coll-empty-rune">ᚺ</span>
              <p>No items found in this realm, warrior.</p>
              <button className="cat-btn cat-on" onClick={() => { setActiveCat("All"); setSearch(""); }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
