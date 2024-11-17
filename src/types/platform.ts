export interface Platform {
  id: string;
  name: string;
  logo: string;
  isConnected: boolean;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
}

export interface ProductImage {
  file: File;
  preview: string;
  platformSpecificIds: Record<string, string>;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: ProductImage[];
  categories: Record<string, string[]>; // platformId -> categoryIds
  variants: ProductVariant[];
  platformSpecificData: Record<string, any>;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  attributes: Record<string, string>;
  stock: number;
}