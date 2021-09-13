import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  CollectionReference,
} from '@angular/fire/firestore';
import firebase from 'firebase';
import { ShippingType } from '../shared/interfaces/shipping-type';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private shipmentsCollectionRef: CollectionReference<ShippingType>;
  public favoriteShipmentType: ShippingType | undefined;

  constructor(private afs: AngularFirestore) {
    this.shipmentsCollectionRef =
      this.afs.collection<ShippingType>('shipments').ref;
  }

  public async getAvailableShippingTypes(): Promise<ShippingType[]> {
    let query: firebase.firestore.QuerySnapshot<ShippingType>;
    try {
      query = await this.shipmentsCollectionRef
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

  public async getShipmentById(
    id: ShippingType['id']
  ): Promise<ShippingType | null> {
    const doc = await this.shipmentsCollectionRef.doc(id).get();
    if (doc?.id) {
      return { ...doc.data(), id: doc.id } as ShippingType;
    } else {
      return null;
    }
  }
}
