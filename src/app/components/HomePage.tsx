/**
 * HomePage.tsx — EcoFriendlyWoodenDecor
 *
 * Design references  : Moooi · Apple Product Pages · Stripe / Linear · Lush · Kikk Festival
 * Color system       :
 *   Gradient 1  bg-gradient-to-br from-[#2C3E50] to-[#4CA1AF]  (odd  sections)
 *   Gradient 2  bg-gradient-to-br from-[#4CA1AF] to-[#2C3E50]  (even sections)
 *   Glass cards backdrop-blur + bg-white/8 + border-white/15
 *   CTA buttons bg-white text-[#2C3E50] + cyan glow shadow
 *
 * Animation physics (animation-physics skill):
 *   GSAP ScrollTrigger  — stagger: 0.1 reveals on every section (.gsap-section / .gsap-item)
 *                         hero bg parallax y: -50
 *   Framer Motion       — 3D tilt (useSpring 300/30) on featured product cards
 *                         white/light glare overlay (radial rgba 255,255,255,0.12)
 *                         whileTap scale: 0.98 separated from tilt wrapper
 *   Pure inline SVG     — all icons, animated arrow indicator on cards
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  motion,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PRODUCTS } from "../../data/products";
import { HeroSection } from "./HeroSection";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Images ──────────────────────────────────────────────────────────────────

const IMG = {
  hero:        "https://images.unsplash.com/photo-1764755932155-dabbee87df7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwb2ZmaWNlJTIwZGVzayUyMHNldHVwJTIwY2xlYW58ZW58MXx8fHwxNzc1NTYzODcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  workspace:   "https://images.unsplash.com/photo-1771150251872-95826aa516ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkZXNrJTIwYWNjZXNzb3JpZXMlMjB3b3Jrc3BhY2UlMjBzZXR1cCUyMG1pbmltYWx8ZW58MXx8fHwxNzc1NTYzODY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  wallDecor:   "https://images.unsplash.com/photo-1606933988322-a3cb8968e5ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB3b3JsZCUyMG1hcCUyMHdhbGwlMjBkZWNvciUyMGludGVyaW9yfGVufDF8fHx8MTc3NTU2Mzg2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  gifts:       "https://images.unsplash.com/photo-1759563874665-ffa9dfbd0205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBnaWZ0JTIwYm94JTIwc2V0JTIwcHJlbWl1bSUyMHBhY2thZ2luZ3xlbnwxfHx8fDE3NzU1NjM4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  organization:"https://images.unsplash.com/photo-1764161852303-8683d296f0cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb3JnYW5pemF0aW9uJTIwd29vZGVuJTIwc2hlbHZlcyUyMG1pbmltYWx8ZW58MXx8fHwxNzc1NTYzODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  workshop:    "https://images.unsplash.com/photo-1771668343211-0f976f6f32ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjcmFmdCUyMHdvcmtzaG9wJTIwcHJvZHVjdGlvbiUyMGFydGlzYW58ZW58MXx8fHwxNzc1NTYzODcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  engraving:   "https://images.unsplash.com/photo-1582269847642-87432658c952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXNlciUyMGVuZ3JhdmluZyUyMHdvb2QlMjBjdXN0b20lMjBwZXJzb25hbGl6ZWR8ZW58MXx8fHwxNzc1NTYzODczfDA&ixlib=rb-4.1.0&q=80&w=1080",
  monitorStand:"https://images.unsplash.com/photo-1764557238996-c1df265dddb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlJTIwbW9uaXRvciUyMHN0YW5kJTIwd29vZGVufGVufDF8fHx8MTc3NTU2Mzg3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  livingRoom:  "https://images.unsplash.com/photo-1653242370332-e332a8103763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwd2FsbCUyMGRlY29yJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU1NjM4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  phoneStand:  "https://images.unsplash.com/photo-1679110450190-f196308c303c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBwaG9uZSUyMHN0YW5kJTIwZGVzayUyMG9yZ2FuaXplcnxlbnwxfHx8fDE3NzU1NjM4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
};

// ─── Pure SVG icon atoms (zero icon-library dependencies) ────────────────────

function IconLeaf() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M17 3C11 3 4 8 4 16c3-1 6-3 8-6M4 16c2-4 6-8 10-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconRuler() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 8V6M8 8V7M11 8V6M14 8V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2a5 5 0 015 5c0 4-5 11-5 11S5 11 5 7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="10" cy="7" r="1.5" fill="currentColor"/>
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2L3 5v5c0 4 3 7 7 8 4-1 7-4 7-8V5l-7-3z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconPalette() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="7"  cy="8"  r="1" fill="currentColor"/>
      <circle cx="13" cy="8"  r="1" fill="currentColor"/>
      <circle cx="10" cy="13" r="1" fill="currentColor"/>
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 17s-7-5-7-10a4 4 0 018 0 4 4 0 018 0c0 5-7 10-9 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function IconStar({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L7 1z"
        stroke="#E4572E"
        strokeWidth="1"
        fill={filled ? "#E4572E" : "none"}
      />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Glassmorphism style helper ───────────────────────────────────────────────

// Warm-matte overlay — Soft Ivory + Muted Sand tones replace cold white glass
// Reduced blur (8px vs 16px) makes it feel less "tech product", more tactile craft
const glass = {
  background:    "rgba(251, 246, 238, 0.06)",
  border:        "1px solid rgba(232, 216, 195, 0.18)",
  backdropFilter:"blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
} as React.CSSProperties;

const glassStrong = {
  background:    "rgba(251, 246, 238, 0.10)",
  border:        "1px solid rgba(232, 216, 195, 0.28)",
  backdropFilter:"blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
} as React.CSSProperties;

// ─── CTA Button styles ────────────────────────────────────────────────────────

const ctaShadow       = "0 0 20px rgba(228,87,46,0.40)";
const ctaShadowHover  = "0 0 34px rgba(228,87,46,0.70), 0 4px 16px rgba(0,0,0,0.30)";

// ─── Featured Product TiltCard ────────────────────────────────────────────────
//
// Framer Motion 3D tilt (stiffness 300, damping 30) + white/light glare overlay.
// whileTap scale: 0.98 in its own wrapper (strict separation of concerns).

interface TiltCardProps {
  product: (typeof PRODUCTS)[number];
  onClick: () => void;
}

function TiltCard({ product, onClick }: TiltCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });
  const glareX  = useMotionValue(50);
  const glareY  = useMotionValue(50);

  // White glare — light radial highlight on dark glass surface
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12), transparent 65%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = tiltRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const nx = ((e.clientX - left) / width  - 0.5) * 2;
    const ny = ((e.clientY - top)  / height - 0.5) * 2;
    rotateY.set(nx * 10);
    rotateX.set(-ny * 10);
    glareX.set(((e.clientX - left) / width)  * 100);
    glareY.set(((e.clientY - top)  / height) * 100);
  }

  // Touch tilt — reduced angle (6°) for thumb-controlled feel
  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    const touch = e.touches[0];
    const el = tiltRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const nx = ((touch.clientX - left) / width  - 0.5) * 2;
    const ny = ((touch.clientY - top)  / height - 0.5) * 2;
    rotateY.set(nx * 6);
    rotateX.set(-ny * 6);
    glareX.set(((touch.clientX - left) / width)  * 100);
    glareY.set(((touch.clientY - top)  / height) * 100);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
    setHovered(false);
  }

  return (
    // Layer 1 — physical click scale (separated from tilt)
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      {/* Layer 2 — 3D tilt + glare */}
      <motion.div
        ref={tiltRef}
        style={{ ...glass, rotateX, rotateY, transformPerspective: 900 }}
        animate={{
          boxShadow: hovered
            ? "0 24px 64px rgba(0,0,0,0.5), 0 0 32px rgba(228,87,46,0.25)"
            : "0 4px 24px rgba(0,0,0,0.25)",
        }}
        transition={{ boxShadow: { duration: 0.4, ease: "easeOut" } }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        className="relative overflow-hidden h-full flex flex-col"
      >
        {/* Image zone */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "4 / 3", background: "rgba(255,255,255,0.04)" }}
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
          {/* Diagonal ribbon for NEW — notch style, unique vs pill badges */}
          {product.isNew && (
            <div className="absolute top-0 right-0 overflow-hidden" style={{ width: 64, height: 64, zIndex: 2 }}>
              <div
                style={{
                  position: "absolute",
                  top: 15,
                  right: -17,
                  background: "#E4572E",
                  color: "white",
                  fontSize: "0.45rem",
                  letterSpacing: "0.16em",
                  fontWeight: 700,
                  padding: "3px 22px",
                  transform: "rotate(45deg)",
                  whiteSpace: "nowrap",
                }}
              >
                NEW
              </div>
            </div>
          )}
          {/* BESTSELLER stays as grounded pill — bottom-left, different language */}
          {product.isBestseller && (
            <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[#2B1E17] bg-[#FBF6EE]"
              style={{ fontSize: "0.6rem", letterSpacing: "0.14em", fontWeight: 700 }}>
              BESTSELLER
            </span>
          )}
          <span
            className="absolute bottom-3 right-3 px-2.5 py-1 text-white/60"
            style={{ ...glass, fontSize: "0.6rem", letterSpacing: "0.1em" }}
          >
            {product.material.toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex-1">
            <p className="text-[#E4572E] mb-1"
              style={{ fontSize: "0.62rem", letterSpacing: "0.18em", fontWeight: 600 }}>
              {product.category.toUpperCase()}
            </p>
            <h3 className="text-white mb-1.5 leading-snug"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem" }}>
              {product.title}
            </h3>
            <p className="text-white/55" style={{ fontSize: "0.82rem", lineHeight: 1.55 }}>
              {product.subtitle}
            </p>
          </div>
          <div className="mt-4 pt-4 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="text-white font-bold" style={{ fontSize: "1rem" }}>
              {product.price}
            </span>
            {/* Pure SVG Arrow — opacity 0/x-10/y10 → slides in on hover */}
            <motion.span
              animate={hovered ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -10, y: 10 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex items-center gap-1.5 text-[#E4572E]"
              style={{ fontSize: "0.75rem", fontWeight: 500 }}
              aria-hidden
            >
              <span>Explore</span>
              <IconArrow />
            </motion.span>
          </div>
        </div>

        {/* White glare overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: glareBg }}
          aria-hidden
        />
      </motion.div>
    </motion.div>
  );
}

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={glass} className="overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-transparent border-none cursor-pointer"
      >
        <span className="text-white pr-4" style={{ fontSize: "0.97rem", fontWeight: 500, lineHeight: 1.45 }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#E4572E] flex-shrink-0"
        >
          <IconChevronDown />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p
          className="px-6 pb-5 text-white/60"
          style={{ fontSize: "0.92rem", lineHeight: 1.75 }}
        >
          {a}
        </p>
      </motion.div>
    </div>
  );
}

// ─── Framer Motion section reveal variant ────────────────────────────────────

// Y-axis reveal — used on odd sections (upward emergence)
const revealVariant = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
};

// X-axis reveal — used on even sections (lateral entrance) for visual variety
const revealVariantAlt = {
  hidden:  { opacity: 0, x: -22 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
};

// ─── HomePage ─────────────────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate();
  const pageRef  = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ── GSAP: all section stagger reveals ───────────────────────────────────
  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Staggered section reveals — 0.06s stagger prevents last-card delay on large grids
    const sections = document.querySelectorAll(".gsap-section");
    sections.forEach((section, idx) => {
      const items = section.querySelectorAll(".gsap-item");
      if (!items.length) return;

      if (prefersReduced) {
        // Reduced motion: just show items immediately without animation
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 32 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: { amount: Math.min(items.length * 0.06, 0.54), ease: "expo.out" },
        ease: "power3.out",
        scrollTrigger: {
          id: `home-${idx}`,
          trigger: section,
          start: "top 85%",
          once: true,
        },
      });
    });
  }, { scope: pageRef, dependencies: [] });

  const [formData, setFormData] = useState({ name: "", contact: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setFormData({ name:"", contact:"", type:"", message:"" }); }, 3000);
  };

  const FEATURED = PRODUCTS.filter(p => p.isBestseller || p.isNew).slice(0, 4);

  return (
    <div ref={pageRef} style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ════════════════════════════════════════════════════════════
          1. HERO — HeroSection with animated walnut clock organizer
      ════════════════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ════════════════════════════════════════════════════════════
          2. SCENARIOS — Gradient 2, glassmorphism image cards
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#2B1E17]">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="tracking-[0.22em] uppercase text-white/50 mb-3"
              style={{ fontSize: "0.67rem", fontWeight: 600 }}>
              Выбрать по сценарию
            </p>
            <h2 className="text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.015em" }}>
              Ваш идеальный интерьер
            </h2>
          </motion.div>

          <div className="gsap-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Рабочее место",  subtitle: "Аксессуары для концентрации",   img: IMG.workspace },
              { title: "Декор стен",      subtitle: "Акцентные детали для дома",     img: IMG.wallDecor },
              { title: "Подарки",         subtitle: "Подарки с душою",               img: IMG.gifts },
              { title: "Для дома",        subtitle: "Натуральная элегантность",       img: IMG.organization },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                className="gsap-item cursor-pointer relative overflow-hidden"
                whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.45)" }}
                style={{ aspectRatio: "3/4" }}
                onClick={() => navigate("/catalog")}
              >
                {/* Image with zoom on hover */}
                <motion.img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "center center" }}
                />

                {/* Base gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B1E17]/85 via-[#2B1E17]/20 to-transparent" />

                {/* Hover colour tint */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  style={{ background: "rgba(228,87,46,0.08)" }}
                />

                {/* Info strip — slides up on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  initial={{ y: 0 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ background: "linear-gradient(to top, rgba(43,30,23,0.92), transparent)" }}
                >
                  <h3 className="text-white mb-0.5" style={{ fontSize: "1.1rem", fontWeight: 500 }}>
                    {item.title}
                  </h3>
                  <p className="text-white/60 mb-3" style={{ fontSize: "0.82rem" }}>{item.subtitle}</p>
                  {/* Arrow — fades in on hover */}
                  <motion.span
                    className="flex items-center gap-1.5 text-[#E4572E]"
                    style={{ fontSize: "0.75rem", fontWeight: 500 }}
                    initial={{ opacity: 0, x: -8 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    В каталог
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          3. FEATURED PRODUCTS — Gradient 1, Framer Motion 3D tilt
      ════════════════════════════════════════════════════════════ */}
      <section id="catalog" className="py-24 md:py-32 bg-[#2B1E17]">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="tracking-[0.22em] uppercase text-[#E4572E] mb-3"
              style={{ fontSize: "0.67rem", fontWeight: 600 }}>
              Наши коллекции
            </p>
            <h2 className="text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.015em" }}>
              Популярные товары
            </h2>
            <p className="text-white/55 mt-3 max-w-md mx-auto" style={{ fontSize: "0.95rem" }}>
              Бестселлеры и новинки — каждое изделие хранит тепло и текстуру натурального дерева.
            </p>
          </motion.div>

          {/* 3D tilt cards — Framer Motion, no GSAP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {FEATURED.map((product) => (
              <TiltCard
                key={product.id}
                product={product}
                onClick={() => product.link ? navigate(product.link) : navigate("/catalog")}
              />
            ))}
          </div>

          <div className="text-center">
            <motion.button
              onClick={() => navigate("/catalog")}
              className="bg-[#E4572E] text-white cursor-pointer border-none px-10 py-4"
              style={{ fontSize: "0.9rem", letterSpacing: "0.06em", fontWeight: 600, boxShadow: ctaShadow }}
              whileHover={{ y: -2, boxShadow: ctaShadowHover }}
              whileTap={{ y: 0, scale: 0.98 }}
            >
              Смотреть все товары
            </motion.button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          4. WHY CHOOSE US — Gradient 2, glass feature boxes
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#2B1E17]">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="tracking-[0.22em] uppercase text-white/50 mb-3"
              style={{ fontSize: "0.67rem", fontWeight: 600 }}>
              Почему Woodcraft?
            </p>
            <h2 className="text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.015em" }}>
              С вниманием к деталям
            </h2>
          </motion.div>

          <div className="gsap-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { Icon: IconLeaf,    title: "Натуральные материалы",    desc: "Дуб, ясень, береза — тщательно отобранная древесина от ответственных поставщиков." },
              { Icon: IconRuler,   title: "Промышленная точность", desc: "ЧПУ-обработка, лазерная резка и ручная шлифовка для безупречного результата." },
              { Icon: IconPin,     title: "Местное производство",     desc: "Дизайн и производство в Беларуси, поддержка традиций и мастерства." },
              { Icon: IconShield,  title: "Безопасная отделка",        desc: "Масла на водной основе и эко-покрытия. Безопасно для вашего дома и планеты." },
              { Icon: IconPalette, title: "Чистый дизайн",         desc: "Минималистичная эстетика, которая естественно вписывается в современный интерьер." },
              { Icon: IconHeart,   title: "Красота и польза",    desc: "Каждое изделие решает конкретную задачу, добавляя уюта вашему пространству." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="gsap-item p-7" style={glass}>
                <div
                  className="inline-flex items-center justify-center w-11 h-11 mb-5 text-[#E4572E]"
                  style={{ background: "rgba(228,87,46,0.12)", border: "1px solid rgba(228,87,46,0.30)" }}
                >
                  <Icon />
                </div>
                <h4 className="text-white mb-2" style={{ fontSize: "1rem", fontWeight: 500 }}>{title}</h4>
                <p className="text-white/55" style={{ fontSize: "0.88rem", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          5. BUNDLES — Gradient 1, glass bundle cards
      ════════════════════════════════════════════════════════════ */}
      <section id="bundles" className="py-24 md:py-32 bg-[#2B1E17]">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="tracking-[0.22em] uppercase text-[#E4572E] mb-3"
              style={{ fontSize: "0.67rem", fontWeight: 600 }}>
              Готовые решения
            </p>
            <h2 className="text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.015em" }}>
              Комплекты для вашего интерьера
            </h2>
            <p className="text-white/55 mt-3 max-w-lg mx-auto" style={{ fontSize: "0.95rem" }}>
              Забудьте о муках выбора. Наши сеты объединяют идеально сочетающиеся изделия по выгодной цене.
            </p>
          </motion.div>

          <div className="gsap-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Рабочий кабинет",  items: "Полка для монитора + Подставка для телефона + Органайзер кабелей + Лоток", price: "$145", save: "-15%", img: IMG.monitorStand },
              { title: "Декор гостиной",   items: "Карта мира + Подвесные полки + Настенные часы",              price: "$189", save: "-12%", img: IMG.livingRoom   },
              { title: "Подарочный сет",         items: "Подставка для телефона + Органайзер + Гравировка + Коробка",  price: "$79",  save: "-18%", img: IMG.gifts        },
              { title: "Эко-старт",    items: "Ключница + Подставка для телефона + Настольный коврик",                    price: "$59",  save: "-10%", img: IMG.workspace    },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="gsap-item group cursor-pointer overflow-hidden flex flex-col h-full"
                style={glass}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white" style={{ fontSize: "1rem", fontWeight: 500 }}>{item.title}</h4>
                    <span className="px-2 py-0.5 bg-[#E4572E] text-white"
                      style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em" }}>
                      {item.save}
                    </span>
                  </div>
                  <p className="text-white/50 mb-4 flex-1" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>{item.items}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-white font-bold" style={{ fontSize: "1.1rem" }}>{item.price}</span>
                    <span className="flex items-center gap-1 text-[#E4572E] transition-all duration-300 group-hover:gap-2"
                      style={{ fontSize: "0.82rem" }}>
                      Купить сет <IconArrow />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          6. ABOUT — Gradient 2, editorial layout
      ════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 md:py-32 bg-[#2B1E17]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              variants={revealVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="overflow-hidden"
              style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.35)" }}
            >
              <img
                src={IMG.workshop}
                alt="Мастерская Woodcraft"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </motion.div>
            <motion.div
              variants={revealVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="tracking-[0.25em] uppercase text-[#E4572E] mb-3"
                style={{ fontSize: "0.67rem", fontWeight: 600 }}>
                Наша история
              </p>
              <h2 className="text-white mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.2 }}>
                Дизайн, вдохновленный<br />природой
              </h2>
              <div className="space-y-4 text-white/60 mb-8" style={{ fontSize: "0.96rem", lineHeight: 1.8 }}>
                <p>Woodcraft родилась из простого убеждения: повседневные предметы должны ощущаться так же хорошо, как они выглядят. Мы начинали в небольшой мастерской в Беларуси, объединяя любовь к натуральным материалам с современным дизайном.</p>
                <p>Каждое изделие — от карт мира до настольных органайзеров — проходит путь от вдумчивого эскиза до точного производства. Мы используем дуб, ясень и березовую фанеру местного происхождения, покрытые безопасными маслами на водной основе.</p>
              </div>
              <div className="flex gap-10 mb-8">
                {[{ num: "5+", label: "Лет работы" }, { num: "12k+", label: "Заказов" }, { num: "4.9★", label: "Рейтинг" }].map((s) => (
                  <div key={s.label}>
                    <div className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 600 }}>
                      {s.num}
                    </div>
                    <div className="text-white/45" style={{ fontSize: "0.8rem" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <motion.button
                onClick={() => scrollTo("#order-form")}
                className="bg-[#E4572E] text-white cursor-pointer border-none px-8 py-4"
                style={{ fontSize: "0.88rem", letterSpacing: "0.06em", fontWeight: 600, boxShadow: ctaShadow }}
                whileHover={{ y: -2, boxShadow: ctaShadowHover }}
                whileTap={{ y: 0, scale: 0.98 }}
              >
                Связаться с нами
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          7. CUSTOM & CORPORATE — Gradient 1
      ════════════════════════════════════════════════════════════ */}
      <section id="custom" className="py-24 md:py-32 bg-[#2B1E17]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              variants={revealVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <p className="tracking-[0.25em] uppercase text-[#E4572E] mb-3"
                style={{ fontSize: "0.67rem", fontWeight: 600 }}>
                Для бизнеса и спецзаказов
              </p>
              <h2 className="text-white mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.2 }}>
                Сделайте подарок<br />по-настоящему личным
              </h2>
              <p className="text-white/60 mb-6" style={{ fontSize: "0.96rem", lineHeight: 1.8 }}>
                Добавьте лазерную гравировку на любое изделие — имена, логотипы, важные даты или послания.
                Идеально для корпоративных подарков, мероприятий или уникальных личных сюрпризов.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {["Брендированные сеты", "Оптовые заказы", "Подарки на ивенты"].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-white/70"
                    style={{ fontSize: "0.9rem" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E4572E]" />
                    {feat}
                  </div>
                ))}
              </div>
              <motion.button
                onClick={() => scrollTo("#order-form")}
                className="bg-[#E4572E] text-white cursor-pointer border-none px-8 py-4"
                style={{ fontSize: "0.88rem", letterSpacing: "0.06em", fontWeight: 600, boxShadow: ctaShadow }}
                whileHover={{ y: -2, boxShadow: ctaShadowHover }}
                whileTap={{ y: 0, scale: 0.98 }}
              >
                Обсудить проект
              </motion.button>
            </motion.div>
            <motion.div
              variants={revealVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.18 }}
              className="overflow-hidden"
              style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.35)" }}
            >
              <img
                src={IMG.engraving}
                alt="Индивидуальная лазерная гравировка"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          8. TESTIMONIALS — Gradient 2, glass quote cards
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#2B1E17]">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="tracking-[0.22em] uppercase text-white/50 mb-3"
              style={{ fontSize: "0.67rem", fontWeight: 600 }}>
              Отзывы клиентов
            </p>
            <h2 className="text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.015em" }}>
              Нам доверяют тысячи
            </h2>
          </motion.div>

          <div className="gsap-section grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Анна К.",     role: "Дизайнер интерьеров",  stars: 5, text: "Карта мира превзошла все ожидания. Детализация слоев, качество дуба — она стала центром нашей гостиной." },
              { name: "Дмитрий В.",   role: "Разработчик",  stars: 5, text: "Заказал полный сет для рабочего стола. Мое место никогда не выглядело таким чистым. Текстура дерева потрясающая." },
              { name: "Марина С.",   role: "Маркетинг-менеджер",  stars: 5, text: "Заказали 50 брендированных наборов для команды. Гравировка идеальная, доставка вовремя, упаковка выглядит очень премиально." },
            ].map((t) => (
              <div key={t.name} className="gsap-item p-8" style={glassStrong}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => <IconStar key={j} />)}
                </div>
                <p className="text-white/80 mb-6" style={{ fontSize: "0.93rem", lineHeight: 1.75 }}>
                  "{t.text}"
                </p>
                <div>
                  <div className="text-white" style={{ fontSize: "0.9rem", fontWeight: 500 }}>{t.name}</div>
                  <div className="text-white/45" style={{ fontSize: "0.8rem" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          9. FAQ — Gradient 1, glass accordion
      ════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 md:py-32 bg-[#2B1E17]">
        <div className="max-w-3xl mx-auto px-5">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="tracking-[0.22em] uppercase text-[#E4572E] mb-3"
              style={{ fontSize: "0.67rem", fontWeight: 600 }}>
              Вопросы и ответы
            </p>
            <h2 className="text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.015em" }}>
              Частые вопросы
            </h2>
          </motion.div>
          <div className="space-y-2">
            {[
              { q: "Какие материалы вы используете?",           a: "В основном мы работаем с дубом, ясенем, березовой фанерой и натуральным шпоном. Вся древесина поставляется из Беларуси и покрывается экологичными маслами." },
              { q: "Сколько занимает производство?",       a: "Стандартные товары отправляются в течение 3–5 рабочих дней. Индивидуальные заказы и гравировка — 7–10 рабочих дней." },
              { q: "Есть ли международная доставка?",         a: "Да, мы отправляем заказы по всей Европе и в некоторые другие страны. Стоимость рассчитывается при оформлении заказа." },
              { q: "Можно ли кастомизировать изделие?",           a: "Конечно. Мы предлагаем лазерную гравировку имен, логотипов и дат на большинстве товаров." },
              { q: "Как ухаживать за деревом?",   a: "Держите изделия сухими и вдали от прямых солнечных лучей. Протирайте мягкой сухой тканью." },
              { q: "Есть ли оптовые цены?", a: "Да. Мы предлагаем специальные условия для заказов от 10 единиц." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <FAQItem q={item.q} a={item.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          10. ORDER FORM — Gradient 2
      ════════════════════════════════════════════════════════════ */}
      <section id="order-form" className="py-24 md:py-32 bg-[#2B1E17]">
        <div className="max-w-2xl mx-auto px-5">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="tracking-[0.22em] uppercase text-white/50 mb-3"
              style={{ fontSize: "0.67rem", fontWeight: 600 }}>
              Связаться с нами
            </p>
            <h2 className="text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.015em" }}>
              Оформить заказ
            </h2>
          </motion.div>

          <motion.form
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onSubmit={handleForm}
            className="space-y-4 p-8"
            style={glassStrong}
          >
            {[
              { name: "name",    label: "Ваше имя",      type: "text",  placeholder: "Иван Иванов" },
              { name: "contact", label: "Email или телефон", type: "text",  placeholder: "ivan@email.com" },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={(formData as Record<string,string>)[name]}
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                  placeholder={placeholder}
                  required
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-white/25 focus:outline-none"
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    fontSize: "0.92rem",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#E4572E")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
                />
              </div>
            ))}
            <div>
              <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                Тип заказа
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 focus:outline-none cursor-pointer text-white"
                style={{
                  background: "rgba(43,30,23,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontSize: "0.92rem",
                }}
              >
                <option value="" className="bg-[#2B1E17]">Выберите тип…</option>
                {[
                  { label: "Стандартный заказ", val: "Standard" },
                  { label: "Спецзаказ / гравировка", val: "Custom" },
                  { label: "Корпоративный заказ", val: "Corporate" },
                  { label: "Подарочный набор", val: "Gift Set" }
                ].map((o) => (
                  <option key={o.val} value={o.val} className="bg-[#2B1E17]">{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/60 mb-1.5" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                Ваше сообщение
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Опишите ваши пожелания…"
                className="w-full px-4 py-3 bg-transparent text-white placeholder-white/25 focus:outline-none resize-none"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontSize: "0.92rem",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#E4572E")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-4 bg-[#E4572E] text-white cursor-pointer border-none"
              style={{ fontSize: "0.9rem", letterSpacing: "0.06em", fontWeight: 700, boxShadow: ctaShadow }}
              whileHover={{ y: -1, boxShadow: ctaShadowHover }}
              whileTap={{ y: 0, scale: 0.98 }}
            >
              {submitted ? "Заявка отправлена ✓" : "Оформить заявку"}
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          11. CTA BANNER — Gradient 1, white button
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-[#2B1E17] to-[#3D2318]">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <motion.div
            variants={revealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="tracking-[0.22em] uppercase text-[#E4572E] mb-3"
              style={{ fontSize: "0.67rem", fontWeight: 600 }}>
              Готовы преобразить ваше пространство?
            </p>
            <h2 className="text-white mb-5"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Каждое великое пространство<br />начинается с одной детали.
            </h2>
            <p className="text-white/55 mb-10 max-w-md mx-auto" style={{ fontSize: "1rem", lineHeight: 1.75 }}>
              Изучите наш каталог или свяжитесь с нами для создания чего-то по-настоящему уникального.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                onClick={() => navigate("/catalog")}
                className="bg-[#E4572E] text-white cursor-pointer border-none px-10 py-4"
                style={{ fontSize: "0.9rem", letterSpacing: "0.06em", fontWeight: 700, boxShadow: ctaShadow }}
                whileHover={{ y: -2, boxShadow: ctaShadowHover }}
                whileTap={{ y: 0, scale: 0.98 }}
              >
                Перейти в каталог
              </motion.button>
              <motion.button
                onClick={() => scrollTo("#order-form")}
                className="cursor-pointer border-none px-10 py-4 text-white"
                style={{ ...glass, fontSize: "0.9rem", letterSpacing: "0.06em", fontWeight: 500 }}
                whileHover={{ y: -2, background: "rgba(251,246,238,0.14)" }}
                whileTap={{ y: 0, scale: 0.98 }}
              >
                Индивидуальный заказ
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
