import { Product as ProductInterface } from '../interfaces/product';

class Product {
  product: ProductInterface;

  constructor(params: ProductInterface) {
    this.product = params;
  }

  toString(): string {
    return Object.values(this.product).join(',');
  }
}

export const ProductConverter = {
  toFirestore: (product: ProductInterface) => ({ ...product }),
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return new Product(data);
  },
};
