import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import ProductImageGallery from './ProductImageGallery';
import RelatedProducts from './RelatedProducts';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useProduct } from '../hooks/useProduct';
import { useCart } from './cart/CartContext';
import { Minus, Plus, Package, Truck } from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id);
  const { addItem, enabled: cartEnabled } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleQuantityChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantity(Math.min(parsed, product?.inventory_count || 99));
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, product?.inventory_count || 99));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    if (!product || !cartEnabled) return;

    const primaryImage = product.images?.[0];
    addItem(
      {
        id: product.id,
        name: product.name,
        brand: product.brand || undefined,
        price: product.price,
        image: primaryImage ? {
          publicId: primaryImage.cloudinary_public_id,
          alt: primaryImage.alt_text || product.name,
          widths: primaryImage.widths,
          sizes: primaryImage.sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px',
        } : undefined,
      },
      quantity
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center py-16">
            <p className="text-gray-500">Loading product...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return <Navigate to="/" replace />;
  }

  const breadcrumbItems = [
    { label: 'Products', href: '/#collections' },
    { label: product.name },
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

        {/* Product Details */}
        <div className="px-4 md:px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ProductImageGallery
                  images={product.images || []}
                  productName={product.name}
                />
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {product.brand && (
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                    {product.brand}
                  </p>
                )}

                <h1 className="text-3xl md:text-4xl font-light text-gray-900">
                  {product.name}
                </h1>

                <p className="text-2xl font-light text-gray-900">
                  {currencyFormatter.format(product.price)}
                </p>

                {/* Stock status */}
                <div className="flex items-center gap-2 text-sm">
                  {product.in_stock ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-600">In Stock</span>
                      {product.inventory_count <= 5 && (
                        <span className="text-amber-600">
                          (Only {product.inventory_count} left)
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-gray-600">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Quantity selector and Add to Cart */}
                {cartEnabled && product.in_stock && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4">
                      <label htmlFor="quantity" className="text-sm text-gray-600">
                        Quantity
                      </label>
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="h-10 w-10"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id="quantity"
                          type="number"
                          min={1}
                          max={product.inventory_count}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(e.target.value)}
                          className="h-10 w-16 text-center border-0 focus-visible:ring-0"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={incrementQuantity}
                          disabled={quantity >= product.inventory_count}
                          className="h-10 w-10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      disabled={!product.in_stock}
                      className="w-full h-12 text-base"
                    >
                      {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                    </Button>
                  </div>
                )}

                {/* Product details */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  {product.designer && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 uppercase tracking-[0.2em]">
                        Designer
                      </h3>
                      <p className="mt-2 text-gray-600">{product.designer}</p>
                    </div>
                  )}

                  {product.category && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 uppercase tracking-[0.2em]">
                        Category
                      </h3>
                      <p className="mt-2 text-gray-600 capitalize">
                        {product.category.replace('_', ' ')}
                      </p>
                    </div>
                  )}

                  {product.collection && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 uppercase tracking-[0.2em]">
                        Collection
                      </h3>
                      <p className="mt-2 text-gray-600">{product.collection}</p>
                    </div>
                  )}

                  {product.finish && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 uppercase tracking-[0.2em]">
                        Finish
                      </h3>
                      <p className="mt-2 text-gray-600">{product.finish}</p>
                    </div>
                  )}

                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 uppercase tracking-[0.2em]">
                        Tags
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping info */}
                <div className="border-t border-gray-200 pt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Free Shipping
                      </h4>
                      <p className="text-sm text-gray-600">
                        On orders over $200
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Careful Packaging
                      </h4>
                      <p className="text-sm text-gray-600">
                        All items are carefully packaged for safe delivery
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
          brand={product.brand}
        />
      </main>
    </div>
  );
}
