import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ItemService } from './item.service';

@Injectable({
  providedIn: 'root',
})
export class ConsItemService extends ItemService {
  constructor(_afs: AngularFirestore) {
    super(_afs);
  }
}
