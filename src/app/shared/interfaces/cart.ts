import firebase from 'firebase';
import { CartItem } from './cart-item';

export interface Cart {
  createdAt: firebase.firestore.Timestamp;
  lastUpdate: firebase.firestore.Timestamp;
  subtotal: number;
  items: CartItem[];
}