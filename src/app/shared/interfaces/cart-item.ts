import firebase from 'firebase';
import { Product } from "./product";

export interface CartItem {
  createdAt: firebase.firestore.Timestamp;
  amount: number;
  id: string;
  sku: Product['sku'];
  price: Product['price'];
  currency: Product['currency'];
};