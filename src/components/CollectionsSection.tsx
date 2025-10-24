import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  featured?: boolean;
}

interface CollectionsSectionProps {
  collections?: Collection[];
  title?: string;
  subtitle?: string;
}

const CollectionsSection = ({
  collections = [
    {
      id: "1",
      name: "Modern Minimalist",
      description: "Clean lines and geometric forms for contemporary spaces",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
      itemCount: 24,
      featured: true,
    },
    {
      id: "2",
      name: "Industrial Heritage",
      description: "Raw materials and vintage-inspired designs",
      image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80",
      itemCount: 18,
    },
    {
      id: "3",
      name: "Artisan Crafted",
      description: "Handmade pieces with unique character and soul",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      itemCount: 32,
    },
    {
      id: "4",
      name: "Luxury Crystal",
      description: "Elegant crystal fixtures for sophisticated interiors",
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
      itemCount: 15,
      featured: true,
    },
    {
      id: "5",
      name: "Outdoor Elements",
      description: "Weather-resistant lighting for exterior spaces",
      image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80",
      itemCount: 21,
    },
    {
      id: "6",
      name: "Smart Lighting",
      description: "Connected fixtures with intelligent controls",
      image: "https://images.unsplash.com/photo-1534105615256-13940a56ff44?w=800&q=80",
      itemCount: 28,
    },
  ],
  title = "Curated Collections",
  subtitle = "Discover our thoughtfully assembled lighting collections, each telling a unique design story",
}: CollectionsSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Collections Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              variants={itemVariants}
              className={`group h-full cursor-pointer ${
                collection.featured && index < 2 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-gray-50/90 shadow-sm transition-all duration-500 hover:border-gray-200 hover:shadow-lg">
                {/* Collection Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                  
                  {/* Featured Badge */}
                  {collection.featured && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-wide">
                      FEATURED
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Button
                      variant="outline"
                      className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                    >
                      Explore Collection
                    </Button>
                  </div>
                </div>

                {/* Collection Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-light tracking-tight group-hover:text-gray-600 transition-colors duration-300">
                      {collection.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {collection.itemCount} pieces
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {collection.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Collections CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
          >
            View All Collections
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CollectionsSection;