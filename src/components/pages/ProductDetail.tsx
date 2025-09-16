import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useCart } from "../../contexts/CartContext";
import type { Product } from "../../types";
import { fetchProductById, fetchProducts } from "../../api/products";
import LoadingSkeleton from "../LoadingSkeleton";
import ProductImages from "../ProductImages";
import Toast from "../Toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetchProductById(id)
      .then((p) => {
        if (!p) throw new Error("Product not found");
        setProduct(p);

        // ✅ Fetch related products by gender + category
        return fetchProducts().then((all) =>
          all
            .filter(
              (x) =>
                x.id !== p.id &&
                x.gender === p.gender &&
                x.category === p.category
            )
            .slice(0, 3)
        );
      })
      .then((relatedProducts) => setRelated(relatedProducts))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  // Handle Add to Cart with toast
  const handleAddToCart = () => {
    try {
      addToCart(
        product!,
        quantity,
        selectedColor ?? undefined,
        selectedSize ?? undefined
      );
      setToast({
        id: Date.now(),
        message: "Item added to cart!",
        type: "success",
      });
    } catch {
      setToast({
        id: Date.now(),
        message: "Failed to add item to cart.",
        type: "error",
      });
    }
  };

  if (loading)
    return (
      <div className="p-8">
        <LoadingSkeleton variant="detail" />
      </div>
    );

  if (error)
    return (
      <div role="alert" className="p-4 bg-red-100 text-black">
        {error}
      </div>
    );

  if (!product) return <div className="p-4">No product found.</div>;

  return (
    <main className="max-w-full px-6 py-8 text-white bg-[#0a0f1a] min-h-screen">
      {/* Back Button */}
      <Link
        to="/products"
        className="flex items-center text-sm mb-6 hover:underline"
      >
        <MdOutlineKeyboardArrowLeft className="w-4 h-4 mr-1" /> Back to the list
      </Link>

      {/* Product Detail Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-4">
        {/* Left: Product Image + Thumbnails */}
        <ProductImages product={product} />

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold tracking-wide mb-2">
            {product.title}
          </h1>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <p
              className={`text-sm font-semibold mb-4 ${
                product.stock > 0 ? "text-green-400" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? `In Stock` : "Out of Stock"}
            </p>
          )}

          <p className="text-gray-300 text-sm max-w-xl leading-relaxed">
            {product.description}
          </p>

          {/* Show selectors & Add to Cart ONLY if stock > 0 */}
          {product.stock && product.stock > 0 ? (
            <>
              {/* Size Selector */}
              {product.size && product.size.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-2">Size</h3>
                  <div className="flex items-center space-x-3">
                    {product.size.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${
                          selectedSize === size
                            ? "bg-white text-black"
                            : "bg-transparent border-gray-400 text-white hover:bg-gray-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-2">Color</h3>
                  <div className="flex items-center space-x-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${
                          selectedColor === color
                            ? "bg-white text-black"
                            : "bg-transparent border-gray-400 text-white hover:bg-gray-700"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 bg-gray-700 rounded-l hover:bg-gray-600"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 bg-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2 bg-gray-700 rounded-r hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                disabled={
                  (!!product.colors?.length && !selectedColor) ||
                  (!!product.size?.length && !selectedSize)
                }
                onClick={handleAddToCart}
                className="mt-8 w-full py-3 bg-amber-500 hover:bg-amber-400 rounded-lg text-lg font-medium disabled:opacity-50 flex items-center justify-center"
              >
                Add to cart
              </button>
            </>
          ) : (
            // Out of Stock Button
            <button
              disabled
              className="mt-8 w-full py-3 bg-gray-500 rounded-lg text-lg font-medium cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>

{/* Related Products */}
{related.length > 0 && (
  <section className="mt-16">
    <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
    <div className="flex gap-4">
      {related.map((p) => {
        const onSale = p.compare_price && p.compare_price > p.price;
        const discount =
          onSale &&
          Math.round(((p.compare_price! - p.price) / p.compare_price!) * 100);
        const isNew =
          p.create_at &&
          (() => {
            const createdDate = new Date(p.create_at);
            const now = new Date();
            const diffDays =
              (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays <= 30;
          })();

        return (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="block relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {/* Badges */}
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

            {/* Product Image */}
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-72 object-cover"
            />

            {/* Product Info */}
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
          </Link>
        );
      })}
    </div>
  </section>
)}


      {/* Toast */}
      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      )}
    </main>
  );
};

export default ProductDetail;
