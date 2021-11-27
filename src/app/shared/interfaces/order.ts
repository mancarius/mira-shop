import { OrderItem } from "./order-item";
import { ShippingAddress } from "./shipping-address";
import firebase from 'firebase';

export interface Order {
  customerId: string;
  createdAt: firebase.firestore.Timestamp;
  currency: string;
  totalCost: number;
  items: OrderItem[];
  shipping: {
    address: ShippingAddress;
    type: string;
    cost: number;
  };
}
