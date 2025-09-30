import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface ProductCardProps {
  id?: string;
  name?: string;
  price?: number;
  imageUrl?: string;
  onQuickAdd?: () => void;
}

const ProductCard = ({
  id = "1",
  name = "Pendant Light",
  price = 299,
  imageUrl = "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
  onQuickAdd = () => console.log("Quick add clicked"),
}: ProductCardProps) => {
  return (
    <motion.div
      className="group relative w-full h-full bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay that appears on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick add button that appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <Button
            onClick={onQuickAdd}
            variant="outline"
            className="w-full bg-white hover:bg-gray-100 border-gray-200 text-gray-900 text-sm font-light"
          >
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="pt-4 pb-2 space-y-1 text-center">
        <h3 className="text-sm font-light text-gray-900">{name}</h3>
        <p className="text-sm font-light text-gray-700">${price}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
