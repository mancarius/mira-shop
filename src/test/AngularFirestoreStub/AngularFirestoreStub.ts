import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class AngularFirestoreStub {
  private _values_to_return: any;

  constructor() {
  }

  public collection<T>(someString: string) {
    const _this = this;
    return { doc: _this.doc.bind(this), ref: _this.ref };
  }

  public query(someString: string) {
    const _this = this;
    return { doc: _this.doc.bind(this) };
  }

  public doc(someString: string): any {
    const _this = this;
    return { ref: _this.ref };
  }

  public get ref() {
    const _this = this;
    return {
      get: _this.get.bind(this),
      where: _this.where.bind(this),
      doc: _this.doc.bind(this)
    };
  }

  public get() {
    const _this = this;
    return Promise.resolve({
      data: _this.data.bind(this),
      docs: [this._values_to_return],
    });
  }

  public data(): any {
    return this._values_to_return;
  }

  public valueChanges<T>() {
    return of(this._values_to_return);
  }

  public where(a?: any, b?: any, c?: any) {
    const _this = this;
    return { get: _this.get.bind(this) };
  }

}

// const AngularFirestoreStub = jasmine.createSpyObj('AngularFirestore', ['collection']);
// AngularFirestoreStub.collection.and.returnValues(jasmine.createSpyObj('collection', ['doc']));
// AngularFirestoreStub.collection().doc.and.returnValues(jasmine.createSpyObj('doc', ['ref']));
// AngularFirestoreStub.collection().doc().ref.and.returnValues(jasmine.createSpyObj('ref', ['get']));
// AngularFirestoreStub.collection().doc().ref.get.and.returnValues(jasmine.createSpyObj('get', ['data']));
// AngularFirestoreStub.collection().doc().ref.get().data().and.returnValues(Promise.resolve(MockProduct));

// export { AngularFirestoreStub };
