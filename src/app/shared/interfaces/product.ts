import firebase from "firebase";

export interface Product {
  categories: string[];
  description: string;
  image: string;
  is_available: boolean;
  name: string;
  price: number;
  currency: string;
  sku: string;
  created_at: firebase.firestore.Timestamp;
  id?: string;
}
