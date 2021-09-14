import { ErrorHandler, Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Category } from '../shared/interfaces/category';
import { Product } from '../shared/interfaces/product';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public items$: Observable<Product[]>;
  private _categoryFilter$: BehaviorSubject<string | null>;
  private _isAvailableFilter$: BehaviorSubject<boolean | null>;
  private _orderByNameFilter$: BehaviorSubject<
    undefined | firebase.firestore.OrderByDirection
  >;
  private _orderByPriceFilter$: BehaviorSubject<
    undefined | firebase.firestore.OrderByDirection
  >;
  private _limitFilter$: BehaviorSubject<number | null>;
  private _startFilter$: BehaviorSubject<number | null>;

  constructor(
    private afs: AngularFirestore,
    private errorHandler: ErrorHandler
  ) {
    this._categoryFilter$ = new BehaviorSubject<string | null>(null);
    this._isAvailableFilter$ = new BehaviorSubject<boolean | null>(null);
    this._orderByNameFilter$ = new BehaviorSubject<
      undefined | firebase.firestore.OrderByDirection
    >(undefined);
    this._orderByPriceFilter$ = new BehaviorSubject<
      undefined | firebase.firestore.OrderByDirection
    >(undefined);
    this._limitFilter$ = new BehaviorSubject<number | null>(20);
    this._startFilter$ = new BehaviorSubject<number | null>(0);

    this.items$ = this._getFilters$().pipe(
      switchMap(
        ([category, is_available, orderby_name, orderby_price, limit, start]) =>
          this.afs
            .collection<Product>('products', (ref) => {
              let query:
                | firebase.firestore.CollectionReference
                | firebase.firestore.Query = ref;
              if (category) {
                query = query.where('category', '==', category);
              }
              if (is_available !== null) {
                query = query.where('is_available', '==', is_available);
              }
              if (orderby_name !== undefined) {
                query = query.orderBy('name', orderby_name);
              }
              if (orderby_price !== undefined) {
                query = query.orderBy('price', orderby_price);
              }
              if (limit !== null) {
                query = query.limit(limit);
              }
              if (start) {
                query = query.startAt(start);
              }
              return query;
            })
            .valueChanges({ idField: 'id' })
      )
    );
  }

  private _getFilters$(): Observable<any[]> {
    return combineLatest([
      this._categoryFilter$,
      this._isAvailableFilter$,
      this._orderByNameFilter$,
      this._orderByPriceFilter$,
      this._limitFilter$,
      this._startFilter$,
    ]);
  }

  public startAt(startAt: number): void {
    this._startFilter$.next(startAt);
  }

  public maxResults(maxResults: number): void {
    this._limitFilter$.next(maxResults);
  }

  public orderByName(
    direction: firebase.firestore.OrderByDirection = 'asc'
  ): void {
    this._orderByNameFilter$.next(direction);
  }

  public orderByPrice(
    direction: firebase.firestore.OrderByDirection = 'asc'
  ): void {
    this._orderByPriceFilter$.next(direction);
  }

  public whereCategory(categoryId: Category['id']): void {
    this._categoryFilter$.next(categoryId);
  }

  public whereAvailable(): void {
    this._isAvailableFilter$.next(true);
  }

  public whereNotAvailable(): void {
    this._isAvailableFilter$.next(false);
  }

  /**
   * Returns the required product
   *
   * @param id {String} Product id
   * @returns Promise<Product | undefined>
   */
  public async find(id: string): Promise<Product | undefined> {
    try {
      let product = await this.afs
        .collection<Product>('products')
        .doc(id)
        .ref.get();
      return product.data();
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }
}
