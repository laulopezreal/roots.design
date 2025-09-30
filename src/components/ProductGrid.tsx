import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductGridProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
}

const ProductGrid = ({
  products = [
    {
      id: "1",
      name: "Pendant Light",
      price: 249,
      image:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
      category: "pendant",
    },
    {
      id: "2",
      name: "Table Lamp",
      price: 189,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      category: "table",
    },
    {
      id: "3",
      name: "Floor Lamp",
      price: 329,
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80",
      category: "floor",
    },
    {
      id: "4",
      name: "Wall Sconce",
      price: 159,
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80",
      category: "wall",
    },
    {
      id: "5",
      name: "Chandelier",
      price: 599,
      image:
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
      category: "chandelier",
    },
    {
      id: "6",
      name: "Desk Lamp",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1534105615256-13940a56ff44?w=800&q=80",
      category: "table",
    },
    {
      id: "7",
      name: "Ceiling Light",
      price: 279,
      image:
        "https://images.unsplash.com/photo-1551043077-643bc76c7583?w=800&q=80",
      category: "ceiling",
    },
    {
      id: "8",
      name: "Modern Pendant",
      price: 349,
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80",
      category: "pendant",
    },
  ],
  title = "Our Collection",
  subtitle = "Discover our curated selection of premium lighting solutions",
}: ProductGridProps) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const categories = [
    { id: "all", name: "All Products" },
    { id: "pendant", name: "Pendant Lights" },
    { id: "table", name: "Table Lamps" },
    { id: "floor", name: "Floor Lamps" },
    { id: "wall", name: "Wall Lights" },
    { id: "chandelier", name: "Chandeliers" },
    { id: "ceiling", name: "Ceiling Lights" },
  ];

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === category),
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center mb-10 gap-2 md:gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterChange(category.id)}
              className={`px-4 py-2 text-sm transition-colors duration-300 ${activeFilter === category.id ? "text-black border-b border-black" : "text-gray-500 hover:text-black"}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
