import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FadeUp } from "./FadeUp";
import { Search, SlidersHorizontal, ArrowRight, ChevronDown } from "lucide-react";

// Placeholder product data
const PLACEHOLDER_PRODUCTS = [
  {
    id: 1,
    title: "Wooden World Map",
    subtitle: "Multi-layered wall decor",
    price: "From $120",
    category: "Wall Decor",
    material: "Oak",
    image: "https://images.unsplash.com/photo-1606933988322-a3cb8968e5ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB3b3JsZCUyMG1hcCUyMHdhbGwlMjBkZWNvciUyMGludGVyaW9yfGVufDF8fHx8MTc3NTU2Mzg2OXww&ixlib=rb-4.1.0&q=80&w=1080",
    isNew: true,
    link: "/product/wooden-world-maps",
  },
  {
    id: 2,
    title: "Monitor Stand",
    subtitle: "Elevated workspace organizer",
    price: "$65",
    category: "Workspace",
    material: "Ash",
    image: "https://images.unsplash.com/photo-1764557238996-c1df265dddb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlJTIwbW9uaXRvciUyMHN0YW5kJTIwd29vZGVufGVufDF8fHx8MTc3NTU2Mzg3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    isNew: true,
  },
  {
    id: 3,
    title: "Phone Stand",
    subtitle: "Elegant desk accessory",
    price: "$28",
    category: "Workspace",
    material: "Walnut",
    image: "https://images.unsplash.com/photo-1679110450190-f196308c303c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBwaG9uZSUyMHN0YW5kJTIwZGVzayUyMG9yZ2FuaXplcnxlbnwxfHx8fDE3NzU1NjM4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    title: "Desk Shelf",
    subtitle: "Space-saving organizer",
    price: "$48",
    category: "Workspace",
    material: "Oak",
    image: "https://images.unsplash.com/photo-1662018113001-0feffe4dd5d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkZXNrJTIwc2hlbGYlMjBtb25pdG9yJTIwcmlzZXIlMjBjbGVhbnxlbnwxfHx8fDE3NzU1NjM4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    title: "Cable Organizer",
    subtitle: "Minimize desk clutter",
    price: "$22",
    category: "Organizers",
    material: "Birch",
    image: "https://images.unsplash.com/photo-1771150251872-95826aa516ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkZXNrJTIwYWNjZXNzb3JpZXMlMjB3b3Jrc3BhY2UlMjBzZXR1cCUyMG1pbmltYWx8ZW58MXx8fHwxNzc1NTYzODY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 6,
    title: "Valet Tray",
    subtitle: "Entry essentials organizer",
    price: "$32",
    category: "Organizers",
    material: "Walnut",
    image: "https://images.unsplash.com/photo-1764161852303-8683d296f0cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb3JnYW5pemF0aW9uJTIwd29vZGVuJTIwc2hlbHZlcyUyMG1pbmltYWx8ZW58MXx8fHwxNzc1NTYzODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 7,
    title: "Premium Gift Set",
    subtitle: "Curated workspace bundle",
    price: "$85",
    category: "Gifts",
    material: "Mixed",
    image: "https://images.unsplash.com/photo-1759563874665-ffa9dfbd0205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBnaWZ0JTIwYm94JTIwc2V0JTIwcHJlbWl1bSUyMHBhY2thZ2luZ3xlbnwxfHx8fDE3NzU1NjM4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isNew: true,
  },
  {
    id: 8,
    title: "Key Holder",
    subtitle: "Wall-mounted organizer",
    price: "$35",
    category: "Organizers",
    material: "Oak",
    image: "https://images.unsplash.com/photo-1653242370332-e332a8103763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwd2FsbCUyMGRlY29yJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU1NjM4NzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 9,
    title: "Wooden Wall Panel",
    subtitle: "Geometric decor piece",
    price: "$95",
    category: "Wall Decor",
    material: "Ash",
    image: "https://images.unsplash.com/photo-1606933988322-a3cb8968e5ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB3b3JsZCUyMG1hcCUyMHdhbGwlMjBkZWNvciUyMGludGVyaW9yfGVufDF8fHx8MTc3NTU2Mzg2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 10,
    title: "Entry Organizer",
    subtitle: "Multi-purpose tray set",
    price: "$42",
    category: "Organizers",
    material: "Birch",
    image: "https://images.unsplash.com/photo-1771150251872-95826aa516ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkZXNrJTIwYWNjZXNzb3JpZXMlMjB3b3Jrc3BhY2UlMjBzZXR1cCUyMG1pbmltYWx8ZW58MXx8fHwxNzc1NTYzODY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 11,
    title: "Workspace Set",
    subtitle: "Complete desk collection",
    price: "$145",
    category: "Gifts",
    material: "Mixed",
    image: "https://images.unsplash.com/photo-1764755932155-dabbee87df7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwb2ZmaWNlJTIwZGVzayUyMHNldHVwJTIwY2xlYW58ZW58MXx8fHwxNzc1NTYzODcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 12,
    title: "Floating Shelf",
    subtitle: "Minimalist wall storage",
    price: "$55",
    category: "Wall Decor",
    material: "Walnut",
    image: "https://images.unsplash.com/photo-1764161852303-8683d296f0cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb3JnYW5pemF0aW9uJTIwd29vZGVuJTIwc2hlbHZlcyUyMG1pbmltYWx8ZW58MXx8fHwxNzc1NTYzODcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const CATEGORIES = [
  "All Products",
  "Wall Decor",
  "Workspace",
  "Organizers",
  "Gifts",
  "New Arrivals",
];

const MATERIALS = ["All Materials", "Oak", "Walnut", "Ash", "Birch", "Mixed"];

const SORT_OPTIONS = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Newest First",
  "Name: A-Z",
];

export function CatalogPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedMaterial, setSelectedMaterial] = useState("All Materials");
  const [sortBy, setSortBy] = useState("Featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(9);

  const filteredProducts = PLACEHOLDER_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "All Products" ||
      (selectedCategory === "New Arrivals" && product.isNew) ||
      product.category === selectedCategory;
    const matchesMaterial =
      selectedMaterial === "All Materials" || product.material === selectedMaterial;
    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesMaterial && matchesSearch;
  });

  const displayedProducts = filteredProducts.slice(0, visibleProducts);
  const hasMore = visibleProducts < filteredProducts.length;

  const handleProductClick = (product: typeof PLACEHOLDER_PRODUCTS[0]) => {
    if (product.link) {
      navigate(product.link);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero / Intro */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-[#FFF8F1]">
        <div className="max-w-7xl mx-auto px-5">
          <FadeUp>
            <div className="max-w-2xl mx-auto text-center">
              <p
                className="tracking-[0.15em] uppercase text-[#7A7A7A] mb-3"
                style={{ fontSize: "0.7rem" }}
              >
                Home / Catalog
              </p>
              <h1
                className="text-[#1F2A44] mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  lineHeight: 1.2,
                }}
              >
                Catalog
              </h1>
              <p className="text-[#7A7A7A] max-w-xl mx-auto" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
                Explore modern wooden decor, workspace accessories, and giftable products crafted
                with a focus on natural materials, clean design, and functional beauty.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5">
          {/* Filter Toolbar */}
          <FadeUp delay={0.1}>
            <div className="mb-8">
              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-xs">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[rgba(47,91,255,0.2)] focus:border-[#2F5BFF] focus:outline-none transition-colors"
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="px-4 py-2.5 border border-[rgba(47,91,255,0.2)] bg-white focus:border-[#2F5BFF] focus:outline-none transition-colors cursor-pointer"
                  style={{ fontSize: "0.9rem" }}
                >
                  {MATERIALS.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-[rgba(47,91,255,0.2)] bg-white focus:border-[#2F5BFF] focus:outline-none transition-colors cursor-pointer"
                  style={{ fontSize: "0.9rem" }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Button */}
              <div className="md:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#EEF4FF] border-none cursor-pointer"
                  style={{ fontSize: "0.9rem" }}
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal size={18} />
                    Filters & Sort
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>
                {showFilters && (
                  <div className="mt-2 p-4 bg-[#EEF4FF] space-y-3">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[rgba(47,91,255,0.2)] bg-white focus:border-[#2F5BFF] focus:outline-none"
                      style={{ fontSize: "0.9rem" }}
                    />
                    <select
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.1)] bg-white focus:border-[#C4A97D] focus:outline-none"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {MATERIALS.map((material) => (
                        <option key={material} value={material}>
                          {material}
                        </option>
                      ))}
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.1)] bg-white focus:border-[#C4A97D] focus:outline-none"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Category Chips */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 border-2 cursor-pointer transition-all ${
                      selectedCategory === category
                        ? "bg-[#2F5BFF] text-white border-[#2F5BFF]"
                        : "bg-white text-[#5A6B8C] border-[rgba(47,91,255,0.2)] hover:border-[#2F5BFF] hover:text-[#2F5BFF]"
                    }`}
                    style={{ fontSize: "0.85rem", letterSpacing: "0.02em" }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Results Count */}
          <FadeUp delay={0.15}>
            <p className="text-[#7A7A7A] mb-8" style={{ fontSize: "0.9rem" }}>
              Showing {displayedProducts.length} of {filteredProducts.length} products
            </p>
          </FadeUp>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {displayedProducts.map((product, i) => (
              <FadeUp key={product.id} delay={i * 0.05}>
                <div
                  onClick={() => handleProductClick(product)}
                  className="group cursor-pointer bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative overflow-hidden aspect-[4/3] bg-[#FFF8F1]">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.isNew && (
                      <div
                        className="absolute top-3 right-3 px-3 py-1 bg-[#FF5A4F] text-white"
                        style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                      >
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-[#1F2A44] mb-1" style={{ fontSize: "1.05rem" }}>
                      {product.title}
                    </h3>
                    <p className="text-[#7A7A7A] mb-3" style={{ fontSize: "0.85rem" }}>
                      {product.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#FF7A00]" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                        {product.price}
                      </span>
                      <span className="flex items-center gap-1 text-[#1F2A44] transition-all duration-300 group-hover:gap-2 group-hover:text-[#2F5BFF]" style={{ fontSize: "0.82rem" }}>
                        View <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <FadeUp>
              <div className="text-center">
                <button
                  onClick={() => setVisibleProducts((prev) => prev + 6)}
                  className="px-10 py-3.5 bg-transparent text-[#2F5BFF] border-2 border-[#2F5BFF] cursor-pointer transition-all duration-300 hover:bg-[#2F5BFF] hover:text-white"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
                >
                  Load More Products
                </button>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 md:py-24 bg-[#FFE9D6]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1606933988322-a3cb8968e5ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB3b3JsZCUyMG1hcCUyMHdhbGwlMjBkZWNvciUyMGludGVyaW9yfGVufDF8fHx8MTc3NTU2Mzg2OXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Wooden World Maps Collection"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div>
                <p
                  className="tracking-[0.25em] uppercase text-[#2F5BFF] mb-3"
                  style={{ fontSize: "0.75rem" }}
                >
                  Featured Collection
                </p>
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  }}
                >
                  Wooden World Maps
                </h2>
                <p className="text-[#7A7A7A] mb-8" style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>
                  Our signature collection. Multi-layered wall maps crafted from premium oak and
                  walnut, designed to transform any space into a statement of modern elegance.
                  Available in multiple sizes and custom finishes.
                </p>
                <button
                  onClick={() => navigate("/product/wooden-world-maps")}
                  className="px-8 py-3.5 bg-[#FF7A00] text-white cursor-pointer border-none transition-all duration-300 hover:bg-[#E66D00] hover:-translate-y-0.5"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
                >
                  Explore Collection
                </button>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <FadeUp>
            <h2
              className="mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
              }}
            >
              Stay updated on new collections
            </h2>
            <p className="text-[#7A7A7A] mb-8 max-w-xl mx-auto" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
              Be the first to discover new product launches, limited editions, and exclusive
              behind-the-scenes stories from our workshop.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 border border-[rgba(47,91,255,0.2)] focus:border-[#2F5BFF] focus:outline-none"
                style={{ fontSize: "0.9rem" }}
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#FF7A00] text-white cursor-pointer border-none transition-all duration-300 hover:bg-[#E66D00]"
                style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
              >
                Subscribe
              </button>
            </form>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
