import { IoMdCart } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { lines } = useCart();
  const loc = useLocation();
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-semibold font-serif italic">
          allbirds
        </Link>

        {/* Center: Main Nav */}
        <nav className="flex items-center gap-8 font-medium text-sm">
          <Link
            to="/men"
            className={`${loc.pathname.startsWith("/men") ? "underline" : ""}`}
          >
            MEN
          </Link>
          <Link
            to="/women"
            className={`${
              loc.pathname.startsWith("/women") ? "underline" : ""
            }`}
          >
            WOMEN
          </Link>
        </nav>

        {/* Right: Secondary Nav + Icons */}
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/products">All Products</Link>
          <Link to="/about">About</Link>

          <div className="flex items-center gap-4 text-xl">
            <FiUser className="cursor-pointer" />
            <Link to="/cart" className="relative">
              <IoMdCart className="text-2xl" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
