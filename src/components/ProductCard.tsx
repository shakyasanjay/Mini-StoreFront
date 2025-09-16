import React from "react";
import type { Product } from "../types";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <article className="bg-white text-black rounded-md shadow-sm hover:shadow-md transition w-full">
      <Link to={`/product/${product.id}`} aria-label={`Open ${product.title}`}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-contain bg-white rounded-t"
        />
        <h3 className="mt-2 text-sm font-medium px-2 truncate">
          {product.title}
        </h3>
      </Link>
      <div className="mt-1 px-2 pb-3">
        <div className="text-base font-semibold">
          ${product.price.toFixed(2)}
        </div>
      </div>
    </article>
  );
};


export default ProductCard;
