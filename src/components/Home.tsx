import React, { useEffect, useState } from "react";
import type { Product } from "../types";
import { fetchProducts } from "../api/products";
import HeroBanner from "../components/HeroBanner";
import FeaturedProducts from "../components/FeatureProducts";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((res) => setProducts(res.slice(0, 8))) // show first 8 as featured
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <HeroBanner />
      {loading ? (
        <div className="text-center py-12">Loading featured products...</div>
      ) : (
        <FeaturedProducts products={products} />
      )}
    </main>
  );
};

export default Home;
