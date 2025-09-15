import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import type { Product } from "../types";

interface SidebarFiltersProps {
  onFilterChange?: (filters: Filters) => void;
}

interface Filters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  colors?: string[];
  sizes?: string[];
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({ onFilterChange }) => {
  const [, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    fetchProducts().then((all) => {
      setProducts(all);

      // Unique values from products
      setCategories(Array.from(new Set(all.map((p) => p.category))));
      setColors(Array.from(new Set(all.flatMap((p) => p.colors || []))));
      setSizes(Array.from(new Set(all.flatMap((p) => p.sizes || []))));
    });
  }, []);

  const updateFilter = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleArrayFilter = (key: "colors" | "sizes", value: string) => {
    const current = filters[key] || [];
    const newValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    updateFilter(key, newValues);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded space-y-6">
      <h3 className="text-lg font-semibold">Filters</h3>

      {/* Category */}
      <div>
        <h4 className="font-medium mb-2">Category</h4>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat}>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={filters.category === cat}
                  onChange={() => updateFilter("category", cat)}
                />
                <span>{cat}</span>
              </label>
            </li>
          ))}
          <li>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => updateFilter("category", undefined)}
              />
              <span>All Categories</span>
            </label>
          </li>
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-2">Price Range</h4>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              updateFilter(
                "minPrice",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="w-1/2 p-2 rounded border"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              updateFilter(
                "maxPrice",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="w-1/2 p-2 rounded border"
          />
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="font-medium mb-2">Colors</h4>
        <ul className="space-y-1">
          {colors.map((color) => (
            <li key={color}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.colors?.includes(color) ?? false}
                  onChange={() => toggleArrayFilter("colors", color)}
                />
                <span>{color}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-medium mb-2">Sizes</h4>
        <ul className="space-y-1">
          {sizes.map((size) => (
            <li key={size}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.sizes?.includes(size) ?? false}
                  onChange={() => toggleArrayFilter("sizes", size)}
                />
                <span>{size}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Stock */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.inStock ?? false}
            onChange={(e) => updateFilter("inStock", e.target.checked)}
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

export default SidebarFilters;
