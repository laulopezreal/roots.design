import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  collection?: string;
  finish?: string;
  tags?: string[];
}

interface ProductGridProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
  id?: string;
  className?: string;
}

const PRICE_RANGES = [
  { id: "all", label: "All Prices" },
  { id: "under200", label: "Under $200", max: 199 },
  { id: "200to350", label: "$200 - $350", min: 200, max: 350 },
  { id: "350to500", label: "$350 - $500", min: 350, max: 500 },
  { id: "over500", label: "Over $500", min: 500 },
] as const;

const normalizeText = (value: string) =>
  value
    ? value
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/\s+/g, " ")
        .trim()
    : "";

const ProductGrid = ({
  products = [
    {
      id: "1",
      name: "Pendant Light",
      brand: "Roots Atelier",
      price: 249,
      image:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
      category: "pendant",
      collection: "Arc",
      finish: "Brushed Brass",
      tags: ["statement", "suspended"],
    },
    {
      id: "2",
      name: "Table Lamp",
      brand: "Foundry Co.",
      price: 189,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      category: "table",
      collection: "Lumen",
      finish: "Matte Opal",
      tags: ["desk", "task"],
    },
    {
      id: "3",
      name: "Floor Lamp",
      brand: "Roots Atelier",
      price: 329,
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80",
      category: "floor",
      collection: "Axis",
      finish: "Bronzed Steel",
      tags: ["ambient"],
    },
    {
      id: "4",
      name: "Wall Sconce",
      brand: "Lustre House",
      price: 159,
      image:
        "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80",
      category: "wall",
      collection: "Halo",
      finish: "Antique Brass",
      tags: ["accent", "pair"],
    },
    {
      id: "5",
      name: "Chandelier",
      brand: "Lustre House",
      price: 599,
      image:
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
      category: "chandelier",
      collection: "Celeste",
      finish: "Polished Nickel",
      tags: ["grand", "dining"],
    },
    {
      id: "6",
      name: "Desk Lamp",
      brand: "Foundry Co.",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1534105615256-13940a56ff44?w=800&q=80",
      category: "table",
      collection: "Lumen",
      finish: "Soft Black",
      tags: ["compact", "workspace"],
    },
    {
      id: "7",
      name: "Ceiling Light",
      brand: "Maison Arc",
      price: 279,
      image:
        "https://images.unsplash.com/photo-1551043077-643bc76c7583?w=800&q=80",
      category: "ceiling",
      collection: "Orbit",
      finish: "Frosted Glass",
      tags: ["flush mount"],
    },
    {
      id: "8",
      name: "Modern Pendant",
      brand: "Maison Arc",
      price: 349,
      image:
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80",
      category: "pendant",
      collection: "Arc",
      finish: "Matte Graphite",
      tags: ["linear", "modern"],
    },
  ],
  title = "Our Collection",
  subtitle = "Discover our curated selection of premium lighting solutions",
  id,
  className = "",
}: ProductGridProps) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Products" },
    { id: "pendant", name: "Pendant Lights" },
    { id: "table", name: "Table Lamps" },
    { id: "floor", name: "Floor Lamps" },
    { id: "wall", name: "Wall Lights" },
    { id: "chandelier", name: "Chandeliers" },
    { id: "ceiling", name: "Ceiling Lights" },
  ];

  const availableBrands = useMemo(() => {
    const uniqueBrands = new Set<string>();
    products.forEach((product) => {
      if (product.brand) {
        uniqueBrands.add(product.brand);
      }
    });
    return ["all", ...Array.from(uniqueBrands).sort()];
  }, [products]);

  const searchIndex = useMemo(() => {
    const index = new Map<string, string>();
    products.forEach((product) => {
      const searchableContent = [
        product.name,
        product.brand,
        product.category,
        product.collection,
        product.finish,
        ...(product.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ");

      index.set(product.id, normalizeText(searchableContent));
    });
    return index;
  }, [products]);

  const normalizedQuery = useMemo(() => normalizeText(searchQuery), [searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeFilter !== "all" && product.category !== activeFilter) {
        return false;
      }

      if (selectedBrand !== "all" && product.brand !== selectedBrand) {
        return false;
      }

      if (selectedPriceRange !== "all") {
        const priceRule = PRICE_RANGES.find((range) => range.id === selectedPriceRange);

        if (priceRule?.min !== undefined && product.price < priceRule.min) {
          return false;
        }

        if (priceRule?.max !== undefined && product.price > priceRule.max) {
          return false;
        }
      }

      if (normalizedQuery) {
        const searchable = searchIndex.get(product.id) ?? "";
        if (!searchable.includes(normalizedQuery)) {
          return false;
        }
      }

      return true;
    });
  }, [
    products,
    activeFilter,
    selectedBrand,
    selectedPriceRange,
    normalizedQuery,
    searchIndex,
  ]);

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
    <section
      id={id}
      className={`w-full py-16 px-4 md:px-8 lg:px-16 bg-white ${className}`.trim()}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, brand, or collection"
                className="w-full border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                aria-label="Search products"
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:justify-end">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-500">
                Brand
                <select
                  value={selectedBrand}
                  onChange={(event) => setSelectedBrand(event.target.value)}
                  className="border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                >
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand === "all" ? "All Brands" : brand}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-500">
                Price
                <select
                  value={selectedPriceRange}
                  onChange={(event) => setSelectedPriceRange(event.target.value)}
                  className="border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-4 py-2 text-sm transition-colors duration-300 ${
                  activeFilter === category.id
                    ? "text-black border-b border-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
          <span>{filteredProducts.length} designs</span>
          {(searchQuery || selectedBrand !== "all" || selectedPriceRange !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedBrand("all");
                setSelectedPriceRange("all");
              }}
              className="underline underline-offset-2 hover:text-gray-700"
            >
              Clear refinements
            </button>
          )}
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
              brand={product.brand}
              price={product.price}
              image={product.image}
            />
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No products match those filters just yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
