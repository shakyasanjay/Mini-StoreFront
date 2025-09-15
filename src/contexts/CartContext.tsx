import React, { createContext, useContext, useEffect, useState } from "react";
import type { CartLine, Product } from "../types";

interface CartContextValue {
  lines: CartLine[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQty: (productId: number, qty?: number) => void;
  total: number;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = "storefront_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines]);

  const addToCart = (product: Product, qty = 1) => {
    setLines((prev) => {
      const idx = prev.findIndex(
        (l: { product: { id: number } }) => l.product.id === product.id
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { product, qty }];
    });
  };

  const removeFromCart = (productId: number) => {
    setLines((p) => p.filter((l) => l.product.id !== productId));
  };

  const updateQty = (productId: number, qty?: number) => {
    if (!qty || qty <= 0) return removeFromCart(productId);
    setLines((prev) =>
      prev.map((l) => (l.product.id === productId ? { ...l, qty } : l))
    );
  };


  const clear = () => setLines([]);

  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  console.log(lines)

  return (
    <CartContext.Provider
      value={{ lines, addToCart, removeFromCart, updateQty, total, clear }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}