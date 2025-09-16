import React, { useEffect, useState } from "react";
import type { Product } from "../../types";
import { fetchProducts } from "../../api/products";
import HeroBanner from "../HeroBanner";
import FeaturedProducts from "../FeatureProducts";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((res) => setProducts(res)) // ✅ get ALL products, not just first 8
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <HeroBanner />
      {loading ? (
        <div className="text-center py-12">Loading featured products...</div>
      ) : (
        <>
          {/* ✅ Men's Collection */}
          <FeaturedProducts
            products={products}
            gender="men"
            title="Men’s Collection"
            subtitle="Latest men's arrivals"
            limit={4} // ✅ only show latest 4 men's products
            seeAllLink="/collection/mens"
          />

          {/* ✅ Women's Collection */}
          <FeaturedProducts
            products={products}
            gender="women"
            title="Women’s Collection"
            subtitle="Latest women's arrivals"
            limit={4}
            seeAllLink="/women"
          />
        </>
      )}
    </main>
  );
};

export default Home;
