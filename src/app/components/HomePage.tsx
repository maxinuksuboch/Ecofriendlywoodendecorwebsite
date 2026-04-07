import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FadeUp } from "./FadeUp";
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Leaf,
  Ruler,
  MapPin,
  ShieldCheck,
  Palette,
  Heart,
  Star,
} from "lucide-react";

// Images
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1764755932155-dabbee87df7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwb2ZmaWNlJTIwZGVzayUyMHNldHVwJTIwY2xlYW58ZW58MXx8fHwxNzc1NTYzODcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  workspace: "https://images.unsplash.com/photo-1771150251872-95826aa516ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkZXNrJTIwYWNjZXNzb3JpZXMlMjB3b3Jrc3BhY2UlMjBzZXR1cCUyMG1pbmltYWx8ZW58MXx8fHwxNzc1NTYzODY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  wallDecor: "https://images.unsplash.com/photo-1606933988322-a3cb8968e5ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB3b3JsZCUyMG1hcCUyMHdhbGwlMjBkZWNvciUyMGludGVyaW9yfGVufDF8fHx8MTc3NTU2Mzg2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  gifts: "https://images.unsplash.com/photo-1759563874665-ffa9dfbd0205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBnaWZ0JTIwYm94JTIwc2V0JTIwcHJlbWl1bSUyMHBhY2thZ2luZ3xlbnwxfHx8fDE3NzU1NjM4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  organization: "https://images.unsplash.com/photo-1764161852303-8683d296f0cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb3JnYW5pemF0aW9uJTIwd29vZGVuJTIwc2hlbHZlcyUyMG1pbmltYWx8ZW58MXx8fHwxNzc1NTYzODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  woodTexture: "https://images.unsplash.com/photo-1761799839491-d1c18630e8d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYWslMjB3b29kJTIwdGV4dHVyZSUyMGNsb3NlJTIwdXAlMjBncmFpbnxlbnwxfHx8fDE3NzU1NjM4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  phoneStand: "https://images.unsplash.com/photo-1679110450190-f196308c303c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBwaG9uZSUyMHN0YW5kJTIwZGVzayUyMG9yZ2FuaXplcnxlbnwxfHx8fDE3NzU1NjM4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  monitorStand: "https://images.unsplash.com/photo-1764557238996-c1df265dddb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlJTIwbW9uaXRvciUyMHN0YW5kJTIwd29vZGVufGVufDF8fHx8MTc3NTU2Mzg3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  workshop: "https://images.unsplash.com/photo-1771668343211-0f976f6f32ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjcmFmdCUyMHdvcmtzaG9wJTIwcHJvZHVjdGlvbiUyMGFydGlzYW58ZW58MXx8fHwxNzc1NTYzODcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  engraving: "https://images.unsplash.com/photo-1582269847642-87432658c952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXNlciUyMGVuZ3JhdmluZyUyMHdvb2QlMjBjdXN0b20lMjBwZXJzb25hbGl6ZWR8ZW58MXx8fHwxNzc1NTYzODczfDA&ixlib=rb-4.1.0&q=80&w=1080",
  livingRoom: "https://images.unsplash.com/photo-1653242370332-e332a8103763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwd2FsbCUyMGRlY29yJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU1NjM4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  deskShelf: "https://images.unsplash.com/photo-1662018113001-0feffe4dd5d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkZXNrJTIwc2hlbGYlMjBtb25pdG9yJTIwcmlzZXIlMjBjbGVhbnxlbnwxfHx8fDE3NzU1NjM4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
};

export function HomePage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    orderType: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", contact: "", orderType: "", message: "" });
    }, 3000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={IMAGES.hero}
            alt="Modern workspace with wooden accessories"
            className="w-full h-full object-cover"
            style={{ transform: "scale(1.05)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 py-32 md:py-0 w-full">
          <div className="max-w-xl">
            <FadeUp>
              <p
                className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-4"
                style={{ fontSize: "0.75rem" }}
              >
                Natural materials · Modern design · Made in Belarus
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1
                className="mb-6 text-[#1F2A44]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                  lineHeight: 1.15,
                  fontWeight: 500,
                }}
              >
                Beautifully organize
                <br />
                your space with
                <br />
                <span className="text-[#2F5BFF]">natural wood</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-[#7A7A7A] mb-8 max-w-md" style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
                Designer wooden decor and workspace accessories. Oak, ash, and birch — shaped with
                industrial precision into products that bring warmth, order, and style to your
                everyday.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/catalog")}
                  className="px-8 py-3.5 bg-[#FF7A00] text-white cursor-pointer border-none transition-all duration-300 hover:bg-[#E66D00] hover:-translate-y-0.5"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
                >
                  View Catalog
                </button>
                <button
                  onClick={() => scrollTo("#custom")}
                  className="px-8 py-3.5 bg-transparent text-[#2F5BFF] cursor-pointer border-2 border-[#2F5BFF] transition-all duration-300 hover:bg-[#2F5BFF] hover:text-white hover:-translate-y-0.5"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
                >
                  Request Custom Order
                </button>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-3" style={{ fontSize: "0.75rem" }}>
                Shop by scenario
              </p>
              <h2
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                Find your perfect setup
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "For Workspace", subtitle: "Desk accessories that inspire focus", img: IMAGES.workspace },
              { title: "For Wall Decor", subtitle: "Statement pieces for any room", img: IMAGES.wallDecor },
              { title: "For Gifts", subtitle: "Thoughtful presents they'll love", img: IMAGES.gifts },
              { title: "For Home", subtitle: "Organize with natural elegance", img: IMAGES.organization },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1}>
                <div className="group cursor-pointer relative overflow-hidden aspect-[3/4]">
                  <ImageWithFallback
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white mb-1" style={{ fontSize: "1.2rem" }}>
                      {item.title}
                    </h3>
                    <p className="text-white/70" style={{ fontSize: "0.85rem" }}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories / Catalog */}
      <section id="catalog" className="py-24 md:py-32 bg-[#FFF8F1]">
        <div className="max-w-7xl mx-auto px-5">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-3" style={{ fontSize: "0.75rem" }}>
                Our collections
              </p>
              <h2
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                Featured categories
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Wooden World Maps",
                desc: "Multi-layered wall maps in oak, walnut, and custom finishes. A statement piece for any interior.",
                img: IMAGES.wallDecor,
                price: "From $120",
                link: "/product/wooden-world-maps",
              },
              {
                title: "Desk Shelf & Workspace Setup",
                desc: "Monitor stands, desk shelves, and organizers that elevate your desk to a new level of calm productivity.",
                img: IMAGES.deskShelf,
                price: "From $45",
                link: null,
              },
              {
                title: "Organizers & Phone Stands",
                desc: "Cable organizers, valet trays, phone docks — small details that make a big difference.",
                img: IMAGES.phoneStand,
                price: "From $25",
                link: null,
              },
              {
                title: "Gift Sets & Engraving",
                desc: "Curated gift boxes with custom engraving. Perfect for birthdays, housewarmings, and corporate gifting.",
                img: IMAGES.gifts,
                price: "From $55",
                link: null,
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1}>
                <div
                  onClick={() => item.link && navigate(item.link)}
                  className="group cursor-pointer bg-white overflow-hidden flex flex-col sm:flex-row transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="sm:w-1/2 overflow-hidden">
                    <ImageWithFallback
                      src={item.img}
                      alt={item.title}
                      className="w-full h-56 sm:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                    <h3 className="mb-2 text-[#2D2D2D]" style={{ fontSize: "1.15rem" }}>
                      {item.title}
                    </h3>
                    <p className="text-[#7A7A7A] mb-4" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#FF7A00]" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                        {item.price}
                      </span>
                      <span className="flex items-center gap-1 text-[#1F2A44] transition-all duration-300 group-hover:gap-2 group-hover:text-[#2F5BFF]" style={{ fontSize: "0.85rem" }}>
                        {item.link ? "View Details" : "Explore"} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-3" style={{ fontSize: "0.75rem" }}>
                Why Woodcraft
              </p>
              <h2
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                Crafted with intention
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Leaf, title: "Natural Materials", desc: "Oak, ash, birch — sustainably sourced and carefully selected for every product." },
              { icon: Ruler, title: "Industrial Precision", desc: "CNC routing, laser cutting, and hand-finishing for flawless results every time." },
              { icon: MapPin, title: "Local Production", desc: "Designed and manufactured in Belarus, supporting local craftsmanship." },
              { icon: ShieldCheck, title: "Safe Finishes", desc: "Water-based oils and eco-friendly coatings. Safe for your home and the planet." },
              { icon: Palette, title: "Clean Design Language", desc: "Minimalist aesthetics that fit naturally into any modern interior." },
              { icon: Heart, title: "Aesthetics Meets Function", desc: "Every product solves a real problem while adding beauty to your space." },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.08}>
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EEF4FF] mb-4">
                    <item.icon size={20} className="text-[#2F5BFF]" />
                  </div>
                  <h4 className="mb-2 text-[#1F2A44]" style={{ fontSize: "1.05rem" }}>{item.title}</h4>
                  <p className="text-[#7A7A7A]" style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section id="bundles" className="py-24 md:py-32 bg-[#2F5BFF]">
        <div className="max-w-7xl mx-auto px-5">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-3" style={{ fontSize: "0.75rem" }}>
                Complete solutions
              </p>
              <h2
                className="text-white"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                Curated sets for every need
              </h2>
              <p className="text-white/60 mt-3 max-w-lg mx-auto" style={{ fontSize: "0.95rem" }}>
                Skip the guesswork. Our curated bundles bring together perfectly matched pieces at a better price.
              </p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Home Office Set",
                items: "Desk shelf + Phone stand + Cable organizer + Valet tray",
                price: "$145",
                save: "Save 15%",
                img: IMAGES.monitorStand,
              },
              {
                title: "Wall Decor Set",
                items: "World map + Floating shelves + Wall clock",
                price: "$189",
                save: "Save 12%",
                img: IMAGES.livingRoom,
              },
              {
                title: "Gift Set",
                items: "Phone stand + Organizer + Custom engraving + Gift box",
                price: "$79",
                save: "Save 18%",
                img: IMAGES.gifts,
              },
              {
                title: "Entry Eco Set",
                items: "Key holder + Phone stand + Desk pad",
                price: "$59",
                save: "Save 10%",
                img: IMAGES.workspace,
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1}>
                <div className="group cursor-pointer bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="overflow-hidden aspect-[4/3]">
                    <ImageWithFallback
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[#1F2A44]" style={{ fontSize: "1.05rem" }}>{item.title}</h4>
                      <span
                        className="px-2 py-0.5 bg-[#FF5A4F] text-white"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {item.save}
                      </span>
                    </div>
                    <p className="text-[#5A6B8C] mb-4" style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>
                      {item.items}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#FF7A00]" style={{ fontSize: "1.1rem", fontWeight: 600 }}>{item.price}</span>
                      <span className="text-[#1F2A44] flex items-center gap-1 transition-all duration-300 group-hover:gap-2 group-hover:text-[#FF7A00]" style={{ fontSize: "0.82rem" }}>
                        Shop set <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeUp>
              <div className="overflow-hidden">
                <ImageWithFallback
                  src={IMAGES.workshop}
                  alt="Woodcraft workshop"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div>
                <p className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-3" style={{ fontSize: "0.75rem" }}>
                  Our story
                </p>
                <h2
                  className="mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
                >
                  Design rooted
                  <br />
                  in nature
                </h2>
                <div className="space-y-4 text-[#7A7A7A]" style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>
                  <p>
                    Woodcraft was born from a simple belief: everyday objects should feel as good as
                    they look. We started in a small workshop in Belarus, combining our love for
                    natural materials with modern design thinking.
                  </p>
                  <p>
                    Every piece we make — from world maps to desk organizers — goes through a
                    thoughtful process of design, prototyping, and precision manufacturing. We use
                    oak, ash, and birch plywood sourced locally, finished with safe water-based oils.
                  </p>
                  <p>
                    Our goal is to help you create spaces that feel calm, organized, and genuinely
                    yours. Not just furniture accessories, but quiet companions for your daily life.
                  </p>
                </div>
                <div className="flex gap-12 mt-8">
                  {[
                    { num: "5+", label: "Years" },
                    { num: "12k+", label: "Products sold" },
                    { num: "4.9", label: "Rating" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-[#2F5BFF]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 600 }}>
                        {stat.num}
                      </div>
                      <div className="text-[#7A7A7A]" style={{ fontSize: "0.8rem" }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Customization / Corporate Gifts */}
      <section id="custom" className="py-24 md:py-32 bg-[#FFE9D6]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeUp>
              <div>
                <p className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-3" style={{ fontSize: "0.75rem" }}>
                  Custom & Corporate
                </p>
                <h2
                  className="mb-6"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
                >
                  Make it personal.
                  <br />
                  Make it memorable.
                </h2>
                <div className="space-y-4 text-[#7A7A7A] mb-8" style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>
                  <p>
                    Add custom laser engraving to any product — names, logos, dates, or personal
                    messages. Perfect for corporate gifts, event swag, or one-of-a-kind presents.
                  </p>
                  <p>
                    We work with companies of all sizes on branded gift sets, employee welcome kits,
                    and special-occasion packaging. Minimum order: just 10 pieces.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {["Custom Engraving", "Branded Gift Sets", "Corporate Orders", "Event Gifts"].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-2 text-[#1F2A44]" style={{ fontSize: "0.9rem" }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]" />
                        {item}
                      </div>
                    )
                  )}
                </div>
                <button
                  className="px-8 py-3.5 bg-[#FF7A00] text-white cursor-pointer border-none transition-all duration-300 hover:bg-[#E66D00] hover:-translate-y-0.5"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
                >
                  Get a Quote
                </button>
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="overflow-hidden">
                <ImageWithFallback
                  src={IMAGES.engraving}
                  alt="Custom laser engraving on wood"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-3" style={{ fontSize: "0.75rem" }}>
                What people say
              </p>
              <h2
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                Trusted by thousands
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Anna K.",
                role: "Interior Designer",
                text: "The world map exceeded all expectations. The detail in the layers, the quality of the oak — it's become the centerpiece of our living room. Clients keep asking where I got it.",
                stars: 5,
              },
              {
                name: "Dmitry V.",
                role: "Software Engineer",
                text: "I ordered the full workspace set — desk shelf, phone stand, and cable organizer. My desk has never looked this clean. The wood grain is gorgeous and the build quality is impeccable.",
                stars: 5,
              },
              {
                name: "Marina S.",
                role: "Marketing Manager",
                text: "We ordered 50 branded gift sets for our team. The engraving quality was perfect, delivery was on time, and the packaging looked premium. Already planning the next order.",
                stars: 5,
              },
            ].map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="bg-white p-8 border border-[rgba(0,0,0,0.06)]">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={14} className="fill-[#FF7A00] text-[#FF7A00]" />
                    ))}
                  </div>
                  <p className="text-[#1F2A44] mb-6" style={{ fontSize: "0.93rem", lineHeight: 1.7 }}>
                    "{t.text}"
                  </p>
                  <div>
                    <div className="text-[#1F2A44]" style={{ fontSize: "0.9rem", fontWeight: 500 }}>{t.name}</div>
                    <div className="text-[#7A7A7A]" style={{ fontSize: "0.8rem" }}>{t.role}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 md:py-32 bg-[#EEF4FF]">
        <div className="max-w-3xl mx-auto px-5">
          <FadeUp>
            <div className="text-center mb-16">
              <p className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-3" style={{ fontSize: "0.75rem" }}>
                FAQ
              </p>
              <h2
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                Common questions
              </h2>
            </div>
          </FadeUp>
          <div className="space-y-3">
            {[
              {
                q: "What materials do you use?",
                a: "We work primarily with oak, ash, birch plywood, and natural veneers. All wood is sourced locally in Belarus and finished with eco-friendly water-based oils and coatings.",
              },
              {
                q: "How long does production take?",
                a: "Standard products ship within 3–5 business days. Custom orders and engraved items take 7–10 business days. Corporate orders of 50+ pieces may require additional time.",
              },
              {
                q: "Do you ship internationally?",
                a: "Yes, we ship across Europe and to select countries worldwide. Shipping costs are calculated at checkout based on your location and order weight.",
              },
              {
                q: "Can I customize a product?",
                a: "Absolutely. We offer laser engraving on most products — names, logos, dates, or custom messages. For fully custom designs, reach out through our custom order form.",
              },
              {
                q: "How do I care for wooden products?",
                a: "Keep them dry and away from direct sunlight. Wipe with a soft dry cloth. For deeper cleaning, use a slightly damp cloth and let it air-dry. Re-oil once a year for best results.",
              },
              {
                q: "Do you offer bulk or corporate pricing?",
                a: "Yes. We offer tiered pricing for orders of 10+ pieces, with additional discounts for 50+ and 100+ quantities. Contact us for a custom quote.",
              },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <FAQItem question={item.q} answer={item.a} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section id="order-form" className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-5">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-3" style={{ fontSize: "0.75rem" }}>
                Свяжитесь с нами
              </p>
              <h2
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                Оформить заявку
              </h2>
              <p className="text-[#7A7A7A] mt-4 max-w-2xl mx-auto" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
                Заполните форму ниже, и мы свяжемся с вами в течение 24 часов для обсуждения деталей вашего заказа.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <form onSubmit={handleFormSubmit} className="bg-[#FFF8F1] p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[#1F2A44] mb-2"
                    style={{ fontSize: "0.9rem", letterSpacing: "0.03em" }}
                  >
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-[rgba(47,91,255,0.2)] focus:border-[#2F5BFF] focus:outline-none transition-colors"
                    style={{ fontSize: "0.95rem" }}
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact"
                    className="block text-[#1F2A44] mb-2"
                    style={{ fontSize: "0.9rem", letterSpacing: "0.03em" }}
                  >
                    Email или телефон *
                  </label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-[rgba(47,91,255,0.2)] focus:border-[#2F5BFF] focus:outline-none transition-colors"
                    style={{ fontSize: "0.95rem" }}
                    placeholder="example@mail.com или +375 29 123 45 67"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="orderType"
                  className="block text-[#2D2D2D] mb-2"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.03em" }}
                >
                  Тип заказа *
                </label>
                <select
                  id="orderType"
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.1)] focus:border-[#C4A97D] focus:outline-none transition-colors"
                  style={{ fontSize: "0.95rem" }}
                >
                  <option value="">Выберите тип заказа</option>
                  <option value="workspace">Аксессуары для рабочего стола</option>
                  <option value="wall-decor">Настенный декор</option>
                  <option value="gift">Подарочный набор</option>
                  <option value="corporate">Корпоративный заказ</option>
                  <option value="custom">Индивидуальный проект</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="message"
                  className="block text-[#2D2D2D] mb-2"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.03em" }}
                >
                  Сообщение
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.1)] focus:border-[#C4A97D] focus:outline-none transition-colors resize-none"
                  style={{ fontSize: "0.95rem", lineHeight: 1.6 }}
                  placeholder="Расскажите подробнее о вашем заказе: количество, материалы, сроки, гравировка и другие детали..."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={formSubmitted}
                  className="w-full sm:w-auto px-10 py-3.5 bg-[#FF7A00] text-white cursor-pointer border-none transition-all duration-300 hover:bg-[#E66D00] disabled:bg-[#5A6B8C] disabled:cursor-not-allowed"
                  style={{ fontSize: "0.95rem", letterSpacing: "0.05em" }}
                >
                  {formSubmitted ? "Отправлено ✓" : "Отправить заявку"}
                </button>
                {formSubmitted && (
                  <p className="text-[#2F5BFF]" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    Спасибо! Мы свяжемся с вами в ближайшее время.
                  </p>
                )}
              </div>

              <p className="text-[#7A7A7A] mt-6" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                Отправляя форму, вы соглашаетесь с обработкой персональных данных. Мы не передаем
                вашу информацию третьим лицам.
              </p>
            </form>
          </FadeUp>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={IMAGES.woodTexture}
            alt="Wood texture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1F2A44]/90" />
        </div>
        <div className="relative text-center max-w-2xl mx-auto px-5">
          <FadeUp>
            <h2
              className="text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
            >
              Ready to transform your space?
            </h2>
            <p className="text-white/60 mb-8" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
              Browse our full catalog or tell us about your custom project. We'll help you find the
              perfect wooden solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/catalog")}
                className="px-8 py-3.5 bg-white text-[#2D2D2D] cursor-pointer border-none transition-all duration-300 hover:-translate-y-0.5"
                style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
              >
                Browse Catalog
              </button>
              <button
                onClick={() => scrollTo("#custom")}
                className="px-8 py-3.5 bg-transparent text-white cursor-pointer border border-white/40 transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
              >
                Contact Us
              </button>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-[rgba(0,0,0,0.06)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 bg-transparent border-none cursor-pointer text-left text-[#1F2A44]"
        style={{ fontSize: "0.95rem" }}
      >
        {question}
        {open ? (
          <ChevronUp size={18} className="text-[#2F5BFF] flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-[#7A7A7A] flex-shrink-0" />
        )}
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "300px" : "0" }}
      >
        <p className="px-6 pb-5 text-[#7A7A7A]" style={{ fontSize: "0.9rem", lineHeight: 1.65 }}>
          {answer}
        </p>
      </div>
    </div>
  );
}
