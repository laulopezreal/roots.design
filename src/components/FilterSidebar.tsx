import { useEffect, useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import type { ProductFilters } from '../hooks/useProducts';
import { useProducts } from '../hooks/useProducts';

interface FilterSidebarProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) {
  // Fetch all products to get unique values for filters
  const { products } = useProducts();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 1000,
  ]);

  useEffect(() => {
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 1000]);
  }, [filters.minPrice, filters.maxPrice]);

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort() as string[];

  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean))
  ).sort() as string[];

  const collections = Array.from(
    new Set(products.map((p) => p.collection).filter(Boolean))
  ).sort() as string[];

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceCommit = () => {
    onFilterChange({
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < MAX_PRICE ? priceRange[1] : undefined,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-[0.2em]">
            Filters
          </h3>
          {(filters.category ||
            filters.brand ||
            filters.collection ||
            filters.minPrice ||
            filters.maxPrice) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Category</h4>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.category === category}
                  onCheckedChange={(checked) => {
                    onFilterChange({
                      category: checked ? category : undefined,
                    });
                  }}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="ml-2 text-sm text-gray-700 capitalize cursor-pointer"
                >
                  {category.replace('_', ' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Brand</h4>
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brand === brand}
                  onCheckedChange={(checked) => {
                    onFilterChange({
                      brand: checked ? brand : undefined,
                    });
                  }}
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collections */}
      {collections.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Collection</h4>
          <div className="space-y-3">
            {collections.map((collection) => (
              <div key={collection} className="flex items-center">
                <Checkbox
                  id={`collection-${collection}`}
                  checked={filters.collection === collection}
                  onCheckedChange={(checked) => {
                    onFilterChange({
                      collection: checked ? collection : undefined,
                    });
                  }}
                />
                <Label
                  htmlFor={`collection-${collection}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  {collection}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Price Range</h4>
        <div className="space-y-4">
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* In Stock Only */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center">
          <Checkbox
            id="inStock"
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => {
              onFilterChange({
                inStockOnly: checked ? true : undefined,
              });
            }}
          />
          <Label htmlFor="inStock" className="ml-2 text-sm text-gray-700 cursor-pointer">
            In Stock Only
          </Label>
        </div>
      </div>
    </div>
  );
}
