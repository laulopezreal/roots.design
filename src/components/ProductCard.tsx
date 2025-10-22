import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface ProductCardProps {
  id?: string;
  name?: string;
  brand?: string;
  price?: number;
  image?: string;
  onQuickAdd?: () => void;
}

const ProductCard = ({
  id = "1",
  name = "Pendant Light",
  brand = "Roots Studio",
  price = 299,
  image = "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
  onQuickAdd = () => console.log("Quick add clicked"),
}: ProductCardProps) => {
  return (
    <motion.div
      className="group relative w-full h-full overflow-hidden bg-bed-linen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay that appears on hover */}
        <div className="absolute inset-0 bg-dark-chocolate/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Quick add button that appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <Button
            onClick={onQuickAdd}
            variant="outline"
            className="w-full border-vanilla-cream bg-bed-linen text-sm font-light text-dark-chocolate transition-colors hover:bg-vanilla-cream"
          >
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="pt-4 pb-2 space-y-1 text-center">
        {brand && (
          <p className="text-xs uppercase tracking-[0.2em] text-dark-chocolate/50">
            {brand}
          </p>
        )}
        <h3 className="text-sm font-light text-dark-chocolate">{name}</h3>
        <p className="text-sm font-light text-dark-chocolate/80">${price}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
