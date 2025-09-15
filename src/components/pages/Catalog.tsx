import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../types";
import { useDebounce } from "../../hooks/useDebounce";
import { fetchProducts } from "../../api/products";
import LoadingSkeleton from "../LoadingSkeleton";
import ProductGrid from "../ProductGrid";

const Catalog = ({ gender }: { gender?: string }) => {
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sort, setSort] = useState<"none" | "asc" | "desc">("none");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then((p) => setAll(p))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  // Unique categories
  const categories = useMemo(
    () => Array.from(new Set(all.map((p) => p.category))),
    [all]
  );

  // Unique sizes
  const sizes = useMemo(
    () => Array.from(new Set(all.flatMap((p) => p.size || []))),
    [all]
  );

  // Filter products
  const filtered = useMemo(() => {
    let res = all.slice();

    if (gender) {
      res = res.filter((p) => p.gender === gender);
    }

    if (debounced.trim()) {
      res = res.filter((p) =>
        p.title.toLowerCase().includes(debounced.toLowerCase())
      );
    }

    if (selectedCategories.length) {
      res = res.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedSizes.length) {
      res = res.filter((p) =>
        (p.size || []).some((s) => selectedSizes.includes(s))
      );
    }

    const min = parseFloat(priceMin);
    const max = parseFloat(priceMax);
    if (!isNaN(min)) res = res.filter((p) => p.price >= min);
    if (!isNaN(max)) res = res.filter((p) => p.price <= max);

    if (sort === "asc") res.sort((a, b) => a.price - b.price);
    if (sort === "desc") res.sort((a, b) => b.price - a.price);

    return res;
  }, [
    all,
    gender,
    debounced,
    selectedCategories,
    selectedSizes,
    priceMin,
    priceMax,
    sort,
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title..."
            className="border bg-gray-700 px-3 py-2 rounded w-full sm:w-64"
          />
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "none" | "asc" | "desc")}
            className="border px-3 py-2 rounded bg-black"
          >
            <option value="none">Sort By</option>
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-4 rounded">
            {/* Categories */}
            <h4 className="font-semibold mb-2">Categories</h4>
            {categories.map((c) => (
              <label key={c} className="block text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedCategories((s) => [...s, c]);
                    else setSelectedCategories((s) => s.filter((x) => x !== c));
                  }}
                />
                <span className="ml-2">{c}</span>
              </label>
            ))}

            {/* Sizes */}
            <h4 className="font-semibold mt-4 mb-2">Sizes</h4>
            {sizes.map((s) => (
              <label key={s} className="block text-sm">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(s)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedSizes((prev) => [...prev, s]);
                    else
                      setSelectedSizes((prev) => prev.filter((x) => x !== s));
                  }}
                />
                <span className="ml-2">{s}</span>
              </label>
            ))}

            {/* Price */}
            <h4 className="font-semibold mt-4 mb-2">Price</h4>
            <div className="flex gap-2">
              <input
                aria-label="Min price"
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
                className="border rounded px-2 py-1 w-1/2"
              />
              <input
                aria-label="Max price"
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
                className="border rounded px-2 py-1 w-1/2"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="md:col-span-3">
          {loading && <LoadingSkeleton />}
          {error && (
            <div role="alert" className="p-4 bg-red-100 text-red-800">
              {error}
            </div>
          )}
          {!loading && !error && <ProductGrid products={filtered} />}
        </section>
      </div>
    </main>
  );
};

export default Catalog;
