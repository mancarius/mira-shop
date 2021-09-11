import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import firebase from 'firebase';
import { ShippingType } from '../shared/interfaces/shipping-type';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private shipmentsCollection: AngularFirestoreCollection<ShippingType>;

  constructor(private afs: AngularFirestore) {
    this.shipmentsCollection = this.afs.collection<ShippingType>('shipments');
  }

  public async getAvailableShippingTypes(): Promise<ShippingType[]> {
    let query: firebase.firestore.QuerySnapshot<ShippingType>;
    try {
      query = await this.shipmentsCollection.ref
        .where('is_available', '==', true)
        .get();
    } catch (err: any) {
      return Promise.reject(err.message ?? err);
    }

    return query.docs.map(
      (doc: firebase.firestore.QueryDocumentSnapshot<ShippingType>) => {
        return { ...doc.data(), id: doc.id };
      }
    );
  }
}
