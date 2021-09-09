import { CartItem } from '../interfaces/cart-item';

class Cart {
  cart: CartItem;

  constructor(params: CartItem) {
    this.cart = params;
  }

  toString(): string {
    return Object.values(this.cart).join(', ');
  }
}

export const CartConverter = {
  toFirestore: (cart: CartItem) => ({ ...cart }),
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return new Cart(data);
  },
};