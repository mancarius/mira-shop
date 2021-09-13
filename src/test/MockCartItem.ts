import { CartItem } from 'src/app/shared/interfaces/cart-item';
import firebase from 'firebase';

export const MockCartItem: CartItem = {
  createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
  amount: 2,
  product: {
    id: 'FakeProductID',
  },
};