import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useCart } from "./cart/CartContext";
import CloudinaryImage, { Props as CloudinaryImageProps } from "./CloudinaryImage";

interface ProductCardProps {
  id?: string;
  name?: string;
  brand?: string;
  designer?: string;
  price?: number;
  image?: CloudinaryImageProps;
  onQuickAdd?: () => void;
}

const ProductCard = ({
  id = "1",
  name = "Pendant Light",
  designer = "",
  brand = "Roots Studio",
  price = 299,
  image,
  onQuickAdd,
}: ProductCardProps) => {
  const { addItem, enabled: cartEnabled } = useCart();
  const productImage = image && image.publicId ? image : undefined;
  const imageAlt = productImage?.alt?.trim() ? productImage.alt : name;

  const handleQuickAdd = () => {
    if (!cartEnabled) {
      return;
    }

    if (onQuickAdd) {
      onQuickAdd();
      return;
    }

    if (!id) {
      return;
    }

    addItem({
      id,
      name,
      brand,
      price,
      image: productImage,
    });
  };

  return (
    <motion.div
      className="group relative w-full h-full bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        /> */}
        {productImage ? (
          <CloudinaryImage
            publicId={productImage.publicId}
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-full h-full bg-gray-100 transition-transform duration-700 group-hover:scale-105"
          />
        )}


        {/* Overlay that appears on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick add button that appears on hover */}
        {cartEnabled && (
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <Button
              onClick={handleQuickAdd}
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 border-gray-200 text-gray-900 text-sm font-light"
            >
              Quick Add
            </Button>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="pt-4 pb-2 space-y-1 text-center">
        {brand && (
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            {brand}
          </p>
        )}
        <h3 className="text-sm font-light text-gray-900">{name}</h3>
        <p className="text-sm font-light text-gray-700">${price}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
