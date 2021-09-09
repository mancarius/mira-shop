import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireAuthStub } from 'src/test/AngularFireAuthStub/AngularFireAuthStub';
import { AngularFirestoreStub } from 'src/test/AngularFirestoreStub/AngularFirestoreStub';
import { AuthenticationService } from './authentication.service';

import { CartService } from './cart.service';
import { ProductService } from './product.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: AngularFirestoreStub },
        { provide: AngularFireAuth, useValue: AngularFireAuthStub },
        AuthenticationService,
        ProductService,
        MatSnackBar,
        Overlay
      ],
      imports: [NoopAnimationsModule],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#addItem should add a cart item in #localStorage.cart', () => {});

  it('#removeItem should remove a cart item from #localStorage.cart', () => {});

  it('#getItem should return a cart item from #localStorage.cart', () => {});

  it('#all should return all cart items from #localStorage.cart', () => {});

  it('#clear should clear all cart items in #localStorage.cart', () => {});

  it('#totalAmount should return the total cart amount', () => {});

  it('#itemsAmount should return the items cart amount', () => {});

});
