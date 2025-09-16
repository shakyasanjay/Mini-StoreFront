import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { Product } from "../types";

export default function ProductGrid({ products }: { products: Product[] }) {
  const productsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  // Reset to page 1 whenever the route changes
  useEffect(() => {
    setCurrentPage(1);
  }, [location.pathname]);

  // 👇 scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0 });
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

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          {/* Mobile: Dropdown */}
          <div className="sm:hidden">
            <select
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="px-3 py-2 border rounded bg-white text-gray-700"
            >
              {Array.from({ length: totalPages }, (_, idx) => (
                <option key={idx} value={idx + 1}>
                  Page {idx + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop: Pagination Buttons */}
          <div className="hidden sm:flex space-x-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              Prev
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={idx} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`px-3 py-1 rounded-full border transition ${
                    currentPage === page
                      ? "bg-amber-400 text-black border-amber-400"
                      : "bg-white text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border transition ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
