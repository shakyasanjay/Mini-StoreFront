import { useEffect, useMemo, useState } from 'react'
import type { Product } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchProducts } from '../../api/products';
import LoadingSkeleton from '../LoadingSkeleton';
import ProductGrid from '../ProductGrid';

const Catalog = () => {
    const [all, setAll] = useState<Product[]>([]);
    const [loading, setLoading] =useState(true);
    const [error, setError] =useState<string | null> (null);

    //For filter
    const [query, setQuery] =useState("");
    const debounced =useDebounce(query, 400);
    const [selectedCategories, setSelectedCategories] =useState<string[]>([]);
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

    const categories = useMemo(
      () => Array.from(new Set(all.map((p) => p.category))),
      [all]
    );

    const filtered = useMemo(() => {
      let res = all.slice();
      if (debounced.trim())
        res = res.filter((p) =>
          p.title.toLowerCase().includes(debounced.toLowerCase())
        );
      if (selectedCategories.length)
        res = res.filter((p) => selectedCategories.includes(p.category));
      const min = parseFloat(priceMin);
      const max = parseFloat(priceMax);
      if (!isNaN(min)) res = res.filter((p) => p.price >= min);
      if (!isNaN(max)) res = res.filter((p) => p.price <= max);
      if (sort === "asc") res.sort((a, b) => a.price - b.price);
      if (sort === "desc") res.sort((a, b) => b.price - a.price);
      return res;
    }, [all, debounced, selectedCategories, priceMin, priceMax, sort]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title..."
            className="border px-3 py-2 rounded w-full sm:w-64"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "none" | "asc" | "desc")}
            className="border px-3 py-2 rounded"
          >
            <option value="none">Sort</option>
            <option value="asc">Price: Low → High</option>
            <option value="desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-4 rounded border">
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

            <h4 className="font-semibold mt-4 mb-2">Price</h4>
            <div className="flex gap-2">
              <label className="sr-only">Min price</label>
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
}

export default Catalog
