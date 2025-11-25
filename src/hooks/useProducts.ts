import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductImageRow = Database['public']['Tables']['product_images']['Row'];

export interface Product extends ProductRow {
  images: ProductImageRow[];
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  collection?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'created_at';
  order: 'asc' | 'desc';
}

export function useProducts(filters?: ProductFilters, sort?: ProductSort) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('products')
          .select('*, images:product_images(*)')
          .eq('in_stock', true); // Only show in-stock products by default

        // Apply filters
        if (filters?.category) {
          query = query.eq('category', filters.category);
        }
        if (filters?.brand) {
          query = query.eq('brand', filters.brand);
        }
        if (filters?.collection) {
          query = query.eq('collection', filters.collection);
        }
        if (filters?.tags && filters.tags.length > 0) {
          query = query.overlaps('tags', filters.tags);
        }
        if (filters?.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters?.maxPrice !== undefined) {
          query = query.lte('price', filters.maxPrice);
        }
        if (filters?.inStockOnly !== undefined) {
          query = query.eq('in_stock', filters.inStockOnly);
        }
        if (filters?.search) {
          query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,designer.ilike.%${filters.search}%`);
        }

        // Apply sorting
        if (sort) {
          query = query.order(sort.field, { ascending: sort.order === 'asc' });
        } else {
          // Default sort: featured first, then by name
          query = query.order('featured', { ascending: false })
            .order('featured_rank', { ascending: true, nullsFirst: false })
            .order('name', { ascending: true });
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        setProducts(data as Product[] || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [
    filters?.category,
    filters?.brand,
    filters?.collection,
    filters?.tags,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.inStockOnly,
    filters?.search,
    sort?.field,
    sort?.order,
  ]);

  return { products, loading, error };
}
