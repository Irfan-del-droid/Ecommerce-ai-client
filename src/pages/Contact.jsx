import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/StoreContext";
import { GravityField, Reveal, GlitchTitle, Toast } from "../components/Interactivity";
import { contact as apiContact } from "../api";
import "../index.css";
import "./Contact.css";

const FAQ_DATA = [
  { q: "How long does delivery take?",          a: "Standard delivery takes 2-4 business days across India. Express delivery (24h) is available in Mumbai, Delhi, and Bangalore." },
  { q: "What is your return policy?",           a: "30-day hassle-free returns on all items. Just initiate a return from your order page and we'll arrange a free pickup." },
  { q: "Do you ship internationally?",          a: "Currently, we ship only within India. International shipping is on our roadmap for early 2025." },
  { q: "Can I track my order?",                 a: "Yes! Once shipped, you'll receive a tracking link via SMS and email. You can also track from the 'Track Order' page." },
  { q: "How do I apply a promo code?",          a: "Add items to your cart, proceed to checkout, and you'll find a 'Promo Code' field. Enter LOKI30 for 30% off your first order." },
  { q: "Are your products authentic?",          a: "100%. Every product is designed in-house and manufactured by our vetted partners. No third-party sellers, no fakes." },
];

export default function Contact() {
  const location = useLocation();
  const [faqOpen, setFaqOpen] = useState(null);
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const { cartCount, setDrawerOpen } = useCart();

  const userName =
    location.state?.userName ||
    JSON.parse(localStorage.getItem("lokiLoggedIn") || "null")?.name ||
    JSON.parse(sessionStorage.getItem("lokiLoggedIn") || "null")?.name || null;

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setToast({ msg: "Please fill all required fields.", type: "error" });
      return;
    }
    setSending(true);
    
    try {
      const data = await apiContact.sendMessage(form);
      
      setSending(false);
      setForm({ name:"", email:"", subject:"", message:"" });
      setToast({ msg: data.message || "Message sent to the realm! We'll respond within 24h.", type: "success" });
    } catch (err) {
      setSending(false);
      setToast({ msg: err.message || "Network error. Please check your connection and try again.", type: "error" });
    }
  };

  return (
    <div className="page-root">
      <GravityField count={16} repelRadius={100} repelForce={0.3} />

      <div className="land-bg">
        <div className="bg-base" /><div className="bg-grid" />
        <div className="bg-r1" /><div className="bg-r2" /><div className="bg-r3" />
        <div className="bg-noise" /><div className="bg-vignette" />
      </div>

      <Navbar cartCount={cartCount} onCartOpen={() => setDrawerOpen(true)} userName={userName} />

      {/* ─── HERO ─── */}
      <div className="page-hero contact-hero">
        <Reveal from="bottom">
          <div className="ph-eyebrow"><span>ᚲ</span> &nbsp;Contact</div>
          <h1 className="ph-title"><GlitchTitle text="Reach the Realm" /></h1>
          <p className="ph-sub">
            Questions? Queries? Need a council with the gods? We respond within 24 hours.
          </p>
        </Reveal>
      </div>

      {/* ─── CONTACT GRID ─── */}
      <section className="contact-section">
        <div className="contact-inner">
          <div className="contact-grid">

            {/* ── LEFT: Info Cards ── */}
            <div className="contact-info">
              <Reveal from="left">
                <h2 className="ci-heading">Find Us in the Nine Realms</h2>
                <p className="ci-sub">Multiple channels to reach our warrior support team.</p>
              </Reveal>

              <div className="ci-cards">
                {[
                  { icon:"📧", title:"Email",    val:"support@lokistores.com",     hint:"Reply within 12 hours" },
                  { icon:"📱", title:"Phone",    val:"+91 98765 43210",             hint:"Mon–Sat, 9AM–7PM IST" },
                  { icon:"📍", title:"Workshop", val:"Dharavi Design District, Mumbai", hint:"Visit by appointment only" },
                  { icon:"⚡", title:"Live Chat", val:"Available on WhatsApp",      hint:"Avg. response: 15 mins" },
                ].map((c, i) => (
                  <Reveal key={i} delay={i * 80} from="left">
                    <div className="ci-card">
                      <div className="cic-icon">{c.icon}</div>
                      <div className="cic-body">
                        <div className="cic-title">{c.title}</div>
                        <div className="cic-val">{c.val}</div>
                        <div className="cic-hint">{c.hint}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal from="left" delay={400}>
                <div className="ci-social-row">
                  <div className="cis-label">Follow the Brotherhood</div>
                  <div className="cis-icons">
                    {[["I","Instagram"],["T","Twitter"],["P","Pinterest"],["Y","YouTube"]].map(([l,n]) => (
                      <a key={n} href="#!" className="fb-soc" title={n}>{l}</a>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="contact-form-wrap">
              <Reveal from="right">
                <div className="contact-form-card">
                  <div className="cfc-header">
                    <span className="cfc-rune">ᛞ</span>
                    <div>
                      <div className="cfc-title">Send a Message</div>
                      <div className="cfc-sub">Fill the runes, warrior</div>
                    </div>
                  </div>

                  <div className="cfc-fields">
                    <div className="cf-row">
                      <div className="cf-group">
                        <label className="cf-label">Name *</label>
                        <input
                          type="text"
                          className="cf-input"
                          placeholder="Your warrior name"
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                        />
                      </div>
                      <div className="cf-group">
                        <label className="cf-label">Email *</label>
                        <input
                          type="email"
                          className="cf-input"
                          placeholder="your@realm.com"
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="cf-group">
                      <label className="cf-label">Subject</label>
                      <select
                        className="cf-input cf-select"
                        value={form.subject}
                        onChange={e => setForm({...form, subject: e.target.value})}
                      >
                        <option value="">Choose your quest...</option>
                        <option value="order">Order Issue</option>
                        <option value="return">Return & Refund</option>
                        <option value="product">Product Query</option>
                        <option value="shipping">Shipping</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="cf-group">
                      <label className="cf-label">Message *</label>
                      <textarea
                        className="cf-input cf-textarea"
                        placeholder="Speak your truth..."
                        rows={5}
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                      />
                    </div>
                    <button
                      className={`cf-submit ${sending ? "cf-sending" : ""}`}
                      onClick={handleSubmit}
                      disabled={sending}
                    >
                      {sending ? (
                        <><span className="cf-spinner" /> Sending...</>
                      ) : (
                        <>Send Message <span className="cf-arrow">→</span></>
                      )}
                      <div className="cf-shimmer" />
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="faq-section">
        <div className="contact-inner">
          <Reveal from="bottom">
            <div className="sec-head">
              <div className="sec-eyebrow"><span className="sec-rune">ᚠ</span> FAQ</div>
              <h2 className="sec-title">Warriors Ask</h2>
              <p className="sec-sub">The most common quests, answered</p>
            </div>
          </Reveal>
          <div className="faq-list">
            {FAQ_DATA.map((f, i) => (
              <Reveal key={i} delay={i * 60} from="bottom">
                <div className={`faq-item ${faqOpen === i ? "faq-open" : ""}`}>
                  <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                    <span>{f.q}</span>
                    <span className="faq-chevron">{faqOpen === i ? "−" : "+"}</span>
                  </button>
                  <div className="faq-a-wrap">
                    <p className="faq-a">{f.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
