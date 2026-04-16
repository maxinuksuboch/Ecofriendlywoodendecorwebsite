import { useState } from "react";
import { useNavigate } from "react-router";

// ─── Pure SVG icons ───────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconStar = ({ filled }: { filled: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    fill={filled ? "#E4572E" : "none"} stroke={filled ? "#E4572E" : "rgba(255,255,255,0.25)"}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconTruck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconPalette = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);
// ─────────────────────────────────────────────────────────────────────────────

const glass = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.14)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
} as const;

const ctaShadow      = "0 0 20px rgba(228,87,46,0.40)";
const ctaShadowHover = "0 0 34px rgba(228,87,46,0.70), 0 4px 16px rgba(0,0,0,0.30)";

const PRODUCT = {
  title: "Live-edge Walnut Coffee Table",
  subtitle: "Natural edge slab on steel hairpins",
  price: "$1,240",
  priceFrom: "From $1,240",
  rating: 4.9,
  reviews: 127,
  description:
    "Each table is unique. The walnut slab retains its original forest edge, sealed in matte oil finish to reveal the grain beneath — a quiet landscape for your living room.",
  longDescription:
    "Hand-selected from sustainable Carpathian walnut forests, each slab is kiln-dried for 8 weeks before reaching our workshop. The live edge is cleaned and stabilised, never straightened — we celebrate what the tree grew into. Steel hairpin legs are powder-coated in matte black.",
  images: [
    "https://images.unsplash.com/photo-1606933988322-a3cb8968e5ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB3b3JsZCUyMG1hcCUyMHdhbGwlMjBkZWNvciUyMGludGVyaW9yfGVufDF8fHx8MTc3NTU2Mzg2OXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1653242370332-e332a8103763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwd2FsbCUyMGRlY29yJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU1NjM4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1761799839491-d1c18630e8d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYWslMjB3b29kJTIwdGV4dHVyZSUyMGNsb3NlJTIwdXAlMjBncmFpbnxlbnwxfHx8fDE3NzU1NjM4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  features: [
    "Sustainably sourced Carpathian walnut",
    "Live-edge slab — each piece unique",
    "Matte oil finish, food-safe & water-resistant",
    "Powder-coated steel hairpin legs",
    "Pre-assembled, ready to place",
    "Handcrafted in our Minsk workshop",
  ],
  specifications: [
    { label: "Dimensions",       value: "120 × 60 × 45 cm" },
    { label: "Slab thickness",   value: "40 mm" },
    { label: "Weight",           value: "18 kg" },
    { label: "Materials",        value: "Walnut, powder-coat steel" },
    { label: "Finish",           value: "Matte Rubio Monocoat" },
    { label: "Production time",  value: "10–14 business days" },
  ],
  options: [
    { name: "Walnut Natural — 120 cm", price: "$1,240" },
    { name: "Walnut Dark — 120 cm",    price: "$1,280" },
    { name: "Walnut Natural — 150 cm", price: "$1,490" },
    { name: "Custom dimensions",       price: "From $1,600" },
  ],
};

export function ProductDetailPage() {
  const navigate = useNavigate();
  const [selectedImage,  setSelectedImage]  = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [ctaHovered,     setCtaHovered]     = useState(false);

  const nextImage = () => setSelectedImage((p) => (p + 1) % PRODUCT.images.length);
  const prevImage = () => setSelectedImage((p) => (p - 1 + PRODUCT.images.length) % PRODUCT.images.length);

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "linear-gradient(160deg, #2B1E17 0%, #3D2318 40%, #1C1310 100%)",
      }}
    >
      {/* Back Navigation */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)", paddingTop: "80px" }}
      >
        <div className="max-w-7xl mx-auto px-5 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer transition-colors text-white/60 hover:text-white"
            style={{ fontSize: "0.9rem" }}
          >
            <IconArrowLeft />
            Назад на главную
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-5 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* ── Image Gallery ─────────────────────────────────────────────── */}
          <div>
            <div
              className="relative aspect-[4/3] mb-4 overflow-hidden"
              style={{ ...glass, borderRadius: "4px" }}
            >
              <img
                src={PRODUCT.images[selectedImage]}
                alt={`${PRODUCT.title} — view ${selectedImage + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/800x600/2C3E50/4CA1AF.png?text=Woodcraft";
                }}
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border-none cursor-pointer text-white/70 hover:text-white transition-colors"
                style={{ ...glass, borderRadius: "2px" }}
                aria-label="Previous image"
              >
                <IconChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border-none cursor-pointer text-white/70 hover:text-white transition-colors"
                style={{ ...glass, borderRadius: "2px" }}
                aria-label="Next image"
              >
                <IconChevronRight />
              </button>
              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {PRODUCT.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="border-none cursor-pointer p-0 transition-all duration-300"
                    style={{
                      width: i === selectedImage ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === selectedImage ? "#E4572E" : "rgba(255,255,255,0.35)",
                    }}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {PRODUCT.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="aspect-square overflow-hidden cursor-pointer transition-all border-2"
                  style={{
                    borderColor: selectedImage === i ? "#E4572E" : "transparent",
                    borderRadius: "3px",
                    outline: "none",
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/200x200/2C3E50/4CA1AF.png?text=" + (i + 1);
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ───────────────────────────────────────────────── */}
          <div>
            {/* Title block */}
            <div className="mb-6">
              <p
                className="tracking-[0.25em] uppercase text-[#E4572E] mb-2"
                style={{ fontSize: "0.72rem" }}
              >
                Эко-декор — Мебель
              </p>
              <h1
                className="text-white mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  lineHeight: 1.2,
                }}
              >
                {PRODUCT.title}
              </h1>
              <p className="text-white/60" style={{ fontSize: "1rem" }}>
                {PRODUCT.subtitle}
              </p>
            </div>

            {/* Rating */}
            <div
              className="flex items-center gap-3 mb-6 pb-6"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} filled={i < Math.floor(PRODUCT.rating)} />
                ))}
              </div>
              <span className="text-white/50" style={{ fontSize: "0.88rem" }}>
                {PRODUCT.rating} ({PRODUCT.reviews} отзывов)
              </span>
            </div>

            {/* Price + description */}
            <div className="mb-8">
              <p
                className="text-[#E4572E] mb-4"
                style={{ fontSize: "2rem", fontWeight: 500, letterSpacing: "0.02em" }}
              >
                {PRODUCT.priceFrom}
              </p>
              <p className="text-white/80 mb-4" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
                {PRODUCT.description}
              </p>
              <p className="text-white/50" style={{ fontSize: "0.88rem", lineHeight: 1.7 }}>
                {PRODUCT.longDescription}
              </p>
            </div>

            {/* Finish Options */}
            <div className="mb-8">
              <label
                className="block text-white/70 mb-3"
                style={{ fontSize: "0.88rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
              >
                Выберите отделку
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PRODUCT.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(i)}
                    className="p-4 cursor-pointer text-left transition-all"
                    style={{
                      ...glass,
                      borderRadius: "3px",
                      border: selectedOption === i
                        ? "1px solid rgba(228,87,46,0.7)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: selectedOption === i
                        ? "rgba(228,87,46,0.12)"
                        : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white/85" style={{ fontSize: "0.88rem" }}>
                        {option.name}
                      </span>
                      <span className="text-[#E4572E]" style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                        {option.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => navigate("/#order-form")}
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
                className="flex-1 px-8 py-4 bg-[#E4572E] text-white border-none cursor-pointer font-semibold transition-all"
                style={{
                  fontSize: "0.95rem",
                  letterSpacing: "0.06em",
                  borderRadius: "2px",
                  boxShadow: ctaHovered ? ctaShadowHover : ctaShadow,
                  transform: ctaHovered ? "translateY(-1px)" : "none",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                }}
              >
                Оформить заявку
              </button>
              <button
                className="px-8 py-4 cursor-pointer border-none text-white/70 hover:text-white transition-colors"
                style={{
                  fontSize: "0.95rem",
                  letterSpacing: "0.05em",
                  borderRadius: "2px",
                  ...glass,
                }}
              >
                В избранное
              </button>
            </div>

            {/* Trust Badges */}
            <div
              className="grid grid-cols-3 gap-4 py-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
            >
              {[
                { Icon: IconTruck,   label: "Бесплатная доставка" },
                { Icon: IconShield,  label: "Гарантия качества" },
                { Icon: IconPalette, label: "Своя отделка" },
              ].map(({ Icon, label }) => (
                <div key={label} className="text-center">
                  <div className="flex justify-center mb-2 text-[#E4572E]">
                    <Icon />
                  </div>
                  <p className="text-white/50" style={{ fontSize: "0.72rem" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Features & Specifications ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
          {/* Features */}
          <div style={{ ...glass, borderRadius: "6px", padding: "2.5rem" }}>
            <h3
              className="text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}
            >
              Особенности изделия
            </h3>
            <div className="space-y-4">
              {PRODUCT.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#E4572E] flex-shrink-0 mt-0.5">
                    <IconCheck />
                  </span>
                  <span className="text-white/70" style={{ fontSize: "0.93rem" }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div style={{ ...glass, borderRadius: "6px", padding: "2.5rem" }}>
            <h3
              className="text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}
            >
              Характеристики
            </h3>
            <div className="space-y-1">
              {PRODUCT.specifications.map((spec, i) => (
                <div
                  key={i}
                  className="flex justify-between py-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span className="text-white/50" style={{ fontSize: "0.88rem" }}>
                    {spec.label}
                  </span>
                  <span className="text-white/85" style={{ fontSize: "0.88rem" }}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
