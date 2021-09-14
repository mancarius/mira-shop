import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import firebase from 'firebase';
import { ShippingType } from '../shared/interfaces/shipping-type';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private _shipmentsCollectionRef:
    | CollectionReference<ShippingType>
    | undefined;
  public favoriteShipmentType: ShippingType | undefined;

  constructor(private _afs: AngularFirestore, private _errorHandler: ErrorHandlerService) {
    try {
      this._shipmentsCollectionRef =
        this._afs.collection<ShippingType>('shipments').ref;
    } catch (err: any) {
      _errorHandler.add(err);
      console.error(err);
    }
  }

  /**
   * Return a promise that resolves to an array of available shipping types
   *
   * @returns
   */
  public async getAvailableShippingTypes(): Promise<ShippingType[]> {
    if (!this._shipmentsCollectionRef) {
      throw new Error('Unable to load shipping types');
    }

    let query: firebase.firestore.QuerySnapshot<ShippingType>;

    try {
      query = await this._shipmentsCollectionRef
        .where('is_available', '==', true)
        .get();
    } catch (err: any) {
      return Promise.reject(err);
    }

    return query.docs.map(
      (doc: firebase.firestore.QueryDocumentSnapshot<ShippingType>) => {
        return { ...doc?.data(), id: doc?.id };
      }
    );
  }

  public async getShipmentById(
    id: ShippingType['id']
  ): Promise<ShippingType | null> {
    if (!this._shipmentsCollectionRef) {
      throw new Error('Unable to load shipping types');
    }

    if (typeof id !== 'string' || id.length == 0) {
      throw new Error('The shipment id received is not a valid string.');
    }
    let doc: firebase.firestore.DocumentSnapshot<ShippingType>;
    try {
      doc = await this._shipmentsCollectionRef.doc(id).get();
    } catch (err: any) {
      throw err;
    }

    if (doc) {
      return { ...doc.data(), id: doc.id } as ShippingType;
    } else {
      return null;
    }
  }
}
