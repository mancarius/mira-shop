import firebase from 'firebase';
import { Product } from "./product";

export interface CartItem {
  createdAt: firebase.firestore.Timestamp;
  amount: number;
  product: any;
};