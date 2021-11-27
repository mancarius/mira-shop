import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { Category } from '../shared/interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private _afs: AngularFirestore) {}

  private _collectionRef = this._afs.collection<Category>('categories').ref;

  /**
   * Finds a category by name
   * @param name
   * @returns
   */
  async find(name: string): Promise<any> {
    try {
      const query = await this._collectionRef.where('name', '==', name).get();
      return this._mapDocsToStringArray(query.docs);
    } catch (error) {
      throw error;
    }
  }

  async all(): Promise<string[]> {
    try {
      const categoriesCollection = await this._collectionRef.get();
      return this._mapDocsToStringArray(categoriesCollection.docs);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Convert a document shapshot array to an array of category names
   * @param {QueryDocumentSnapshot<Category>[]} docs
   * @returns
   */
  private _mapDocsToStringArray(
    docs: firebase.firestore.QueryDocumentSnapshot<Category>[]
  ): Category["name"][] {
    return docs.map((doc) => doc.data().name);
  }
}
