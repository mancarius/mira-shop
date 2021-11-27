import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CartItem } from '../shared/interfaces/cart-item';
import { Order } from '../shared/interfaces/order';
import { OrderItem } from '../shared/interfaces/order-item';
import { ShippingAddress } from '../shared/interfaces/shipping-address';
import { ShippingType } from '../shared/interfaces/shipping-type';
import firebase from 'firebase';
import { Collections } from '../shared/enums/collections';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _order: Partial<Order> = {};
  private _orderId: string | null = null;

  constructor(private _afs: AngularFirestore) {}

  /**
   *
   *
   * @private
   * @param {CartItem[]} items
   * @memberof OrderService
   */
  private _setItems(items: CartItem[]) {
    try {
      this._validateItems(items);
    } catch (error) {
      throw error;
    }

    const orderItems: OrderItem[] = items.map<OrderItem>((item: CartItem) => {
      return {
        sku: item.sku,
        quantity: item.amount,
        price: item.price,
        total: item.price * item.amount,
      };
    });
    this._order = { ...this._order, items: orderItems };
  }

  /**
   * return void if success, error if fails
   *
   * @private
   * @param {CartItem[]} items
   * @memberof OrderService
   */
  private _validateItems(items: CartItem[]) {
    if (typeof items !== 'object') {
      throw new TypeError('Expected an object but received ' + typeof items);
    } else if (items.length === 0) {
      throw new Error('At least one item required');
    }
  }

  /**
   *
   *
   * @readonly
   * @type {OrderItem[]}
   * @memberof OrderService
   */
  public get items(): OrderItem[] {
    return this._order.items ?? [];
  }

  /**
   *
   *
   * @private
   * @param {ShippingType} shipment
   * @memberof OrderService
   */
  private _setShipment(shipment: ShippingType) {
    try {
      this._validateShipment(shipment);
    } catch (error) {
      throw error;
    }

    const orderShipment: Partial<Order['shipping']> = {
      type: shipment.name,
      cost: shipment.price,
    };
    this._order.shipping = {
      ...this._order.shipping,
      ...(orderShipment as Order['shipping']),
    };
  }

  /**
   * return void if success, error if fails
   *
   * @private
   * @param {ShippingType} shipment
   * @memberof OrderService
   */
  private _validateShipment(shipment: ShippingType): void {
    const invalidName = shipment.name?.length ? false : true;
    const invalidPrice = Number(shipment.price) ? false : true;

    if (typeof shipment !== 'object') {
      throw new TypeError('Expected an object but received ' + typeof shipment);
    } else if (invalidName) {
      throw new Error('Shipping name is invalid or miss');
    } else if (invalidPrice) {
      throw new Error('Shipping price is invalid or miss');
    }
  }

  /**
   *
   *
   * @readonly
   * @type {Partial<Order['shipping']>}
   * @memberof OrderService
   */
  public get shipment(): { type: string; cost: number } | null {
    if (this._order.shipping === undefined) {
      return null;
    }
    const { type, cost } = this._order.shipping;
    return { type, cost };
  }

  /**
   *
   *
   * @private
   * @param {ShippingAddress} address
   * @memberof OrderService
   */
  private _setAddress(address: ShippingAddress): void {
    try {
      this._validateAddress(address);
    } catch (error) {
      throw error;
    }

    this._order.shipping = {
      ...(this._order.shipping as Order['shipping']),
      address,
    };
  }

  /**
   *
   *
   * @private
   * @param {ShippingAddress} address
   * @memberof OrderService
   */
  private _validateAddress(address: ShippingAddress): void {
    const objValues = Object.values(address);
    const existInvalidValue = objValues.some((value) => {
      const invalidString = typeof value !== 'string' || value.length === 0;
      const invalidNumber = isNaN(value);
      return invalidString && invalidNumber;
    });

    if (existInvalidValue) {
      throw new TypeError('Address has invalid values');
    }
  }

  /**
   *
   *
   * @readonly
   * @type {(ShippingAddress | null)}
   * @memberof OrderService
   */
  public get address(): ShippingAddress | null {
    return this._order.shipping?.address ?? null;
  }

  /**
   *
   *
   * @private
   * @param {string} id
   * @memberof OrderService
   */
  private _setCustomer(id: string): void {
    if (typeof id !== 'string' || isNaN.length === 0) {
      throw new TypeError(
        'Expected a string but found ' + typeof this._orderId + '. (customerId)'
      );
    }

    this._order.customerId = id;
  }

  public get itemsTotalCost(): number {
    return this._order.items?.reduce<number>((total: number, item: OrderItem) => {
      return total + Number(item.total);
    }, 0) ?? 0;
  }

  public get shippingCost(): number {
    return Number(this._order.shipping?.cost ?? 0)
  }

  private _getTotal(): number {
    return this.shippingCost + this.itemsTotalCost;
  }

  /**
   *
   *
   * @param {*} order
   * @return {*}  {Promise<void>}
   * @memberof OrderService
   */
  public create(order: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const { customer, items, shipment, address } = order;
      try {
        this._setCustomer(customer);
        this._setItems(items);
        this._setShipment(shipment);
        this._setAddress(address);
        this._order.totalCost = this._getTotal();
        this._orderId = this._afs.createId();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   *
   *
   * @return {*}  {Promise<void>}
   * @memberof OrderService
   */
  public save(): Promise<void> {
    if (typeof this._orderId !== 'string') {
      throw new TypeError(
        'Expected a string but found ' + typeof this._orderId + '. (orderId)'
      );
    }

    return this._afs
      .collection(Collections.orders)
      .doc<Order>(this._orderId)
      .set({
        ...(this._order as Order),
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      });
  }
}
