import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import Toast from "../Toast";
import { GiShoppingBag } from "react-icons/gi";

const CartPage = () => {
  const { lines, removeFromCart, total } = useCart();
  const [toast, setToast] = useState<string>("");

  const salesTaxRate = 0.06;
  const salesTax = total * salesTaxRate;
  const shipping = 0;

  const handleRemove = (id: number, color?: string, size?: string) => {
    removeFromCart(id, color, size);
    setToast("Item removed from cart");
    setTimeout(() => setToast(""), 5000);
  };

  // ✅ Show nice empty cart screen when no items
  if (!lines.length)
    return (
      <main className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-300">
        <GiShoppingBag  className="w-16 h-16 mb-4 opacity-70" />
        <p className="text-lg font-medium">No items in cart</p>
        <Link
          to="/products"
          className="mt-6 bg-amber-500 text-white px-6 py-3 rounded rounded-2xl hover:bg-amber-400"
        >
          Continue Shopping
        </Link>
      </main>
    );

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

      {/* Cart Items */}
      <ul className="space-y-6">
        {lines.map((l) => (
          <li
            key={`${l.product.id}-${l.color ?? "default"}-${
              l.size ?? "default"
            }`}
            className="flex items-start justify-between border-b pb-6 last:border-b-0"
          >
            {/* Product Image + Info */}
            <Link
              to={`/products/${l.product.id}`}
              className="flex flex-1 items-start hover:opacity-90"
            >
              <img
                src={l.product.image}
                alt={l.product.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1 px-4">
                <div className="font-medium text-lg">{l.product.title}</div>

                {(l.color || l.size) && (
                  <div className="text-sm text-gray-600">
                    {l.color && (
                      <span>
                        Color: <span className="font-medium">{l.color}</span>
                      </span>
                    )}
                    {l.color && l.size && <span>, </span>}
                    {l.size && (
                      <span>
                        Size: <span className="font-medium">{l.size}</span>
                      </span>
                    )}
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  {l.product.category}
                </div>
                <div className="mt-2 text-sm font-semibold">Qty: {l.qty}</div>
              </div>
            </Link>

            {/* Product Price + Remove */}
            <div className="text-right">
              <div className="text-lg font-semibold">
                ${(l.product.price * l.qty).toFixed(2)}
              </div>
              <button
                onClick={() => handleRemove(l.product.id, l.color, l.size)}
                className="text-sm text-red-600 hover:underline mt-4 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Total Summary Box */}
      <div className="mt-8 border rounded p-6 bg-gray-800 text-gray-100">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Sales Tax</span>
          <span>${salesTax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span className="text-gray-400 text-sm">Calculated at checkout</span>
        </div>

        <hr className="my-3 border-gray-700" />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${(total + salesTax + shipping).toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-8 flex justify-center">
        <button className="bg-amber-500 text-white px-8 py-3 rounded hover:bg-amber-400">
          Checkout
        </button>
      </div>

      {/* Toast */}
      <Toast message={toast} />
    </main>
  );
};

export default CartPage;
