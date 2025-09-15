import type { Product } from "../types";
import mockProducts from "../data/mockProducts"; 

const useRemote = false;

export async function fetchProducts(): Promise<Product[]> {
  if (useRemote) {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      image: p.image,
      rating: p.rating,
      stock: Math.max(0, (p.rating?.count ?? 5) - 2),
    }));
  }

  await new Promise((r) => setTimeout(r, 600));
  return mockProducts;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id) ?? null;
}
