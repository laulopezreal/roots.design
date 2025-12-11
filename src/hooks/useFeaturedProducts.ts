import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from './useProducts';

export function useFeaturedProducts(limit: number = 4) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true);
        setError(null);

        if (!supabase) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const { data, error: queryError } = await supabase
          .from('products')
          .select('*, images:product_images(*)')
          .eq('featured', true)
          .eq('in_stock', true)
          .order('featured_rank', { ascending: true, nullsFirst: false })
          .limit(limit);

        if (queryError) throw queryError;

        setProducts(data as Product[] || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch featured products'));
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
}
