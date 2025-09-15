import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import type { Product } from "../../types";
import { fetchProductById, fetchProducts } from "../../api/products";
import LoadingSkeleton from "../LoadingSkeleton";
import ProductGrid from "../ProductGrid";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetchProductById(Number(id))
      .then((p) => {
        if (!p) throw new Error("Product not found");
        setProduct(p);

        // Use `p` here instead of product (state isn’t updated yet)
        return fetchProducts().then((all) =>
          all
            .filter((x) => x.category === p.category && x.id !== p.id)
            .slice(0, 4)
        );
      })
      .then((relatedProducts) => setRelated(relatedProducts))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="p-8">
        <LoadingSkeleton />
      </div>
    );

  if (error)
    return (
      <div role="alert" className="p-4 bg-red-100">
        {error}
      </div>
    );

  if (!product) return <div className="p-4">No product found.</div>;

  return (
    <main className="w-full px-6 py-8">
      {/* Product Detail Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-transparent p-8 rounded-lg shadow">
        {/* Left: Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[480px] object-contain rounded"
          />
          {/* Thumbnails */}
          <div className="flex space-x-3 mt-4">
            <img
              src={product.image}
              alt="thumb"
              className="w-20 h-20 object-contain border rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div>
          <h1 className="text-4xl font-bold">{product.title}</h1>

          {/* Stock Status */}
          <div className="mt-3">
            {product.stock && product.stock > 0 ? (
              <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded">
                In Stock
              </span>
            ) : (
              <span className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mt-6 text-3xl font-semibold text-red-600">
            ${product.price.toLocaleString()}
          </div>

          {/* Description */}
          <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold">Color</h3>
            <div className="flex items-center space-x-2 mt-3">
              <button className="w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-800"></button>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold">Quantity</h3>
            <div className="flex items-center mt-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 border rounded-l text-lg"
              >
                -
              </button>
              <span className="px-6 py-2 border-t border-b text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 border rounded-r text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-10">
            <button
              disabled={product.stock === 0}
              onClick={() => addToCart(product)}
              className="w-full px-8 py-4 text-lg font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {product.stock === 0 ? "Out of stock" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Related products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </main>
  );
};

export default ProductDetail;
