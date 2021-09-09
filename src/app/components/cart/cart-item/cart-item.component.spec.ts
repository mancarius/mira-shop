import { SimpleChange } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { By } from '@angular/platform-browser';
import { ProductService } from 'src/app/services/product.service';
import { CartItem } from 'src/app/shared/interfaces/cart-item';
import { AngularFirestoreStub } from 'src/test/AngularFirestoreStub/AngularFirestoreStub';
import { MockCartItem } from 'src/test/MockCartItem';

import { CartItemComponent } from './cart-item.component';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useClass: AngularFirestoreStub},
        ProductService
      ],
      declarations: [ CartItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    let prev_item_value = undefined;
    let new_item_value = MockCartItem;
    let is_first_item_change: boolean = true;

    component.ngOnChanges({
      item: new SimpleChange(
        prev_item_value,
        new_item_value,
        is_first_item_change
      ),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('the element #product-amount-input should have the #amount value', async () => {
    // waiting for async rendering
    await fixture.whenStable();
    fixture.detectChanges();

    let elem = fixture.debugElement.nativeElement.querySelector(
      '#product-amount-input'
    );

    expect(elem.value).toBe(100);
    expect(elem.value == component.amount.value).toBeTruthy();
  });

  it('#_updateAmount should call #updateItem once', () => {
    spyOn(component['_cartService'], 'updateItem').and.stub();

    component['_updateAmount'](1);

    expect(component['_cartService'].updateItem).toHaveBeenCalledTimes(1);
  })
});
