import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Menu, X, Instagram, Facebook, Send } from "lucide-react";

const NAV_LINKS = [
  { label: "Catalog", href: "/catalog", isRoute: true },
  { label: "Solutions", href: "#bundles", isRoute: false },
  { label: "About", href: "#about", isRoute: false },
  { label: "Custom Orders", href: "#custom", isRoute: false },
  { label: "FAQ", href: "#faq", isRoute: false },
];

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string, isRoute: boolean = false) => {
    setMobileMenuOpen(false);

    // If it's a route (not an anchor), navigate directly
    if (isRoute) {
      navigate(href);
      return;
    }

    // If we're not on the home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/" + href);
      return;
    }

    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          <button
            onClick={goHome}
            className="tracking-[0.2em] uppercase bg-transparent border-none cursor-pointer"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: scrolled ? "1.1rem" : "1.3rem",
              transition: "font-size 0.4s ease",
              color: "#1F2A44",
            }}
          >
            Woodcraft
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href, link.isRoute)}
                className="relative text-[#1F2A44] tracking-wide cursor-pointer bg-transparent border-none group"
                style={{ fontSize: "0.85rem" }}
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#2F5BFF] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <button
              onClick={() => scrollTo("#order-form")}
              className="px-6 py-2 bg-[#FF7A00] text-white cursor-pointer border-none transition-all duration-300 hover:bg-[#E66D00]"
              style={{ fontSize: "0.85rem", letterSpacing: "0.05em" }}
            >
              Оформить заявку
            </button>
          </nav>
          <button
            className="md:hidden bg-transparent border-none cursor-pointer text-[#1F2A44]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[rgba(0,0,0,0.06)]">
            <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href, link.isRoute)}
                  className="text-left text-[#1F2A44] bg-transparent border-none cursor-pointer py-2"
                  style={{ fontSize: "1rem" }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo("#order-form")}
                className="w-full px-6 py-3 bg-[#FF7A00] text-white cursor-pointer border-none transition-all duration-300 hover:bg-[#E66D00] mt-2"
                style={{ fontSize: "0.95rem", letterSpacing: "0.05em" }}
              >
                Оформить заявку
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <Outlet />

      {/* Footer */}
      <footer className="bg-[#1F2A44] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div
                className="tracking-[0.2em] uppercase text-white mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}
              >
                Woodcraft
              </div>
              <p className="text-white/50" style={{ fontSize: "0.85rem", lineHeight: 1.65 }}>
                Modern wooden decor and workspace accessories. Designed and made in Belarus with
                natural materials and thoughtful precision.
              </p>
            </div>
            <div>
              <h4
                className="text-white mb-4"
                style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Catalog
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/catalog")}
                  className="block text-left text-white/50 no-underline bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-[#FF7A00] p-0"
                  style={{ fontSize: "0.85rem" }}
                >
                  All Products
                </button>
                {["World Maps", "Desk Accessories", "Organizers", "Gift Sets", "Custom Orders"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="block text-white/50 no-underline transition-colors duration-200 hover:text-[#FF7A00]"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
            </div>
            <div>
              <h4
                className="text-white mb-4"
                style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Info
              </h4>
              <div className="space-y-2">
                {["About Us", "Delivery & Shipping", "Care Instructions", "Corporate Gifts", "FAQ"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="block text-white/50 no-underline transition-colors duration-200 hover:text-[#FF7A00]"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
            </div>
            <div>
              <h4
                className="text-white mb-4"
                style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Contact
              </h4>
              <div className="space-y-2 text-white/50" style={{ fontSize: "0.85rem" }}>
                <p>hello@woodcraft.by</p>
                <p>+375 29 123 45 67</p>
                <p>Minsk, Belarus</p>
              </div>
              <div className="flex gap-4 mt-4">
                {[Instagram, Facebook, Send].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-white/40 transition-colors duration-200 hover:text-[#FF5A4F]"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/30" style={{ fontSize: "0.78rem" }}>
              © 2026 Woodcraft. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service"].map((item) => (
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
