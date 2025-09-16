import { useState } from "react";
import { IoMdCart } from "react-icons/io";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import { NavLink, useLocation } from "react-router-dom";

const Header = () => {
  const { lines } = useCart();
  const loc = useLocation();
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-semibold font-serif italic">
          Mini-StoreFront
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <NavLink
            to="/men"
            className={`${loc.pathname.startsWith("/men") ? "underline" : ""}`}
          >
            MEN
          </NavLink>
          <NavLink
            to="/women"
            className={`${
              loc.pathname.startsWith("/women") ? "underline" : ""
            }`}
          >
            WOMEN
          </NavLink>
          <NavLink to="/products">All Products</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 text-xl">
          <FiUser className="cursor-pointer hidden md:block" />
          <NavLink to="/cart" className="relative">
            <IoMdCart className="text-2xl" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {count}
              </span>
            )}
          </NavLink>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-2 text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 px-6 py-4 flex flex-col gap-4">
          <NavLink
            to="/men"
            className={`${loc.pathname.startsWith("/men") ? "underline" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            MEN
          </NavLink>
          <NavLink
            to="/women"
            className={`${
              loc.pathname.startsWith("/women") ? "underline" : ""
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            WOMEN
          </NavLink>
          <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}>
            All Products
          </NavLink>
          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
            About
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default Header;
