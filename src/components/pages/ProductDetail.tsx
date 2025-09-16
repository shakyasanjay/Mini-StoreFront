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

  //  Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetchProductById(id)
      .then((p) => {
        if (!p) throw new Error("Product not found");
        setProduct(p);

        // Fetch related products
        return fetchProducts().then((all) =>
          all
            .filter((x) => x.category === p.category && x.id !== p.id)
            .slice(0, 3)
        );
      })
      .then((relatedProducts) => setRelated(relatedProducts))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  //  Handle Add to Cart with toast
  const handleAddToCart = () => {
    try {
      addToCart(
        product!,
        quantity,
        selectedColor ?? undefined,
        selectedSize ?? undefined
      );
      setToastType("success");
      setToastMessage("Item added to cart!");
    } catch {
      setToastType("error");
      setToastMessage("Failed to add item to cart.");
    }
  };

  if (loading)
    return (
      <div className="p-8">
        <LoadingSkeleton />
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
    <main className="w-full px-6 py-8 text-white bg-[#0a0f1a] min-h-screen">
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
              {product.stock > 0
                ? `In Stock`
                : "Out of Stock"}
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
                className="mt-8 w-full py-3 bg-green-500 hover:bg-green-400 rounded-lg text-lg font-medium disabled:opacity-50 flex items-center justify-center"
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
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {related.map((item) => (
              <div
                key={item.id}
                className="min-w-[220px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0"
              >
                <Link to={`/products/${item.id}`} className="block">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">${item.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/*  Toast component */}
      <Toast message={toastMessage ?? ""} type={toastType} />
    </main>
  );
};

export default ProductDetail;
