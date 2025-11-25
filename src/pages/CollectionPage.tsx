import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { useProducts } from '../hooks/useProducts';
import { useProductFilters } from '../hooks/useProductFilters';

export default function CollectionPage() {
  const { type, value } = useParams<{ type: string; value: string }>();
  const { filters, sort, updateFilters, updateSort, clearFilters, hasActiveFilters } =
    useProductFilters();

  // Override filters based on route params
  const routeFilters = { ...filters };
  if (type === 'category' && value) {
    routeFilters.category = value;
  } else if (type === 'brand' && value) {
    routeFilters.brand = value;
  } else if (type === 'collection' && value) {
    routeFilters.collection = value;
  }

  const { products, loading } = useProducts(routeFilters, sort);

  const getPageTitle = () => {
    if (type === 'category' && value) {
      return value.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }
    if (type === 'brand' && value) {
      return value;
    }
    if (type === 'collection' && value) {
      return value;
    }
    return 'All Products';
  };

  const breadcrumbItems = [
    { label: 'Products', href: '/#collections' },
    { label: getPageTitle() },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-16">
        {/* Breadcrumbs */}
        <div className="px-4 md:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>

        {/* Page Title and Search */}
        <div className="px-4 md:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900">
                {getPageTitle()}
              </h1>
              <SearchBar
                value={filters.search || ''}
                onChange={(value) => updateFilters({ search: value })}
                placeholder="Search products..."
                className="w-full md:max-w-md"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-8">
              {/* Desktop Filter Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={updateFilters}
                    onClearFilters={clearFilters}
                  />
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Mobile Filter Button */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden">
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[300px] overflow-y-auto">
                        <FilterSidebar
                          filters={filters}
                          onFilterChange={updateFilters}
                          onClearFilters={clearFilters}
                        />
                      </SheetContent>
                    </Sheet>

                    <p className="text-sm text-gray-600">
                      {loading ? 'Loading...' : `${products.length} products`}
                    </p>

                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs"
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>

                  <SortDropdown value={sort} onChange={updateSort} />
                </div>

                {/* Products Grid */}
                {loading ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 mb-4">No products found</p>
                    {hasActiveFilters && (
                      <Button onClick={clearFilters} variant="outline">
                        Clear filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {products.map((product) => {
                      const primaryImage = product.images?.[0];
                      return (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          brand={product.brand || undefined}
                          price={product.price}
                          image={
                            primaryImage
                              ? {
                                  publicId: primaryImage.cloudinary_public_id,
                                  alt: primaryImage.alt_text || product.name,
                                  widths: primaryImage.widths,
                                  sizes:
                                    primaryImage.sizes ||
                                    '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px',
                                }
                              : undefined
                          }
                        />
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
