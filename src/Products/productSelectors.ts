import type { Product } from "./productProps";

const DEFAULT_FEATURED_LIMIT = 4;

export function getFeaturedProducts(
  products: Product[],
  limit: number = DEFAULT_FEATURED_LIMIT,
): Product[] {
  return products
    .filter((product) => product.featured)
    .sort((a, b) => {
      const rankA = a.featuredRank ?? Number.POSITIVE_INFINITY;
      const rankB = b.featuredRank ?? Number.POSITIVE_INFINITY;
      if (rankA === rankB) {
        return a.name.localeCompare(b.name);
      }
      return rankA - rankB;
    })
    .slice(0, limit);
}
