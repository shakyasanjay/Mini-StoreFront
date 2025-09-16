import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import type { Product } from "../types";

export default function ProductGrid({ products }: { products: Product[] }) {
  const productsPerPage = 9;

  // Load page from localStorage, fallback to 1
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem("currentPage");
    return saved ? parseInt(saved, 10) : 1;
  });

  // Persist page to localStorage
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  if (!products.length)
    return <div className="p-8 text-center">No products found.</div>;

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const isNewProduct = (createdAt: string | Date) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffDays =
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  };

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentProducts.map((p) => {
          const onSale = p.compare_price && p.compare_price > p.price;
          const discount =
            onSale &&
            Math.round(((p.compare_price! - p.price) / p.compare_price!) * 100);
          const isNew = p.create_at && isNewProduct(p.create_at);

          return (
            <NavLink
              key={p.id}
              to={`/products/${p.id}`}
              className="block relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
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
                <h3 className="text-sm font-medium text-white">{p.title}</h3>
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
            </NavLink>
          );
        })}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentPage(idx + 1);
                window.scrollTo({ top: 0, }); // 👈 scroll to top
              }}
              className={`px-3 py-1 border rounded ${
                currentPage === idx + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
