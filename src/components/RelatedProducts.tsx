import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';

interface RelatedProductsProps {
  currentProductId: string;
  category?: string | null;
  brand?: string | null;
}

export default function RelatedProducts({ currentProductId, category, brand }: RelatedProductsProps) {
  // Try to find products from same brand first, then same category
  const { products, loading } = useProducts(
    {
      ...(brand ? { brand } : category ? { category } : {}),
      limit: 5
    }
  );

  const relatedProducts = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (loading) {
    return (
      <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">
            Related Products
          </h2>
          <div className="text-center py-8 text-gray-500">
            Loading...
          </div>
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-light mb-8 text-center">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {relatedProducts.map((product, index) => {
            const primaryImage = product.images?.[0];
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  brand={product.brand || undefined}
                  price={product.price}
                  image={primaryImage ? {
                    publicId: primaryImage.cloudinary_public_id,
                    alt: primaryImage.alt_text || product.name,
                    widths: primaryImage.widths,
                    sizes: primaryImage.sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px',
                  } : undefined}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
