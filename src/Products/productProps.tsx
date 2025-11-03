import type { Props as CloudinaryImageProps } from "../components/CloudinaryImage";

export interface Product {
  id: string;
  name: string;
  brand: string;
  designer: string;
  price: number;
  image?: CloudinaryImageProps;
  category: string;
  collection?: string;
  finish?: string;
  tags?: string[];
  featured?: boolean;
  featuredRank?: number;
}
