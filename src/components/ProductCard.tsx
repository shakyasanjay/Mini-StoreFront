import React from "react";
import type { Product } from "../types";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article className="border rounded p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`} aria-label={`Open ${product.title}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover rounded"
        />
        <h3 className="mt-2 text-sm font-medium">{product.title}</h3>
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-lg font-semibold">${product.price.toFixed(2)}</div>
        <div className="text-xs text-gray-500">{product.category}</div>
      </div>
    </article>
  );
};

export default ProductCard;
