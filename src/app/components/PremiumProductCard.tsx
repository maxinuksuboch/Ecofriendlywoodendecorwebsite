import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PremiumProductCardProps {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
}

export function PremiumProductCard({
  title,
  description,
  price,
  imageUrl,
  imageAlt,
}: PremiumProductCardProps) {
  return (
    <div className="group cursor-pointer bg-white overflow-hidden flex flex-col md:flex-row transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      {/* Image Section - 45-50% width on desktop */}
      <div className="md:w-[48%] overflow-hidden relative aspect-[4/3] md:aspect-auto">
        <ImageWithFallback
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Content Section - 50-55% width on desktop */}
      <div className="md:w-[52%] p-8 md:p-10 lg:p-12 flex flex-col justify-center">
        {/* Title */}
        <h3
          className="text-[#1F2A44] mb-4"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.75rem",
            lineHeight: 1.25,
            fontWeight: 500,
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-[#7A7A7A] mb-8"
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.7,
            letterSpacing: "0.01em",
          }}
        >
          {description}
        </p>

        {/* Price and CTA Row */}
        <div className="flex items-end justify-between mt-auto">
          {/* Price */}
          <div>
            <p
              className="text-[#FF7A00]"
              style={{
                fontSize: "1.4rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              {price}
            </p>
          </div>

          {/* CTA */}
          <button
            className="flex items-center gap-2 text-[#1F2A44] bg-transparent border-none cursor-pointer transition-all duration-300 group/cta hover:text-[#2F5BFF]"
            style={{
              fontSize: "0.9rem",
              letterSpacing: "0.03em",
            }}
          >
            <span className="border-b border-[#1F2A44] group-hover/cta:border-[#2F5BFF] pb-0.5 transition-colors">Explore</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover/cta:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
