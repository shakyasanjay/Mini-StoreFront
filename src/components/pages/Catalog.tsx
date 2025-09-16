import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../types";
import { fetchProducts } from "../../api/products";
import LoadingSkeleton from "../LoadingSkeleton";
import ProductGrid from "../ProductGrid";
import { useDebounce } from "../../hooks/useDebounce";

const Catalog = ({ gender }: { gender?: string }) => {
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);

  const [sort, setSort] = useState<"relevance" | "asc" | "desc">("relevance");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedsize, setSelectedsize] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number | "", number | ""]>([
    "",
    "",
  ]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then((p) => {
        setAll(p);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const pageTitle = useMemo(() => {
    if (gender === "men") return "Men's Collection";
    if (gender === "women") return "Women's Collection";
    return "All Collections";
  }, [gender]);

  // Unique filters
  const categories = useMemo(
    () => Array.from(new Set(all.map((p) => p.category))),
    [all]
  );
  const size = useMemo(
    () => Array.from(new Set(all.flatMap((p) => p.size ?? []))),
    [all]
  );
  const colors = useMemo(
    () => Array.from(new Set(all.flatMap((p) => p.colors ?? []))),
    [all]
  );
  const minPrice = useMemo(() => Math.min(...all.map((p) => p.price)), [all]);
  const maxPrice = useMemo(() => Math.max(...all.map((p) => p.price)), [all]);

  // Filter + search + sort
  const filtered = useMemo(() => {
    let res = all.slice();

    if (gender) res = res.filter((p) => p.gender === gender);
    if (debounced.trim())
      res = res.filter((p) =>
        p.title.toLowerCase().includes(debounced.toLowerCase())
      );
    if (selectedCategories.length)
      res = res.filter((p) => selectedCategories.includes(p.category));
    if (selectedsize.length)
      res = res.filter((p) =>
        (p.size ?? []).some((s) => selectedsize.includes(s))
      );
    if (selectedColors.length)
      res = res.filter((p) =>
        (p.colors ?? []).some((c) => selectedColors.includes(c))
      );

    // ✅ apply price filter only if user entered values
    res = res.filter(
      (p) =>
        (priceRange[0] === "" || p.price >= priceRange[0]) &&
        (priceRange[1] === "" || p.price <= priceRange[1])
    );

    if (sort === "asc") res.sort((a, b) => a.price - b.price);
    if (sort === "desc") res.sort((a, b) => b.price - a.price);

    return res;
  }, [
    all,
    gender,
    debounced,
    sort,
    selectedCategories,
    selectedsize,
    selectedColors,
    priceRange,
  ]);

  // Toggle helpers
  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  const toggleSize = (s: string) =>
    setSelectedsize((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  const toggleColor = (c: string) =>
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <p className="text-gray-400 mt-2">
          Search through collection of products
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title..."
          className="w-full sm:w-96 px-4 py-2 rounded border bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-medium mb-2">Collections</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((c) => (
                <li
                  key={c}
                  className={`cursor-pointer ${
                    selectedCategories.includes(c)
                      ? "text-green-400 font-semibold"
                      : "text-blue-400 hover:underline"
                  }`}
                  onClick={() => toggleCategory(c)}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Size */}
          <div>
            <h3 className="font-medium mb-2">Size</h3>
            <ul className="space-y-2 text-sm">
              {size.map((s) => (
                <li
                  key={s}
                  className={`cursor-pointer ${
                    selectedsize.includes(s)
                      ? "text-green-400 font-semibold"
                      : "text-blue-400 hover:underline"
                  }`}
                  onClick={() => toggleSize(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-medium mb-2">Colors</h3>
            <ul className="space-y-2 text-sm">
              {colors.map((c) => (
                <li
                  key={c}
                  className={`cursor-pointer ${
                    selectedColors.includes(c)
                      ? "text-green-400 font-semibold"
                      : "text-blue-400 hover:underline"
                  }`}
                  onClick={() => toggleColor(c)}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-2">Price</h3>
            <div className="flex space-x-2 text-sm">
              <input
                type="number"
                value={priceRange[0]}
                placeholder="Min"
                min={minPrice}
                max={priceRange[1] === "" ? maxPrice : priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    e.target.value === "" ? "" : Number(e.target.value),
                    priceRange[1],
                  ])
                }
                className="w-16 px-2 py-1 rounded border bg-gray-800 text-white"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange[1]}
                placeholder="Max"
                min={priceRange[0] === "" ? minPrice : priceRange[0]}
                max={maxPrice}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    e.target.value === "" ? "" : Number(e.target.value),
                  ])
                }
                className="w-16 px-2 py-1 rounded border bg-gray-800 text-white"
              />
            </div>
          </div>

          {/* Clear all filters */}
          {(selectedCategories.length ||
            selectedsize.length ||
            selectedColors.length ||
            priceRange[0] !== "" ||
            priceRange[1] !== "") && (
            <button
              className="mt-4 text-xs text-red-400 hover:underline"
              onClick={() => {
                setSelectedCategories([]);
                setSelectedsize([]);
                setSelectedColors([]);
                setPriceRange(["", ""]);
              }}
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* Products */}
        <section className="md:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">
              {selectedCategories.length ||
              selectedsize.length ||
              selectedColors.length ||
              priceRange[0] !== "" ||
              priceRange[1] !== ""
                ? `Filtered (${filtered.length})`
                : `All products (${filtered.length})`}
            </h2>
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "relevance" | "asc" | "desc")
              }
              className="border px-3 py-2 rounded bg-gray-900 text-white"
            >
              <option value="relevance">Relevance</option>
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
            </select>
          </div>

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
