import { Category } from "./category";

export interface Product {
    category: any;
    description: string;
    image: string;
    is_available: boolean;
    name: string;
    price: number;
    id: string;
}
