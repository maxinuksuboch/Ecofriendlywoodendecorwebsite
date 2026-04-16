/**
 * HeroSection.tsx — EcoFriendlyWoodenDecor
 *
 * Right-column animation stack (all effects run simultaneously, zero conflict):
 *  1. Reveal  — x: 150 → 0, duration 1.4s, ease [0.22, 1, 0.36, 1]
 *  2. Tilt    — useMotionValue → useTransform → useSpring(300/30), clamped ±5°
 *  3. Scale   — useSpring(300/30): 1 → 1.08 on enter, 1.08 → 1 on leave
 *  4. Sparks  — lightweight framer-motion particle field; setInterval gated by
 *               isHovered prop; in-flight particles finish their own animation
 */

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "motion/react";
import heroImage from "../../assets/hero-walnut-clock-organizer.png";

// ─────────────────────────────────────────────────────────────────────────────
// Spark Particle — micro-component
// ─────────────────────────────────────────────────────────────────────────────

interface ParticleData {
  id: number;
  x: number;       // left offset as % of container width
  size: number;    // circle diameter in px
  yTravel: number; // total upward travel in px
  duration: number;// animation duration in s
  drift: number;   // horizontal drift in px (adds organic feel)
}

function SparkParticles({ isHovered }: { isHovered: boolean }) {
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    // Condition: interval runs only while hovered
    if (!isHovered) return;

    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: 8 + Math.random() * 84,            // keep away from edges
          size: 3 + Math.random() * 6,           // 3–9 px
          yTravel: 80 + Math.random() * 90,      // 80–170 px up
          duration: 0.85 + Math.random() * 0.75, // 0.85–1.6 s
          drift: (Math.random() - 0.5) * 30,     // ±15 px horizontal drift
        },
      ]);
    }, 130);

    // Cleanup: stop spawning immediately on leave
    return () => clearInterval(interval);
  }, [isHovered]);

  // Remove a particle only after its own animation completes — so in-flight
  // sparks never snap off when the user lifts the cursor.
  const removeParticle = (id: number) =>
    setParticles(prev => prev.filter(p => p.id !== id));

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 20 }}
      aria-hidden
    >
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.9, y: 0, x: 0, scale: 1 }}
          animate={{ opacity: 0, y: -p.yTravel, x: p.drift, scale: 0.1 }}
          transition={{ duration: p.duration, ease: "easeOut" }}
          onAnimationComplete={() => removeParticle(p.id)}
          style={{
            position: "absolute",
            bottom: "6%",
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: "#E4572E",
            boxShadow: `0 0 ${p.size * 2.5}px rgba(228,87,46,0.75)`,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Glassmorphism style helper (matches HomePage palette)
// ─────────────────────────────────────────────────────────────────────────────

const glass = {
  background: "rgba(251,246,238,0.06)",
  border: "1px solid rgba(232,216,195,0.18)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
} as React.CSSProperties;

const ctaShadow      = "0 0 20px rgba(228,87,46,0.40)";
const ctaShadowHover = "0 0 34px rgba(228,87,46,0.70), 0 4px 16px rgba(0,0,0,0.30)";

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────────────────────────────────────

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // ── Motion values: normalized cursor position in –0.5 … +0.5 ──────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // ── Tilt: useTransform clamps rotation to strict ±5° per spec ─────────────
  const rawRotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const rawRotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);

  // ── Spring physics (stiffness 300, damping 30 per spec) ───────────────────
  const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 30 });
  const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 30 });

  // ── Scale: also spring-smoothed so it eases naturally ─────────────────────
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  // ── Event handlers ─────────────────────────────────────────────────────────

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = containerRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  }

  function handleMouseEnter() {
    setIsHovered(true);
    scale.set(1.08); // scale effect
  }

  function handleMouseLeave() {
    setIsHovered(false); // particles stop spawning; in-flight ones finish
    mouseX.set(0);       // tilt springs back to neutral
    mouseY.set(0);
    scale.set(1);        // scale returns to 1
  }

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "#2B1E17" }}
    >
      {/* ── Ambient grain texture ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          opacity: 0.4,
        }}
        aria-hidden
      />

      {/* ── Warm radial bloom behind the image ───────────────────────────── */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(ellipse at center, rgba(228,87,46,0.10) 0%, transparent 68%)",
        }}
        aria-hidden
      />

      {/* ── Main content grid ─────────────────────────────────────────────── */}
      <div className="relative w-full max-w-7xl mx-auto px-6 py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen">

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              LEFT — text column
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ fontSize: "0.67rem", letterSpacing: "0.22em", fontWeight: 600 }}
              className="uppercase text-[#E4572E] mb-5"
            >
              Ручная работа · Экологичность · Сделано в Беларуси
            </motion.p>

            {/* Heading */}
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
              }}
            >
              Натуральный декор<br />
              <span style={{ color: "#E4572E" }}>и аксессуары из дерева</span>
            </h1>

            {/* Description */}
            <p
              className="text-white/65 mb-8 max-w-md"
              style={{ fontSize: "1.02rem", lineHeight: 1.8 }}
            >
              Премиальный декор для дома и офиса — изделия из дуба, ясеня и березы от ответственных производителей. Каждая деталь создана с любовью и обработана вручную.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                "Эко-материалы",
                "Точность ЧПУ",
                "Безопасная отделка",
              ].map(feat => (
                <span
                  key={feat}
                  className="flex items-center gap-1.5 text-white/70 px-3.5 py-1.5"
                  style={{
                    ...glass,
                    fontSize: "0.76rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#E4572E" }}
                  />
                  {feat}
                </span>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-4 flex-wrap">
              <motion.button
                className="bg-[#E4572E] text-white cursor-pointer border-none px-8 py-4"
                style={{
                  fontSize: "0.9rem",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                  boxShadow: ctaShadow,
                }}
                whileHover={{ y: -2, boxShadow: ctaShadowHover }}
                whileTap={{ y: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                В каталог
              </motion.button>

              <motion.button
                className="cursor-pointer border-none px-8 py-4 text-white"
                style={{
                  ...glass,
                  fontSize: "0.9rem",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                }}
                whileHover={{ y: -2, background: "rgba(251,246,238,0.12)" }}
                whileTap={{ y: 0, scale: 0.97 }}
              >
                Наша история
              </motion.button>
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex items-center gap-3 mt-10"
            >
              <div className="flex -space-x-2">
                {["#8B6F52", "#A0845C", "#7A5C3E"].map((color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2"
                    style={{ backgroundColor: color, borderColor: "#2B1E17" }}
                  />
                ))}
              </div>
              <p className="text-white/45" style={{ fontSize: "0.82rem" }}>
                <span className="text-white/75 font-medium">247 заказов</span> оформлено в этом месяце
              </p>
            </motion.div>
          </motion.div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              RIGHT — animated image column
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="flex items-center justify-center lg:justify-end">

            {/* 1. REVEAL ANIMATION — slides in from x:60 on mount */}
            <motion.div
              initial={{ x: 60, opacity: 0, scale: 0.96 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{
                x:       { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 1.4, ease: "easeOut" },
                scale:   { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
              }}
              className="relative w-full max-w-[780px]"
            >
              {/* 2 & 3. TILT + SCALE — same motion.div, no conflict */}
              <motion.div
                ref={containerRef}
                style={{
                  rotateX,
                  rotateY,
                  scale,
                  transformPerspective: 1200,
                  transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative cursor-pointer"
              >
                {/* Product image */}
                <img
                  src={heroImage}
                  alt="Органайзер из ореха с часами — премиальный настольный аксессуар из дерева"
                  className="w-full h-auto block select-none"
                  style={{ display: "block" }}
                  draggable={false}
                />

                {/* Bottom shadow depth layer */}
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: "40%",
                    background:
                      "linear-gradient(to top, rgba(43,30,23,0.55), transparent)",
                  }}
                  aria-hidden
                />

                {/* Floating info badge — bottom left */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.6 }}
                  className="absolute bottom-5 left-5 px-4 py-3"
                  style={glass}
                >
                  <p
                    className="text-[#E4572E] mb-0.5"
                    style={{ fontSize: "0.58rem", letterSpacing: "0.18em", fontWeight: 700 }}
                  >
                    МАТЕРИАЛ
                  </p>
                  <p
                    className="text-white"
                    style={{ fontSize: "0.82rem", fontWeight: 500 }}
                  >
                    Массив ореха
                  </p>
                </motion.div>

                {/* Rating badge — top right */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.8 }}
                  className="absolute top-5 right-5 px-4 py-2.5 flex items-center gap-2"
                  style={glass}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="#E4572E" aria-hidden>
                    <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L7 1z"/>
                  </svg>
                  <span className="text-white" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                    4.9
                  </span>
                </motion.div>

                {/* 4. SPARK PARTICLES — isHovered prop controls spawn interval */}
                <SparkParticles isHovered={isHovered} />
              </motion.div>

              {/* Cast shadow below the card (outside tilt, so it stays flat) */}
              <motion.div
                animate={{
                  opacity: isHovered ? 0.7 : 0.35,
                  scaleX: isHovered ? 0.9 : 0.75,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                  bottom: -24,
                  width: "80%",
                  height: 40,
                  background:
                    "radial-gradient(ellipse at center, rgba(228,87,46,0.35), transparent 70%)",
                  filter: "blur(12px)",
                }}
                aria-hidden
              />
            </motion.div>
          </div>
          {/* ─── end right column ─────────────────────────────────────────── */}

        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────────────── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none" aria-label="Листайте для изучения">
          <rect x="1" y="1" width="18" height="26" rx="9" stroke="rgba(228,87,46,0.50)" strokeWidth="1.5"/>
          <rect x="8.5" y="6" width="3" height="6" rx="1.5" fill="rgba(228,87,46,0.50)">
            <animate attributeName="y" values="6;13;6" dur="2s" repeatCount="indefinite" calcMode="ease-in-out"/>
            <animate attributeName="opacity" values="1;0.25;1" dur="2s" repeatCount="indefinite" calcMode="ease-in-out"/>
          </rect>
        </svg>
      </div>
    </section>
  );
}
