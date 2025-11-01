import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useCart } from "./cart/CartContext";

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
  onQuickAdd,
}: ProductCardProps) => {
  const { addItem } = useCart();

  const handleQuickAdd = () => {
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
      image,
    });
  };

  return (
    <motion.div
      className="group relative w-full h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-lg hover:ring-black/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay that appears on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Quick add button that appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <Button
            onClick={handleQuickAdd}
            variant="outline"
            className="w-full border-gray-200 bg-white text-sm font-light text-gray-900 shadow-sm transition-shadow hover:bg-gray-100 hover:shadow"
          >
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="space-y-1 px-6 pb-6 pt-4 text-center">
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
