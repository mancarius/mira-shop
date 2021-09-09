import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product';
import { MockProduct } from '../MockProduct';

@Injectable()
export class AngularFirestoreStub {
  public collection<T>(someString: string) {
    const _this = this;
    return { doc: _this.doc.bind(this) };
  }

  public query(someString: string) {
    const _this = this;
    return { doc: _this.doc.bind(this) };
  }

  public doc(someString: string) {
    const _this = this;
    return { ref: _this.ref };
  }

  public get ref() {
    const _this = this;
    return { get: _this.get.bind(this) };
  }

  public get() {
    const _this = this;
    return Promise.resolve({ data: _this.data });
  }

  data(): Product {
    return MockProduct;
  }

  public valueChanges<T>() {
    return of(MockProduct);
  }
}

// const AngularFirestoreStub = jasmine.createSpyObj('AngularFirestore', ['collection']);
// AngularFirestoreStub.collection.and.returnValues(jasmine.createSpyObj('collection', ['doc']));
// AngularFirestoreStub.collection().doc.and.returnValues(jasmine.createSpyObj('doc', ['ref']));
// AngularFirestoreStub.collection().doc().ref.and.returnValues(jasmine.createSpyObj('ref', ['get']));
// AngularFirestoreStub.collection().doc().ref.get.and.returnValues(jasmine.createSpyObj('get', ['data']));
// AngularFirestoreStub.collection().doc().ref.get().data().and.returnValues(Promise.resolve(MockProduct));

// export { AngularFirestoreStub };
