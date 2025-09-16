import React, { useRef, useState, useEffect } from "react";
import type { Product } from "../types";
import { Link } from "react-router-dom";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

interface FeaturedProductsProps {
  products: Product[];
  gender?: string;
  title: string;
  subtitle?: string;
  limit?: number;
  seeAllLink?: string;
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

  // Filter by gender, sort by latest, and limit
  const filteredProducts = products
    .filter((product) => {
      if (!gender) return true;
      const g = product.gender;
      if (Array.isArray(g)) {
        return g.some((item) => item.toLowerCase() === gender.toLowerCase());
      }
      return g?.toLowerCase() === gender.toLowerCase();
    })
    .sort(
      (a, b) =>
        new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
    )
    .slice(0, limit);

  // scroll check
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

  // utility: is new product?
  const isNewProduct = (createdAt: string | Date) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffDays =
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
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

      {/* Product list (same UI as ProductGrid) */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => {
            const onSale = p.compare_price && p.compare_price > p.price;
            const discount =
              onSale &&
              Math.round(
                ((p.compare_price! - p.price) / p.compare_price!) * 100
              );
            const isNew = p.create_at && isNewProduct(p.create_at);

            return (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="block relative w-[220px] flex-shrink-0 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {onSale && (
                  <>
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Sale
                    </span>
                    {discount && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        -{discount}%
                      </span>
                    )}
                  </>
                )}

                {!onSale && isNew && (
                  <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    New
                  </span>
                )}

                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-72 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-sm font-medium text-white truncate">
                    {p.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-white font-semibold">
                      ${p.price.toFixed(2)}
                    </span>
                    {onSale && (
                      <span className="text-gray-500 line-through text-sm">
                        ${p.compare_price!.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
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
