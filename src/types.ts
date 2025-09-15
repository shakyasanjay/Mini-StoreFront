export interface Product{
    id: number;
    title: string;
    price: number;
    compare_price: number;
    gender: string;
    description: string;
    category: string;
    image: string;
    colors?: string[];
    sizes?: string[];
    rating?: {rate: number; count: number};
    stock?: number;
}

export interface CartLine{
    product: Product;
    qty: number;
}