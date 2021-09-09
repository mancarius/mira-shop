import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreStub } from 'src/test/AngularFirestoreStub/AngularFirestoreStub';
import { MockProduct } from 'src/test/MockProduct';
import { CategoryService } from './category.service';
import { ErrorHandlerService } from './error-handler.service';

import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let FirestoreStub: any;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useClass: AngularFirestoreStub },
        CategoryService,
        ErrorHandlerService,
      ],
    });
    
    service = TestBed.inject(ProductService);
    FirestoreStub = new AngularFirestoreStub();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#all should return all products', () => {});

  it('#get should return a product', () => {});

  it('#find should call the AngularFirestore methods #collection with param "products" and #data, and return an object', async () => {
    const fakeProductID = 'fakeProductID';
    spyOn(service['afs'], 'collection').and.callFake(FirestoreStub.collection);
    spyOn<any>(service['afs'], 'data').and.callFake(FirestoreStub.data);

    const response = await service.find(fakeProductID);
    
    expect<any>(service['afs'].collection).toHaveBeenCalledOnceWith('products');
    expect<any>(
      (await service['afs'].collection('products').doc(fakeProductID).ref.get())
        .data
    ).toHaveBeenCalledTimes(1);
    expect(typeof response).toBe('object');
  });
  
});