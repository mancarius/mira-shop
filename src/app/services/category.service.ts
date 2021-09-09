import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../shared/interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private afs: AngularFirestore) { }

  find(id: string): Observable<any> {
    return this.afs.collection('category').doc('categoryId').snapshotChanges();
  }
}
