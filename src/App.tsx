import About from "./components/About";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import CartPage from "./components/pages/CartPage";
import Catalog from "./components/pages/Catalog";
import ProductDetail from "./components/pages/ProductDetail";
import { CartProvider } from "./contexts/CartContext";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Catalog />} />
          <Route path="/men" element={<Catalog gender="male" />} />
          <Route path="/women" element={<Catalog gender="female" />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default App;
