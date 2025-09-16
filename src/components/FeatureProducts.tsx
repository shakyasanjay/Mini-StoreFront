import React, { useRef, useState, useEffect } from "react";
import type { Product } from "../types";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

interface FeaturedProductsProps {
  products: Product[]; // ✅ full product list from parent
  gender?: string; // ✅ optional: "men" | "women" | "kids"
  title: string; // ✅ section title (ex: "Men's Collection")
  subtitle?: string; // ✅ optional subtitle text
  limit?: number; // ✅ optional: number of products to show
  seeAllLink?: string; // ✅ optional: link to "see all" page
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  gender,
  title,
  subtitle,
  limit = 5, 
  seeAllLink,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ✅ Filter by gender (if provided), sort by latest, and limit
const filteredProducts = products
  .filter((product) => {
    if (!gender) return true;
    const g = product.gender;

    if (Array.isArray(g)) {
      // if gender is an array
      return g.some((item) => item.toLowerCase() === gender.toLowerCase());
    }

    // if gender is a string
    return g?.toLowerCase() === gender.toLowerCase();
  })
  .sort(
    (a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
  )
  .slice(0, limit);


  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -clientWidth : clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative px-6 py-12 bg-[#03071e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        {seeAllLink && (
          <Link
            to={seeAllLink}
            className="flex items-center gap-1 text-sm font-medium hover:underline"
          >
            See all →
          </Link>
        )}
      </div>

      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white z-10 transition-opacity"
        >
          <IoIosArrowDropleftCircle size={28} />
        </button>
      )}

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white z-10 transition-opacity"
        >
          <IoIosArrowDroprightCircle size={28} />
        </button>
      )}

      {/* Product list */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="w-[220px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center w-full">
            No products available.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
