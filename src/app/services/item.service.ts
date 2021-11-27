import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { Product } from '../shared/interfaces/product';
import { Collections } from '../shared/enums/collections';
import { Category } from '../shared/interfaces/category';

interface QueryExtender {
  and: {
    startAt: (startAt: number) => any;
    maxResults: (maxResults: number) => any;
    orderByName: (direction?: firebase.firestore.OrderByDirection) => any;
    orderByPrice: (direction?: firebase.firestore.OrderByDirection) => any;
    whereNameContains: (text: string) => any;
    whereCategory: (name: string) => any;
    whereAvailable: () => any;
    whereNotAvailable: () => any;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  public items$: Observable<Product[]>;
  public length$: Observable<any>;
  private _categoryFilter$: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  private _nameFilter$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  private _isAvailableFilter$: BehaviorSubject<boolean | null> =
    new BehaviorSubject<boolean | null>(null);
  private _orderByNameFilter$: BehaviorSubject<
    undefined | firebase.firestore.OrderByDirection
  > = new BehaviorSubject<undefined | firebase.firestore.OrderByDirection>(
    undefined
  );
  private _orderByPriceFilter$: BehaviorSubject<
    undefined | firebase.firestore.OrderByDirection
  > = new BehaviorSubject<undefined | firebase.firestore.OrderByDirection>(
    undefined
  );
  private _limitFilter$: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(20);
  private _startFilter$: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(0);
  private _firestoreBatch = this._afs.firestore.batch();


  
  constructor(public _afs: AngularFirestore) {
    this.length$ = this._afs
      .collection(Collections.items)
      .doc('__length')
      .valueChanges();

    this.items$ = this._getFilters$().pipe(
      switchMap(
        ([
          category,
          name,
          is_available,
          orderby_name,
          orderby_price,
          limit,
          start,
        ]) =>
          this._afs
            .collection<Product>(Collections.items, (ref) => {
              let query:
                | firebase.firestore.CollectionReference
                | firebase.firestore.Query = ref;

              // exclude document "__length"
              query = query.where(
                firebase.firestore.FieldPath.documentId(),
                '!=',
                '__length'
              );

              if (category) {
                query = query.where('category', '==', category);
              }
              if (name) {
                query = query.where('name', '==', name);
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
            .pipe(
              map((items) => {
                // filter items with invalid values
                return items.filter((item) => {
                  const values = Object.values(item);
                  return !values.some((value) => value === null);
                });
              })
            )
      )
    );
  }

  /**
   *
   *
   * @private
   * @return {*}  {Observable<any[]>}
   * @memberof ItemService
   */
  private _getFilters$(): Observable<any[]> {
    return combineLatest([
      this._categoryFilter$,
      this._nameFilter$,
      this._isAvailableFilter$,
      this._orderByNameFilter$,
      this._orderByPriceFilter$,
      this._limitFilter$,
      this._startFilter$,
    ]);
  }

  /**
   *
   *
   * @param {number} startAt
   * @return {*}  {QueryExtender}
   * @memberof ItemService
   */
  public startAt(startAt: number): QueryExtender {
    this._startFilter$.next(startAt);
    return this._queryExtender;
  }

  /**
   *
   *
   * @param {number} maxResults
   * @return {*}  {QueryExtender}
   * @memberof ItemService
   */
  public maxResults(maxResults: number): QueryExtender {
    this._limitFilter$.next(maxResults);
    return this._queryExtender;
  }

  /**
   *
   *
   * @param {firebase.firestore.OrderByDirection} [direction='asc']
   * @return {*}  {QueryExtender}
   * @memberof ItemService
   */
  public orderByName(
    direction: firebase.firestore.OrderByDirection = 'asc'
  ): QueryExtender {
    this._orderByNameFilter$.next(direction);
    return this._queryExtender;
  }

  /**
   *
   *
   * @param {firebase.firestore.OrderByDirection} [direction='asc']
   * @return {*}  {QueryExtender}
   * @memberof ItemService
   */
  public orderByPrice(
    direction: firebase.firestore.OrderByDirection = 'asc'
  ): QueryExtender {
    this._orderByPriceFilter$.next(direction);
    return this._queryExtender;
  }

  /**
   *
   *
   * @param {string} text
   * @return {*}  {QueryExtender}
   * @memberof ItemService
   */
  public whereNameContains(text: string): QueryExtender {
    const keyword = text.length > 0 ? text : null;
    this._nameFilter$.next(keyword);
    return this._queryExtender;
  }

  /**
   *
   *
   * @param {Category['name']} name
   * @return {*}  {QueryExtender}
   * @memberof ItemService
   */
  public whereCategory(name: Category['name']): QueryExtender {
    this._categoryFilter$.next(name);
    return this._queryExtender;
  }

  /**
   *
   *
   * @return {*}  {QueryExtender}
   * @memberof ItemService
   */
  public whereAvailable(): QueryExtender {
    this._isAvailableFilter$.next(true);
    return this._queryExtender;
  }

  /**
   *
   *
   * @return {*}  {QueryExtender}
   * @memberof ItemService
   */
  public whereNotAvailable(): QueryExtender {
    this._isAvailableFilter$.next(false);
    return this._queryExtender;
  }

  /**
   *
   *
   * @readonly
   * @protected
   * @type {QueryExtender}
   * @memberof ItemService
   */
  protected get _queryExtender(): QueryExtender {
    return {
      and: {
        startAt: this.startAt,
        maxResults: this.maxResults,
        orderByName: this.orderByName,
        orderByPrice: this.orderByPrice,
        whereNameContains: this.whereNameContains,
        whereCategory: this.whereCategory,
        whereAvailable: this.whereAvailable,
        whereNotAvailable: this.whereNotAvailable,
      },
    };
  }

  /**
   * Returns the required product
   *
   * @param id {String} Product id
   * @returns Promise<Product | undefined>
   */
  public async findById(id: string): Promise<Product | null> {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new TypeError('Invalid ID received');
    }

    let product: firebase.firestore.DocumentSnapshot<Product>;

    try {
      product = await this._afs
        .collection<Product>(Collections.items)
        .doc(id)
        .ref.get();
    } catch (error: any) {
      throw error;
    }

    if (product.exists) {
      return { ...product.data(), id } as Product;
    } else {
      return null;
    }
  }

  /**
   * Returns a list of products matching the given name
   *
   * @param name
   * @returns
   */
  public async findByName(name: string): Promise<Product[]> {
    try {
      const query = await this._afs
        .collection<Product>(Collections.items)
        .ref.where('name', '==', name)
        .get();
      return query.docs.map((doc) => doc.data());
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }

  /**
   * Returns the required product
   *
   * @param sku {String} Product sku
   * @returns Promise<Product | undefined>
   */
  public async findBySku(sku: string): Promise<Product | null> {
    try {
      const query = await this._afs
        .collection<Product>(Collections.items)
        .ref.where('sku', '==', sku)
        .get();
      const doc = query.docs.shift();
      if (doc?.exists) {
        return { ...doc.data(), id: doc.id } as Product;
      } else {
        return null;
      }
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Delete te passed poduct ids
   *
   * @param {Product['id'][]} items An array of items id
   * @returns
   */
  public async delete(items: Product['id'][]): Promise<void> {
    items.forEach((id) => {
      const ref = this._afs.collection(Collections.items).doc(id).ref;
      this._firestoreBatch.delete(ref);
    });
    return this._firestoreBatch.commit();
  }

  /**
   * Create or replace an item. Return a promise that resolved once the data are written on the store. Return the item id
   * @param item
   * @returns
   */
  public async save(item: Product): Promise<Product['id']> {
    const { id: docId, ...itemWithoutId } = item;
    const collectionRef = this._afs.collection<Product>(Collections.items).ref;
    const isValidId = (await collectionRef.doc(docId).get()).exists;
    let docRef: firebase.firestore.DocumentReference<Product> | undefined;
    const created_at = firebase.firestore.Timestamp.now();

    if (isValidId) {
      docRef = collectionRef.doc(docId);
    } else {
      docRef = collectionRef.doc();
    }

    try {
      await docRef.set({ ...(itemWithoutId as Product), created_at });
    } catch (error) {
      throw error;
    }

    return docRef.id;
  }

  /**
   * Return a string with the format nn-ccc-ss
   *
   * @static
   * @param {string[]} categories
   * @param {string} name
   * @param {string} size
   * @return {*}  {string}
   * @memberof ItemService
   */
  public static generateSku(
    categories: string[],
    name: string,
    size: string
  ): string {
    const stringToCode = (text: string, length = 3): string => {
      const code: string = text
        .toLocaleLowerCase()
        .replace(/[\W_]+/g, '')
        .replace(/[aeiou]+/gi, '')
        .substr(0, length);
      return code;
    };

    const sku = [
      stringToCode(name, 2),
      stringToCode(categories.join(''), 3),
      size,
    ];

    return sku.join('-').toLocaleLowerCase();
  }
}
