import { useState } from "react";
import type { Product } from "../types";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const ProductImages = ({ product }: { product: Product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.variant_images ?? [
    product.image ?? "/images/placeholder.png",
  ];

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Main Image */}
      <div className="relative w-full max-w-[600px] sm:max-w-full md:max-w-[480px] lg:max-w-[600px] overflow-hidden rounded">
        <img
          src={images[currentImageIndex]}
          alt={product.title}
          className="w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[500px] object-contain rounded transition-all duration-300"
        />

        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/50 p-2 rounded-full hover:bg-gray-700 text-white text-2xl sm:text-3xl transition-colors duration-200"
          >
            <MdOutlineKeyboardArrowLeft />
          </button>
        )}

        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/50 p-2 rounded-full hover:bg-gray-700 text-white text-2xl sm:text-3xl transition-colors duration-200"
          >
            <MdOutlineKeyboardArrowRight />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 sm:space-x-3 mt-4 overflow-x-auto px-2 sm:px-0">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.title} ${i + 1}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 object-cover rounded cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                i === currentImageIndex ? "border-white" : "border-transparent"
              }`}
              onClick={() => setCurrentImageIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
