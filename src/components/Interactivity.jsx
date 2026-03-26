import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   GRAVITY FIELD — Anti-Gravity Rune Particles
============================================================ */
const RUNES = ["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛜ","ᛞ","ᛟ"];

export const GravityField = ({ count = 30, repelRadius = 150, repelForce = 0.5 }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i, x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      bvx: (Math.random() - 0.5) * 0.3, bvy: (Math.random() - 0.5) * 0.3,
      rune: RUNES[i % RUNES.length], size: Math.random() * 16 + 10,
      opacity: Math.random() * 0.15 + 0.04, phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.008,
      bobAmp: Math.random() * 0.12 + 0.04, bobFreq: Math.random() * 0.007 + 0.002,
      colorType: i % 3,
    }));

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    const onMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    let tick = 0;
    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, W, H);
      const mouse = mouseRef.current;

      particlesRef.current.forEach((p) => {
        p.vy += Math.sin(tick * p.bobFreq + p.phase) * p.bobAmp * 0.008;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < repelRadius && dist > 1) {
          const strength = ((repelRadius - dist) / repelRadius) * repelForce;
          p.vx += (dx / dist) * strength; p.vy += (dy / dist) * strength;
        }
        p.vx += (p.bvx - p.vx) * 0.015; p.vy += (p.bvy - p.vy) * 0.015;
        p.vx *= 0.96; p.vy *= 0.96;
        p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed;
        const m = 70;
        if (p.x < -m) p.x = W + m; if (p.x > W + m) p.x = -m;
        if (p.y < -m) p.y = H + m; if (p.y > H + m) p.y = -m;
        const breathe = Math.sin(tick * 0.01 + p.phase) * 0.03;
        const alpha = Math.max(0, p.opacity + breathe);
        const colors = ["#c9a84c", "#4a8c5c", "#7a5c1e"];
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = alpha; ctx.fillStyle = colors[p.colorType];
        ctx.font = `${p.size}px serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(p.rune, 0, 0);
        if (dist < repelRadius * 0.5 && dist > 1) {
          const glow = (1 - dist / (repelRadius * 0.5)) * 0.35;
          ctx.globalAlpha = glow; ctx.fillStyle = "#e8c96a";
          ctx.fillText(p.rune, 0, 0);
        }
        ctx.restore();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onResize); window.removeEventListener("mousemove", onMouse); window.removeEventListener("mouseleave", onLeave); };
  }, [count, repelRadius, repelForce]);

  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />;
};

/* ============================================================
   MAGNETIC CURSOR
============================================================ */
export const MagneticCursor = () => {
  const outerRef = useRef(null), dotRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 }), target = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.1);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.1);
      if (outerRef.current) outerRef.current.style.transform = `translate(${pos.current.x - 22}px, ${pos.current.y - 22}px)`;
      if (dotRef.current) dotRef.current.style.transform = `translate(${target.current.x - 4}px, ${target.current.y - 4}px)`;
      raf.current = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={outerRef} className="cursor-outer" />
      <div ref={dotRef} className="cursor-inner-dot" />
    </>
  );
};

/* ============================================================
   TYPEWRITER
============================================================ */
export const Typewriter = ({ words, speed = 88 }) => {
  const [display, setDisplay] = useState("");
  const [wi, setWi] = useState(0), [ci, setCi] = useState(0), [del, setDel] = useState(false);

  useEffect(() => {
    const cur = words[wi]; let t;
    if (!del && ci <= cur.length) { t = setTimeout(() => { setDisplay(cur.slice(0, ci)); setCi(c => c + 1); }, speed); }
    else if (!del && ci > cur.length) { t = setTimeout(() => setDel(true), 1900); }
    else if (del && ci > 0) { t = setTimeout(() => { setDisplay(cur.slice(0, ci - 1)); setCi(c => c - 1); }, speed / 2.5); }
    else if (del && ci === 0) { setDel(false); setWi(w => (w + 1) % words.length); }
    return () => clearTimeout(t);
  }, [ci, del, wi, words, speed]);

  return <span className="typewriter-text">{display}<span className="tw-caret" /></span>;
};

/* ============================================================
   COUNT UP
============================================================ */
export const CountUp = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0), ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let v = 0; const step = end / 65;
        const t = setInterval(() => { v += step; if (v >= end) { setCount(end); clearInterval(t); } else setCount(Math.floor(v)); }, 18);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ============================================================
   SCROLL REVEAL
============================================================ */
export const Reveal = ({ children, delay = 0, from = "bottom" }) => {
  const ref = useRef(null), [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal reveal-${from} ${on ? "reveal-on" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

/* ============================================================
   GLITCH TITLE
============================================================ */
export const GlitchTitle = ({ text }) => (
  <span className="glitch" data-text={text} aria-label={text}>{text}</span>
);

/* ============================================================
   SHINY CARD — 3D tilt + radial shine + gold edge glow
============================================================ */
export const ShinyCard = ({ children, className = "", style = {} }) => {
  const ref = useRef(null);

  const handleMove = useCallback((e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--shine-x", `${x}%`);
    card.style.setProperty("--shine-y", `${y}%`);
    const rotX = ((y - 50) / 50) * -8;
    const rotY = ((x - 50) / 50) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.025) translateZ(0)`;
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
      className={`shiny-card ${className}`}
      style={{ "--shine-x": "50%", "--shine-y": "50%", ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="shiny-overlay" />
      <div className="shiny-edge-glow" />
      {children}
    </div>
  );
};

/* ============================================================
   TOAST NOTIFICATION
============================================================ */
export const Toast = ({ message, type = "success", onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
};

/* ============================================================
   MARQUEE STRIP
============================================================ */
export const Marquee = ({ items }) => (
  <div className="marquee-wrap">
    <div className="marquee-track">
      {Array(3).fill(items).flat().map((item, i) => (
        <span key={i} className={item.rune ? "mq-r" : "mq-t"}>{item.text}</span>
      ))}
    </div>
  </div>
);

/* ============================================================
   SPOTLIGHT HOVER — background spotlight that follows cursor
============================================================ */
export const SpotlightSection = ({ children, className = "" }) => {
  const ref = useRef(null);

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--sx", `${x}px`);
    el.style.setProperty("--sy", `${y}px`);
  }, []);

  return (
    <section ref={ref} className={`spotlight-section ${className}`} onMouseMove={handleMove}>
      <div className="spotlight-orb" />
      {children}
    </section>
  );
};

/* ============================================================
   STAGGER CONTAINER — children stagger-reveal on mount
============================================================ */
export const StaggerIn = ({ children, baseDelay = 0, stagger = 80 }) =>
  React.Children.map(children, (child, i) =>
    React.cloneElement(child, {
      style: { ...(child.props.style || {}), animationDelay: `${baseDelay + i * stagger}ms`, animationFillMode: "both" },
    })
  );

/* ============================================================
   PARTICLE BURST — click effect
============================================================ */
export const useClickBurst = () => {
  const [bursts, setBursts] = useState([]);
  const trigger = useCallback((e) => {
    const id = Date.now();
    setBursts(b => [...b, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setBursts(b => b.filter(p => p.id !== id)), 800);
  }, []);

  const BurstLayer = () => (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9998 }}>
      {bursts.map(burst => (
        <div key={burst.id} style={{ position:"absolute", left:burst.x, top:burst.y }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="burst-particle" style={{ "--angle": `${i * 60}deg` }} />
          ))}
        </div>
      ))}
    </div>
  );

  return { trigger, BurstLayer };
};
