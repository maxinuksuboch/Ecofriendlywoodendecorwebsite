import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FadeUp } from "./FadeUp";
import {
  ArrowLeft,
  Check,
  Star,
  Truck,
  Shield,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PRODUCT = {
  title: "Wooden World Maps",
  subtitle: "Multi-layered wall decor",
  price: "$120",
  priceFrom: "From $120",
  rating: 4.9,
  reviews: 127,
  description:
    "A statement piece for any modern interior. Our multi-layered wooden world maps combine natural materials with precision manufacturing to create a three-dimensional wall sculpture that transforms any space.",
  longDescription:
    "Each map is carefully crafted from premium oak and walnut, with each continent cut and layered to create depth and visual interest. The natural wood grain adds organic warmth, while the clean lines and precise geometry maintain a contemporary aesthetic.",
  images: [
    "https://images.unsplash.com/photo-1606933988322-a3cb8968e5ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB3b3JsZCUyMG1hcCUyMHdhbGwlMjBkZWNvciUyMGludGVyaW9yfGVufDF8fHx8MTc3NTU2Mzg2OXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1653242370332-e332a8103763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwd2FsbCUyMGRlY29yJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU1NjM4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1761799839491-d1c18630e8d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYWslMjB3b29kJTIwdGV4dHVyZSUyMGNsb3NlJTIwdXAlMjBncmFpbnxlbnwxfHx8fDE3NzU1NjM4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ],
  features: [
    "Premium oak and walnut construction",
    "3-layer depth design for dimensional effect",
    "Eco-friendly water-based finish",
    "Pre-mounted backing for easy installation",
    "Includes mounting hardware",
    "Handcrafted in Belarus",
  ],
  specifications: [
    { label: "Dimensions", value: "120 × 60 cm" },
    { label: "Weight", value: "2.8 kg" },
    { label: "Materials", value: "Oak, Walnut, Birch Plywood" },
    { label: "Finish", value: "Water-based oil" },
    { label: "Layers", value: "3-layer design" },
    { label: "Production time", value: "5-7 business days" },
  ],
  options: [
    { name: "Oak Natural", price: "$120" },
    { name: "Walnut Dark", price: "$135" },
    { name: "Oak + Walnut Mix", price: "$150" },
    { name: "Custom Finish", price: "From $165" },
  ],
};

export function ProductDetailPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % PRODUCT.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + PRODUCT.images.length) % PRODUCT.images.length);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Back Navigation */}
      <div className="bg-[#FFF8F1] border-b border-[rgba(47,91,255,0.12)]">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#7A7A7A] bg-transparent border-none cursor-pointer transition-colors hover:text-[#2D2D2D]"
            style={{ fontSize: "0.9rem" }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-5 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div>
            <FadeUp>
              <div className="relative aspect-[4/3] bg-[#FFF8F1] mb-4 overflow-hidden">
                <ImageWithFallback
                  src={PRODUCT.images[selectedImage]}
                  alt={`${PRODUCT.title} - View ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm border-none cursor-pointer flex items-center justify-center transition-all hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} className="text-[#1F2A44]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm border-none cursor-pointer flex items-center justify-center transition-all hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} className="text-[#1F2A44]" />
                </button>
              </div>
            </FadeUp>

            {/* Thumbnail Gallery */}
            <FadeUp delay={0.1}>
              <div className="grid grid-cols-3 gap-3">
                {PRODUCT.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square bg-[#FFF8F1] overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedImage === i ? "border-[#2F5BFF]" : "border-transparent"
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </FadeUp>
          </div>

          {/* Product Info */}
          <div>
            <FadeUp>
              <div className="mb-6">
                <p
                  className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-2"
                  style={{ fontSize: "0.75rem" }}
                >
                  Wall Decor
                </p>
                <h1
                  className="text-[#1F2A44] mb-2"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    lineHeight: 1.2,
                  }}
                >
                  {PRODUCT.title}
                </h1>
                <p className="text-[#7A7A7A]" style={{ fontSize: "1rem" }}>
                  {PRODUCT.subtitle}
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.05}>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[rgba(0,0,0,0.06)]">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(PRODUCT.rating)
                          ? "fill-[#FF7A00] text-[#FF7A00]"
                          : "text-[#E5E5E5]"
                      }
                    />
                  ))}
                </div>
                <span className="text-[#7A7A7A]" style={{ fontSize: "0.9rem" }}>
                  {PRODUCT.rating} ({PRODUCT.reviews} reviews)
                </span>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="mb-8">
                <p
                  className="text-[#FF7A00] mb-4"
                  style={{
                    fontSize: "2rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {PRODUCT.priceFrom}
                </p>
                <p className="text-[#1F2A44] mb-4" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
                  {PRODUCT.description}
                </p>
                <p className="text-[#7A7A7A]" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
                  {PRODUCT.longDescription}
                </p>
              </div>
            </FadeUp>

            {/* Finish Options */}
            <FadeUp delay={0.15}>
              <div className="mb-8">
                <label
                  className="block text-[#1F2A44] mb-3"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.03em" }}
                >
                  Select finish
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {PRODUCT.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedOption(i)}
                      className={`p-4 border-2 cursor-pointer bg-white transition-all text-left ${
                        selectedOption === i
                          ? "border-[#2F5BFF] bg-[#EEF4FF]"
                          : "border-[rgba(47,91,255,0.2)] hover:border-[#2F5BFF]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#1F2A44]" style={{ fontSize: "0.9rem" }}>
                          {option.name}
                        </span>
                        <span className="text-[#FF7A00]" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                          {option.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* CTA Buttons */}
            <FadeUp delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={() => navigate("/#order-form")}
                  className="flex-1 px-8 py-4 bg-[#FF7A00] text-white border-none cursor-pointer transition-all hover:bg-[#E66D00]"
                  style={{ fontSize: "0.95rem", letterSpacing: "0.05em" }}
                >
                  Order Now
                </button>
                <button
                  className="px-8 py-4 bg-transparent text-[#2F5BFF] border-2 border-[#2F5BFF] cursor-pointer transition-all hover:bg-[#2F5BFF] hover:text-white"
                  style={{ fontSize: "0.95rem", letterSpacing: "0.05em" }}
                >
                  Add to Wishlist
                </button>
              </div>
            </FadeUp>

            {/* Trust Badges */}
            <FadeUp delay={0.25}>
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-[rgba(0,0,0,0.06)]">
                {[
                  { icon: Truck, label: "Free Shipping" },
                  { icon: Shield, label: "Quality Guarantee" },
                  { icon: Palette, label: "Custom Finishes" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="flex justify-center mb-2">
                      <item.icon size={20} className="text-[#2F5BFF]" />
                    </div>
                    <p className="text-[#7A7A7A]" style={{ fontSize: "0.75rem" }}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Features & Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
          {/* Features */}
          <FadeUp delay={0.3}>
            <div>
              <h3
                className="text-[#1F2A44] mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                }}
              >
                Key Features
              </h3>
              <div className="space-y-3">
                {PRODUCT.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={18} className="text-[#2F5BFF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#7A7A7A]" style={{ fontSize: "0.95rem" }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Specifications */}
          <FadeUp delay={0.35}>
            <div>
              <h3
                className="text-[#1F2A44] mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                }}
              >
                Specifications
              </h3>
              <div className="space-y-3">
                {PRODUCT.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-3 border-b border-[rgba(0,0,0,0.06)]"
                  >
                    <span className="text-[#7A7A7A]" style={{ fontSize: "0.9rem" }}>
                      {spec.label}
                    </span>
                    <span className="text-[#1F2A44]" style={{ fontSize: "0.9rem" }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
