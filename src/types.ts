export interface Product {
  id: string;
  title: string;
  price: number;
  compare_price: number;
  gender: string;
  description: string;
  category: string;
  image: string;
  variant_images: string[];
  colors?: string[];
  size?: string[];
  rating?: { rate: number; count: number };
  stock?: number;
  create_at: Date;
}

export interface CartLine{
    product: Product;
    qty: number;
    color?: string;
    size?: string;
}