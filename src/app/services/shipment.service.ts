import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  constructor(private afs: AngularFirestore) {}

  public get shippingTypes$(): any {
    return this.afs.collection('shipments').get().pipe(first());
  }
}
