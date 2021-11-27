import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Collections } from '../shared/enums/collections';
import { Cart } from '../shared/interfaces/cart';
import { ErrorHandlerService } from './error-handler.service';
import firebase from 'firebase/app';
import * as _ from 'lodash';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class CartRemoteService {
  public cart$: ReplaySubject<Cart | null> = new ReplaySubject(1);
  private _lastValueChanges: Cart | null | undefined;
  private _collection: AngularFirestoreCollection<Cart>;
  private _cartDoc: AngularFirestoreDocument<Cart> | undefined;
  private _unsubscribe$ = new Subject();

  constructor(
    private _afs: AngularFirestore,
    private _error: ErrorHandlerService
  ) {
    this._collection = this._afs.collection<Cart>(Collections.carts);
  }

  public async init(docId: string): Promise<void> {
    this._cartDoc = this._collection.doc(docId);
    this._subscribeToDocument(this._cartDoc);
  }

  /**
   *
   *
   * @private
   * @memberof CartRemoteService
   */
  private _subscribeToDocument(doc: AngularFirestoreDocument<Cart>) {
    doc
      .valueChanges()
      .pipe(
        takeUntil(this._unsubscribe$),
        map((data) => (data === undefined ? null : data)),
        filter((data) => this._isChanged(data)),
        map((data) => {
          this._lastValueChanges = data;
          return data;
        })
      )
      .subscribe(this.cart$);
  }

  /**
   *
   *
   * @private
   * @memberof CartService
   */
  private async _create(cart: Cart): Promise<void> {
    const createdAt = firebase.firestore.Timestamp.now();
    return this._cartDoc?.ref?.set({ ...cart, createdAt });
  }

  /**
   *
   *
   * @private
   * @param {Partial<Cart>} value
   * @return {*}  {Promise<void>}
   * @memberof CartRemoteService
   */
  private async _update(value: Partial<Cart>): Promise<void> {
    return this._cartDoc?.ref?.update({ ...value });
  }

  /**
   *
   *
   * @private
   * @param {Cart} value
   * @return {*}
   * @memberof CartRemoteService
   */
  public async update(value: Cart | null): Promise<void> {
    const doc = this._cartDoc;

    if (doc) {
      const exists = (await doc.ref.get()).exists;
      if (!exists) {
        return !!value ? this._create(value) : undefined;
      } else if (!value) {
        return this._delete();
      } else {
        return this._update(value);
      }
    } else {
      throw new Error('Service not initialized');
    }
  }

  /**
   *
   *
   * @return {*}  {Promise<void>}
   * @memberof CartService
   */
  private async _delete(): Promise<void> {
    return this._update({ subtotal: 0, items: [] });
  }

  /**
   *
   *
   * @private
   * @param {(Cart | null)} cart
   * @return {*}  {boolean}
   * @memberof CartRemoteService
   */
  private _isChanged(cart: Cart | null): boolean {
    return CartService._isChanged(this._lastValueChanges, cart);
  }

  /**
   *
   *
   * @memberof CartRemoteService
   */
  public destroy() {
    this._unsubscribe$.next();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this.cart$.complete();
  }
}
