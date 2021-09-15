import { Overlay } from '@angular/cdk/overlay';
import { SimpleChange } from '@angular/core';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CartService } from 'src/app/services/cart.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProductService } from 'src/app/services/product.service';
import { MockCartItem } from 'src/test/MockCartItem';

import { CartItemComponent } from './cart-item.component';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: { find: () => {} } },
        { provide: CartService, useValue: { updateItem: () => {} } },
        { provide: ErrorHandlerService, useValue: { add: () => {} } },
        { provide: MatDialog, useValue: { open : () => {} } },
      ],
      imports: [NoopAnimationsModule],
      declarations: [CartItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    spyOn(component['_product'], 'find').and.resolveTo(MockCartItem.product);
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

    expect(elem.value).toBe(MockCartItem.amount);
    expect(elem.value == component.amount.value).toBeTruthy();
  });

  it('#_updateAmount should call #updateItem once', () => {
    spyOn(component['_cart'], 'updateItem').and.resolveTo();

    component['_updateAmount'](1);

    expect(component['_cart'].updateItem).toHaveBeenCalledTimes(1);
  });
});
