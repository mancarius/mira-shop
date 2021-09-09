import { ErrorHandler, Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Category } from '../shared/interfaces/category';
import { Product } from '../shared/interfaces/product';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  items$: Observable<Product[]>;
  private categoryFilter$: BehaviorSubject<string|null>;
  private isAvailableFilter$: BehaviorSubject<boolean|null>;
  private orderByNameFilter$: BehaviorSubject<undefined | firebase.firestore.OrderByDirection>;
  private orderByPriceFilter$: BehaviorSubject<undefined | firebase.firestore.OrderByDirection>;
  private limitFilter$: BehaviorSubject<number|null>;
  private startFilter$: BehaviorSubject<number|null>;

  constructor(private afs: AngularFirestore, private errorHandler: ErrorHandler) {
    this.categoryFilter$ = new BehaviorSubject<string|null>(null);
    this.isAvailableFilter$ = new BehaviorSubject<boolean|null>(null);
    this.orderByNameFilter$ = new BehaviorSubject<undefined | firebase.firestore.OrderByDirection>(undefined);
    this.orderByPriceFilter$ = new BehaviorSubject<undefined | firebase.firestore.OrderByDirection>(undefined);
    this.limitFilter$ = new BehaviorSubject<number|null>(20);
    this.startFilter$ = new BehaviorSubject<number|null>(0);

    this.items$ = this.getFilters$().pipe(
      switchMap(([category, is_available, orderby_name, orderby_price, limit, start]) => 
        this.afs.collection<Product>('products', ref => {
          let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
          if (category) { query = query.where('category', "==", category) };
          if (is_available !== null) { query = query.where('is_available', "==", is_available) };
          if (orderby_name !== undefined) { query = query.orderBy('name', orderby_name) }
          if (orderby_price !== undefined) { query = query.orderBy('price', orderby_price) }
          if (limit !== null) { query = query.limit(limit) }
          if (start) { query = query.startAt(start) }
          return query;
        }).valueChanges({idField: 'id'})
      )
    );
  }

  getFilters$(): Observable<any[]> {
    return combineLatest([
      this.categoryFilter$,
      this.isAvailableFilter$,
      this.orderByNameFilter$,
      this.orderByPriceFilter$,
      this.limitFilter$,
      this.startFilter$,
    ]);
  }

  startAt(startAt: number): void  {  
    this.startFilter$.next(startAt);
  }

  maxResults(maxResults: number): void {
    this.limitFilter$.next(maxResults);
  }

  orderByName(direction:firebase.firestore.OrderByDirection = 'asc'): void {
    this.orderByNameFilter$.next(direction);
  }

  orderByPrice(direction:firebase.firestore.OrderByDirection = 'asc'): void {
    this.orderByPriceFilter$.next(direction);
  }

  whereCategory(categoryId: string): void {
    this.categoryFilter$.next(categoryId);
  }

  whereAvailable(): void {
    this.isAvailableFilter$.next(true);
  }

  whereNotAvailable(): void {
    this.isAvailableFilter$.next(false);
  }

  /**
   * Returns the required product
   * 
   * @param id {String} Product id
   * @returns Promise<Product | undefined>
   */
  public async find(id: string): Promise<Product | undefined> {
    try {
      let product = await this.afs.collection<Product>('products').doc(id).ref.get();
      return product.data();
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }

}