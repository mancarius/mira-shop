import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CartItem } from '../shared/interfaces/cart-item';
import { AuthenticationService } from './authentication.service';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public items$: BehaviorSubject<CartItem[] | null> = new BehaviorSubject<
    CartItem[] | null
  >(null);
  public length$: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);
  private cartCollection: AngularFirestoreCollection<CartItem> | undefined;
  private collectionSubscription: Subscription | undefined;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthenticationService
  ) {
    this.auth.authState$.subscribe((user) => {
      console.log('CartService', 'authState', user);
      if (user) {
        this.cartCollection = this.afs.collection<CartItem>(
          'cart/' + user.uid + '/products/'
        );
        this.collectionSubscription = this.cartCollection
          .valueChanges({ idField: 'id' })
          .subscribe(
            (cart) => {
              this.items$.next(cart);
              this._refreshCartLength(cart);
            },
            (error) => console.log('error', error)
          );
      } else {
        this.collectionSubscription?.unsubscribe();
        this.items$.next(null);
        this._refreshCartLength(null);
      }
    });
  }

  private _refreshCartLength(items: CartItem[] | null): void {
    if (items && items.length) {
      let itemsAmount = items.reduce(
        (previous, current) => previous + current.amount,
        0
      );

      this.length$.next(Number(itemsAmount) || null);
    } else {
      this.length$.next(null);
    }
  }

  private async _addNewProduct(productID: string): Promise<void> {
    return this.cartCollection?.doc(productID).set({
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      amount: 1,
      product: '',
    });
  }

  public async updateItem(productID: string, newValue: Object): Promise<void> {
    if (this.cartCollection) {
      return this.cartCollection?.doc(productID).update(newValue);
    } else {
      return Promise.resolve();
    }
  }

  public async removeItem(productID: string): Promise<void> {
    return this.cartCollection?.doc(productID).delete();
  }

  public async addProduct(productID: string): Promise<void> {
    if (this.containProduct(productID)) {
      let currentProductAmount =
        this.items$.getValue()?.filter((o) => o.product.id === productID)?.[0]
          .amount ?? 0;
      if (currentProductAmount) {
        return this.updateItem(productID, {
          amount: currentProductAmount + 1,
        });
      } else {
        return this._addNewProduct(productID);
      }
    } else {
      return this._addNewProduct(productID);
    }
  }

  public containProduct(productID: string): boolean {
    return (
      this.items$
        .getValue()
        ?.some((item: CartItem) => item.product.id === productID) ?? false
    );
  }
}
