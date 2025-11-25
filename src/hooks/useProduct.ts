import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from './useProducts';

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: queryError } = await supabase
          .from('products')
          .select('*, images:product_images(*)')
          .eq('id', id)
          .single();

        if (queryError) throw queryError;

        setProduct(data as Product);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch product'));
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
