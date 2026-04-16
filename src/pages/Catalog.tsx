/**
 * Catalog.tsx — EcoFriendlyWoodenDecor
 *
 * Color system:
 *   Deep Coffee  #2B1E17  — dark text, category chip active
 *   Burnt Orange #E4572E  — accents, CTAs, badges, focus states
 *   Muted Sand   #E8D8C3  — filter panel bg, mobile filter bg
 *   Soft Ivory   #FBF6EE  — page bg, hero bg, featured section bg
 *
 * Animation physics:
 *   • GSAP ScrollTrigger  — staggered grid reveal (capped at 0.54s)
 *                           hero bg parallax (y: -50)
 *   • Framer Motion       — 3D tilt (stiffness 300 / damping 30)
 *                           touch tilt (6° reduced angle for thumb control)
 *                           whileTap scale: 0.98 in SEPARATE wrapper from tilt
 *   • Pure inline SVG     — scroll indicator (SMIL only, no competing Framer)
 *                           arrow indicator: opacity 0 / x -10 / y +10 → hover
 *   • prefers-reduced-motion guard on all GSAP hooks
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  motion,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  PRODUCTS,
  CATEGORIES,
  MATERIALS,
  SORT_OPTIONS,
  type Product,
} from "../data/products";

// Register GSAP plugins once at module level
gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Pure SVG icon atoms ──────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8"  r="1.5" fill="currentColor" />
      <circle cx="9"  cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s ease",
      }}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Empty state illustration — organic wood grain SVG
function IllustrationEmpty() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      {/* Outer ring */}
      <circle cx="48" cy="48" r="44" stroke="rgba(228,87,46,0.15)" strokeWidth="1.5" />
      {/* Inner rings — tree rings aesthetic */}
      <circle cx="48" cy="48" r="32" stroke="rgba(228,87,46,0.12)" strokeWidth="1" />
      <circle cx="48" cy="48" r="20" stroke="rgba(228,87,46,0.10)" strokeWidth="1" />
      {/* Crossed search lines */}
      <path
        d="M34 34 L62 62 M62 34 L34 62"
        stroke="rgba(228,87,46,0.30)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx="48" cy="48" r="3" fill="rgba(228,87,46,0.40)" />
    </svg>
  );
}

// ─── Animation variants ───────────────────────────────────────────────────────

const sectionVariant = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
};

// ─── Premium Product Card ─────────────────────────────────────────────────────
//
// Architecture (strict separation per animation-physics spec):
//   Layer 1 — whileTap scale 0.98   (click feedback)
//   Layer 2 — rotateX / rotateY     (3D tilt + glare)
//   Must be SEPARATE divs — merged transforms cause CSS matrix conflicts.

function PremiumCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Spring physics: stiffness 300 / damping 30 → weighty, "woody" resistance
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

  // Glare cursor position (0–100 %)
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Light-theme glare: subtle dark radial gradient tracks cursor
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0,0,0,0.04), transparent 65%)`;

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
    // Layer 1 — physical click scale (NEVER merged with tilt)
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      {/* Layer 2 — 3D tilt + animated shadow + glare */}
      <motion.div
        ref={tiltRef}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        animate={{
          boxShadow: hovered
            ? "0 16px 56px rgba(43,30,23,0.14), 0 4px 16px rgba(43,30,23,0.08)"
            : "0 2px 20px rgba(43,30,23,0.07), 0 0 0 1px rgba(43,30,23,0.04)",
        }}
        transition={{ boxShadow: { duration: 0.4, ease: "easeOut" } }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        className="relative overflow-hidden bg-[#FBF6EE] h-full flex flex-col"
      >
        {/* ── Image zone ──────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "4 / 3", background: "#E8D8C3" }}
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
            <div
              className="absolute top-0 right-0 overflow-hidden"
              style={{ width: 64, height: 64, zIndex: 2 }}
            >
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

          {/* BESTSELLER — grounded badge, bottom-left, different language from NEW */}
          {product.isBestseller && (
            <span
              className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[#FBF6EE] bg-[#2B1E17]"
              style={{ fontSize: "0.6rem", letterSpacing: "0.14em", fontWeight: 700 }}
            >
              BESTSELLER
            </span>
          )}

          {/* Material chip */}
          <span
            className="absolute bottom-3 right-3 px-2.5 py-1 text-[#7A6B5E]"
            style={{
              background: "rgba(251,246,238,0.88)",
              backdropFilter: "blur(6px)",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              fontWeight: 500,
            }}
          >
            {product.material.toUpperCase()}
          </span>
        </div>

        {/* ── Content area ────────────────────────────────────────── */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex-1">
            <p
              className="text-[#E4572E] mb-1"
              style={{ fontSize: "0.62rem", letterSpacing: "0.18em", fontWeight: 600 }}
            >
              {product.category.toUpperCase()}
            </p>
            <h3
              className="text-[#2B1E17] mb-1.5 leading-snug"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem" }}
            >
              {product.title}
            </h3>
            <p className="text-[#7A6B5E]" style={{ fontSize: "0.82rem", lineHeight: 1.55 }}>
              {product.subtitle}
            </p>
          </div>

          {/* Price + SVG Arrow row */}
          <div
            className="flex items-center justify-between mt-4 pt-4"
            style={{ borderTop: "1px solid rgba(43,30,23,0.08)" }}
          >
            <span
              className="text-[#E4572E]"
              style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              {product.price}
            </span>

            {/* Arrow indicator — slides in on hover */}
            <motion.span
              animate={
                hovered
                  ? { opacity: 1, x: 0,   y: 0  }
                  : { opacity: 0, x: -10, y: 10 }
              }
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex items-center gap-1.5"
              style={{ color: "#E4572E", fontSize: "0.75rem", fontWeight: 500 }}
              aria-hidden
            >
              <span>Подробнее</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2 7h10M9 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </div>
        </div>

        {/* Light-theme glare overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: glareBg }}
          aria-hidden
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Catalog Page ─────────────────────────────────────────────────────────────

export function CatalogPage() {
  const navigate = useNavigate();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("All Materials");
  const [sortBy, setSortBy]                     = useState<string>("Featured");
  const [searchQuery, setSearchQuery]           = useState("");
  const [showFilters, setShowFilters]           = useState(false);
  const [visibleCount, setVisibleCount]         = useState(9);

  // GSAP target refs
  const heroRef    = useRef<HTMLElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  // ── Framer Motion: hero parallax depth ──────────────────────────────────
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY   = useTransform(heroScroll, [0, 1], ["0%", "-20%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "8%"]);

  // ── Filter + sort logic ──────────────────────────────────────────────────
  const filtered = PRODUCTS.filter((p) => {
    const matchCat =
      selectedCategory === "All" ||
      (selectedCategory === "New Arrivals" && p.isNew) ||
      p.category === selectedCategory;
    const matchMat =
      selectedMaterial === "All Materials" || p.material === selectedMaterial;
    const matchSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchMat && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.priceValue - b.priceValue;
    if (sortBy === "Price: High to Low") return b.priceValue - a.priceValue;
    if (sortBy === "Newest First")       return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (sortBy === "Name: A–Z")          return a.title.localeCompare(b.title);
    return 0;
  });

  const displayed = sorted.slice(0, visibleCount);
  const hasMore   = visibleCount < sorted.length;

  // Reset pagination whenever filters change
  useEffect(() => {
    setVisibleCount(9);
  }, [selectedCategory, selectedMaterial, searchQuery, sortBy]);

  // ── GSAP: Staggered grid reveal with prefers-reduced-motion guard ────────
  const gridKey = `${selectedCategory}-${selectedMaterial}-${searchQuery}-${sortBy}`;

  useGSAP(
    () => {
      if (!gridRef.current) return;

      // Kill stale triggers from previous filter state
      ScrollTrigger.getAll()
        .filter((t) => t.vars.id === "catalog-grid")
        .forEach((t) => t.kill());

      const cards = gsap.utils.toArray<HTMLElement>(".catalog-card", gridRef.current);
      if (!cards.length) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        gsap.set(cards, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 32 });

      // Capped stagger: prevents last-card delay on large grids
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: { amount: Math.min(cards.length * 0.06, 0.54), ease: "expo.out" },
        ease: "power3.out",
        scrollTrigger: {
          id: "catalog-grid",
          trigger: gridRef.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: gridRef, dependencies: [gridKey, displayed.length] }
  );

  // ── GSAP: Hero image parallax with prefers-reduced-motion guard ──────────
  useGSAP(
    () => {
      if (!heroImgRef.current) return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      gsap.to(heroImgRef.current, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: heroRef }
  );

  function handleProductClick(product: Product) {
    if (product.link) navigate(product.link);
  }

  function resetFilters() {
    setSelectedCategory("All");
    setSelectedMaterial("All Materials");
    setSearchQuery("");
    setSortBy("Featured");
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FBF6EE]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ══════════════════════════════════════════════════════════════════
          HERO — Parallax depth + dot texture + SVG SMIL scroll indicator
      ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-36 pb-24 md:pt-48 md:pb-32"
        style={{ background: "#FBF6EE" }}
      >
        {/* Background parallax layer — dot texture, moves faster (deeper) */}
        <motion.div
          ref={heroImgRef}
          style={{ y: heroBgY }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(228,87,46,0.18) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.55,
            }}
          />
        </motion.div>

        {/* Foreground text — moves slower, creating depth illusion */}
        <motion.div
          style={{ y: heroTextY }}
          className="relative max-w-7xl mx-auto px-5"
        >
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto text-center"
          >
            <p
              className="tracking-[0.22em] uppercase text-[#E4572E] mb-4"
              style={{ fontSize: "0.67rem", fontWeight: 600, opacity: 0.7 }}
            >
              Ручная работа · Эко-стиль · Вне времени
            </p>

            <h1
              className="text-[#2B1E17] mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
              }}
            >
              Наша Коллекция
            </h1>

            <p
              className="text-[#7A6B5E] max-w-md mx-auto"
              style={{ fontSize: "0.97rem", lineHeight: 1.78 }}
            >
              Премиальная мебель, авторское освещение и органический декор — каждое изделие создано из ответственно добытых материалов без компромиссов в красоте.
            </p>

            {/* Scroll indicator — SVG SMIL only, no competing Framer animation */}
            <motion.div
              className="flex justify-center mt-10"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <svg width="20" height="28" viewBox="0 0 20 28" fill="none" aria-label="Листайте для изучения">
                <rect x="1" y="1" width="18" height="26" rx="9" stroke="rgba(228,87,46,0.45)" strokeWidth="1.5" />
                <rect x="8.5" y="6" width="3" height="6" rx="1.5" fill="rgba(228,87,46,0.45)">
                  <animate attributeName="y" values="6;13;6" dur="2s" repeatCount="indefinite" calcMode="ease-in-out"/>
                  <animate attributeName="opacity" values="1;0.25;1" dur="2s" repeatCount="indefinite" calcMode="ease-in-out"/>
                </rect>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CATALOG — filter bar + GSAP-staggered product grid
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5">

          {/* Filter & Sort toolbar */}
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-3 mb-7">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8F87]">
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Поиск по коллекции…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-[#FBF6EE] focus:outline-none transition-colors"
                  style={{
                    width: 230,
                    fontSize: "0.87rem",
                    border: "1.5px solid rgba(228,87,46,0.20)",
                    color: "#2B1E17",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#E4572E")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(228,87,46,0.20)")}
                />
              </div>

              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="px-4 py-2.5 bg-[#FBF6EE] focus:outline-none cursor-pointer text-[#2B1E17]"
                style={{ fontSize: "0.87rem", border: "1.5px solid rgba(228,87,46,0.20)" }}
              >
                {MATERIALS.map((m) => <option key={m}>{m}</option>)}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-[#FBF6EE] focus:outline-none cursor-pointer text-[#2B1E17]"
                style={{ fontSize: "0.87rem", border: "1.5px solid rgba(228,87,46,0.20)" }}
              >
                {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>

              <span className="ml-auto text-[#9A8F87]" style={{ fontSize: "0.84rem" }}>
                {filtered.length} item{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Mobile collapse */}
            <div className="md:hidden mb-5">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-4 py-3 border-none cursor-pointer text-[#2B1E17]"
                style={{ background: "#E8D8C3", fontSize: "0.9rem" }}
              >
                <span className="flex items-center gap-2">
                  <IconSliders />
                  Filters &amp; Sort
                </span>
                <IconChevron open={showFilters} />
              </button>

              {showFilters && (
                <div className="p-4 space-y-3 mt-px" style={{ background: "#E8D8C3" }}>
                  <input
                    type="text"
                    placeholder="Search…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FBF6EE] focus:outline-none text-[#2B1E17]"
                    style={{ fontSize: "0.87rem", border: "1.5px solid rgba(228,87,46,0.20)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#E4572E")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(228,87,46,0.20)")}
                  />
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FBF6EE] focus:outline-none cursor-pointer text-[#2B1E17]"
                    style={{ fontSize: "0.87rem", border: "1.5px solid rgba(43,30,23,0.12)" }}
                  >
                    {MATERIALS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FBF6EE] focus:outline-none cursor-pointer text-[#2B1E17]"
                    style={{ fontSize: "0.87rem", border: "1.5px solid rgba(43,30,23,0.12)" }}
                  >
                    {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-1.5 border-2 cursor-pointer select-none transition-all duration-200"
                  style={{
                    fontSize: "0.82rem",
                    letterSpacing: "0.025em",
                    fontWeight: selectedCategory === cat ? 600 : 400,
                    background:   selectedCategory === cat ? "#2B1E17" : "#FBF6EE",
                    color:        selectedCategory === cat ? "#FBF6EE" : "#7A6B5E",
                    borderColor:  selectedCategory === cat ? "#2B1E17" : "rgba(43,30,23,0.18)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Grid — GSAP ScrollTrigger stagger (capped at 0.54s) */}
          {displayed.length > 0 ? (
            <div
              key={gridKey}
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16"
            >
              {displayed.map((product) => (
                <div key={product.id} className="catalog-card">
                  <PremiumCard
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Empty state — organic illustration + friendly message */
            <motion.div
              variants={sectionVariant}
              initial="hidden"
              animate="visible"
              className="py-32 flex flex-col items-center text-center"
            >
              <div className="mb-6">
                <IllustrationEmpty />
              </div>
              <p
                className="text-[#2B1E17] mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}
              >
                Ещё ничего не найдено
              </p>
              <p className="text-[#9A8F87] mb-8" style={{ fontSize: "0.92rem", maxWidth: 280, lineHeight: 1.65 }}>
                Товары, соответствующие вашим фильтрам, не найдены. Попробуйте изменить параметры поиска.
              </p>
              <motion.button
                onClick={resetFilters}
                className="px-8 py-3 border-2 border-[#E4572E] text-[#E4572E] bg-transparent cursor-pointer"
                style={{ fontSize: "0.85rem", letterSpacing: "0.06em", fontWeight: 500 }}
                whileHover={{ y: -2, background: "#E4572E", color: "#FBF6EE" }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Сбросить фильтры
              </motion.button>
            </motion.div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="text-center">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0, scale: 0.98 }}
                onClick={() => setVisibleCount((v) => v + 6)}
                className="px-12 py-4 border-2 border-[#2B1E17] text-[#2B1E17] bg-transparent cursor-pointer transition-colors duration-200"
                style={{ fontSize: "0.88rem", letterSpacing: "0.07em" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#2B1E17";
                  e.currentTarget.style.color = "#FBF6EE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#2B1E17";
                }}
              >
                Показать еще
              </motion.button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURED COLLECTION — editorial layout (Moooi aesthetic)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ background: "#E8D8C3" }}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            <motion.div
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="overflow-hidden"
              style={{ boxShadow: "0 8px 48px rgba(43,30,23,0.12)" }}
            >
              <img
                src="https://placehold.co/900x640/E8D8C3/2B1E17.png?text=Live-edge+Walnut+Series"
                alt="Live-edge Walnut Collection"
                className="w-full h-[380px] lg:h-[500px] object-contain"
                style={{ background: "#E8D8C3" }}
              />
            </motion.div>

            <motion.div
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="tracking-[0.28em] uppercase text-[#E4572E] mb-3"
                style={{ fontSize: "0.65rem", fontWeight: 600 }}
              >
                Авторская коллекция
              </p>
              <h2
                className="text-[#2B1E17] mb-5"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.7rem, 3vw, 2.6rem)",
                  lineHeight: 1.16,
                  letterSpacing: "-0.015em",
                }}
              >
                Серия "Живой край" из Ореха
              </h2>
              <p className="text-[#7A6B5E] mb-4" style={{ fontSize: "0.96rem", lineHeight: 1.82 }}>
                Каждый слэб сохраняет природный контур дерева — нет двух одинаковых изделий. Покрытая матовым маслом, каждая доска — это частица леса в вашем доме.
              </p>
              <p className="text-[#7A6B5E] mb-9" style={{ fontSize: "0.96rem", lineHeight: 1.82 }}>
                Доступно в виде кофейных, обеденных и консольных столов. Индивидуальные размеры по запросу.
              </p>

              <motion.button
                onClick={() => navigate("/product/wooden-world-maps")}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#E4572E] text-white border-none cursor-pointer"
                style={{
                  fontSize: "0.88rem",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                  boxShadow: "0 0 20px rgba(228,87,46,0.35)",
                }}
                whileHover={{ y: -2, boxShadow: "0 0 34px rgba(228,87,46,0.60), 0 4px 16px rgba(0,0,0,0.15)" }}
                whileTap={{ y: 0, scale: 0.98 }}
              >
                <span>Смотреть коллекцию</span>
                <svg
                  width="14" height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M2 7h10M9 4l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          NEWSLETTER — warm ivory bg, Burnt Orange CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28" style={{ background: "#FBF6EE" }}>
        <div className="max-w-4xl mx-auto px-5 text-center">
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <p
              className="tracking-[0.22em] uppercase text-[#E4572E] mb-3"
              style={{ fontSize: "0.64rem", fontWeight: 600, opacity: 0.7 }}
            >
              Будьте в курсе
            </p>
            <h2
              className="text-[#2B1E17] mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.7rem, 3vw, 2.2rem)",
                lineHeight: 1.2,
              }}
            >
              Узнавайте о новинках первыми.
            </h2>
            <p
              className="text-[#7A6B5E] mb-9 max-w-md mx-auto"
              style={{ fontSize: "0.96rem", lineHeight: 1.78 }}
            >
              Лимитированные издания, репортажи из мастерской и ранний доступ к новым коллекциям — прямо на вашу почту.
            </p>

            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 bg-[#FBF6EE] focus:outline-none text-[#2B1E17]"
                style={{
                  fontSize: "0.9rem",
                  border: "1.5px solid rgba(228,87,46,0.25)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#E4572E")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(228,87,46,0.25)")}
              />
              <motion.button
                type="submit"
                className="px-8 py-3.5 bg-[#E4572E] text-white border-none cursor-pointer"
                style={{
                  fontSize: "0.88rem",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                  boxShadow: "0 0 20px rgba(228,87,46,0.35)",
                }}
                whileHover={{ y: -2, boxShadow: "0 0 34px rgba(228,87,46,0.60), 0 4px 16px rgba(0,0,0,0.15)" }}
                whileTap={{ y: 0, scale: 0.98 }}
              >
                Подписаться
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
