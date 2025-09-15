import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

const CartPage = () => {
  const { lines, removeFromCart, total } = useCart();

  if (!lines.length)
    return <main className="p-8 text-center text-lg">Your Cart is empty</main>;

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
            {/* Product Image + Info wrapped in link */}
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

                {/* Show color and size in the same line */}
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
                onClick={() => removeFromCart(l.product.id, l.color, l.size)}
                className="text-sm text-red-600 hover:underline mt-4"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Total Box */}
      <div className="mt-8 border rounded p-4 bg-gray-800 flex justify-between items-center">
        <div className="text-sm text-gray-200">
          Your Total
          <br />
          <span className="text-xs">
            Shipping will be calculated in the next step
          </span>
        </div>
        <div className="text-lg font-bold">${total.toFixed(2)}</div>
      </div>

      {/* Checkout Button */}
      <div className="mt-8 flex justify-center">
        <button className="bg-amber-500 text-white px-8 py-3 rounded hover:bg-amber-400">
          Checkout
        </button>
      </div>
    </main>
  );
};

export default CartPage;
