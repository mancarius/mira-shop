import { CartItem } from 'src/app/shared/interfaces/cart-item';
import { MockProduct } from './MockProduct';

export const MockCartItem: CartItem = {
    createdAt: new Date,
    amount: 2,
    product: {
        id: 'FakeProductID',
    }
}