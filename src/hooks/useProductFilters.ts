import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ProductFilters, ProductSort } from './useProducts';

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo((): ProductFilters => {
    const filters: ProductFilters = {};

    const search = searchParams.get('search');
    if (search) filters.search = search;

    const category = searchParams.get('category');
    if (category) filters.category = category;

    const brand = searchParams.get('brand');
    if (brand) filters.brand = brand;

    const collection = searchParams.get('collection');
    if (collection) filters.collection = collection;

    const minPrice = searchParams.get('minPrice');
    if (minPrice) filters.minPrice = parseFloat(minPrice);

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

    const tags = searchParams.get('tags');
    if (tags) filters.tags = tags.split(',');

    const inStockOnly = searchParams.get('inStock');
    if (inStockOnly === 'true') filters.inStockOnly = true;

    return filters;
  }, [searchParams]);

  const sort = useMemo((): ProductSort | undefined => {
    const sortField = searchParams.get('sortBy') as ProductSort['field'] | null;
    const sortOrder = searchParams.get('sortOrder') as ProductSort['order'] | null;

    if (sortField && sortOrder) {
      return { field: sortField, order: sortOrder };
    }

    return undefined;
  }, [searchParams]);

  const updateFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','));
          } else {
            params.delete(key);
          }
        } else {
          params.set(key, String(value));
        }
      });

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const updateSort = useCallback(
    (newSort: ProductSort | null) => {
      const params = new URLSearchParams(searchParams);

      if (newSort) {
        params.set('sortBy', newSort.field);
        params.set('sortOrder', newSort.order);
      } else {
        params.delete('sortBy');
        params.delete('sortOrder');
      }

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search ||
      filters.category ||
      filters.brand ||
      filters.collection ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      (filters.tags && filters.tags.length > 0) ||
      filters.inStockOnly
    );
  }, [filters]);

  return {
    filters,
    sort,
    updateFilters,
    updateSort,
    clearFilters,
    hasActiveFilters,
  };
}
