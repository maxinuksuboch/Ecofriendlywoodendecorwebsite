import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";

// ─── Pure SVG icons ───────────────────────────────────────────────────────────
const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="5" y1="5"  x2="19" y2="19" />
    <line x1="19" y1="5" x2="5"  y2="19" />
  </svg>
);

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconTelegram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Каталог",       href: "/catalog",  isRoute: true  },
  { label: "Решения",       href: "#bundles",  isRoute: false },
  { label: "О нас",         href: "#about",    isRoute: false },
  { label: "Спецзаказы",    href: "#custom",   isRoute: false },
  { label: "Вопросы",       href: "#faq",      isRoute: false },
];

const ctaShadow      = "0 0 20px rgba(228,87,46,0.40)";
const ctaShadowHover = "0 0 34px rgba(228,87,46,0.70), 0 4px 16px rgba(0,0,0,0.30)";

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled]         = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ctaHovered, setCtaHovered]     = useState(false);
  const [mCtaHovered, setMCtaHovered]   = useState(false);
  const isHeaderActive = scrolled || location.pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string, isRoute = false) => {
    setMobileMenuOpen(false);
    if (isRoute) { navigate(href); return; }
    if (location.pathname !== "/") { navigate("/" + href); return; }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isHeaderActive
            ? "py-3"
            : "bg-transparent py-5"
        }`}
        style={
          isHeaderActive
            ? {
                background: "rgba(43,30,23,0.94)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.06)",
              }
            : undefined
        }
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={goHome}
            className="tracking-[0.2em] uppercase bg-transparent border-none cursor-pointer text-white"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isHeaderActive ? "1.1rem" : "1.3rem",
              transition: "font-size 0.4s ease",
            }}
          >
            Woodcraft
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href, link.isRoute)}
                className="relative text-white/80 tracking-wide cursor-pointer bg-transparent border-none group transition-colors duration-200 hover:text-white"
                style={{ fontSize: "0.85rem" }}
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#E4572E] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <button
              onClick={() => scrollTo("#order-form")}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              className="px-6 py-2 bg-[#E4572E] text-white cursor-pointer border-none transition-all duration-300 font-medium"
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                borderRadius: "2px",
                boxShadow: ctaHovered ? ctaShadowHover : ctaShadow,
                transform: ctaHovered ? "translateY(-1px)" : "none",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              }}
            >
              Оформить заявку
            </button>
          </nav>

          {/* Hamburger */}
          <button
            className="md:hidden bg-transparent border-none cursor-pointer text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            style={{
              background: "rgba(43,30,23,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href, link.isRoute)}
                  className="text-left text-white/80 bg-transparent border-none cursor-pointer py-2 hover:text-white transition-colors duration-200"
                  style={{ fontSize: "1rem" }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo("#order-form")}
                onMouseEnter={() => setMCtaHovered(true)}
                onMouseLeave={() => setMCtaHovered(false)}
                className="w-full px-6 py-3 bg-[#E4572E] text-white cursor-pointer border-none font-medium mt-2 transition-all duration-300"
                style={{
                  fontSize: "0.95rem",
                  letterSpacing: "0.05em",
                  borderRadius: "2px",
                  boxShadow: mCtaHovered ? ctaShadowHover : ctaShadow,
                }}
              >
                Оформить заявку
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content (with route transitions) ──────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="pt-16 pb-8"
        style={{
          backgroundColor: "#2B1E17",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div>
              <div
                className="tracking-[0.2em] uppercase text-white mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}
              >
                Woodcraft
              </div>
              <p className="text-white/50" style={{ fontSize: "0.85rem", lineHeight: 1.65 }}>
                Современный декор из дерева и аксессуары для рабочего места. Дизайн и производство в Беларуси с использованием натуральных материалов и вниманием к каждой детали.
              </p>
            </div>

            {/* Catalog */}
            <div>
              <h4
                className="text-white mb-4"
                style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Каталог
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/catalog")}
                  className="block text-left text-white/50 no-underline bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-[#E4572E] p-0"
                  style={{ fontSize: "0.85rem" }}
                >
                  Все товары
                </button>
                {["Мебель", "Освещение", "Декор", "Хранение", "Спецзаказы"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="group relative block text-white/50 no-underline transition-colors duration-200 hover:text-[#E4572E]"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {item}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#E4572E] transition-all duration-300 group-hover:w-full" />
                  </a>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <h4
                className="text-white mb-4"
                style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Информация
              </h4>
              <div className="space-y-2">
                {[
                  "О компании",
                  "Доставка и оплата",
                  "Инструкции по уходу",
                  "Корпоративные подарки",
                  "Вопросы и ответы",
                ].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="group relative block text-white/50 no-underline transition-colors duration-200 hover:text-[#E4572E]"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {item}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#E4572E] transition-all duration-300 group-hover:w-full" />
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4
                className="text-white mb-4"
                style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Контакты
              </h4>
              <div className="space-y-2 text-white/50" style={{ fontSize: "0.85rem" }}>
                <p>hello@woodcraft.by</p>
                <p>+375 29 123 45 67</p>
                <p>Минск, Беларусь</p>
              </div>
              <div className="flex gap-4 mt-4">
                {[IconInstagram, IconFacebook, IconTelegram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-white/40 transition-colors duration-200 hover:text-[#E4572E]"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/30" style={{ fontSize: "0.78rem" }}>
              © 2026 Woodcraft. Все права защищены.
            </p>
            <div className="flex gap-6">
              {[
                "Политика конфиденциальности",
                "Условия обслуживания",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-white/30 no-underline transition-colors duration-200 hover:text-white/60"
                  style={{ fontSize: "0.78rem" }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
