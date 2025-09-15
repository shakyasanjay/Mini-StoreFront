import { useCart } from '../contexts/CartContext'
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const {lines} = useCart();
    const loc = useLocation();
    const count = lines.reduce((s, l) => s+ l.qty, 0);

  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Storefront
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm ${loc.pathname === "/" ? "underline" : ""}`}
          >
            Catalog
          </Link>
          <Link to="/cart" className="relative">
            Cart
            <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-gray-200 rounded">
              {count}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header
