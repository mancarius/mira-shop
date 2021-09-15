import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

import { CartItemsContainerComponent } from './cart-items-container.component';

describe('CartItemsContainerComponent', () => {
  let component: CartItemsContainerComponent;
  let fixture: ComponentFixture<CartItemsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: CartService, useValue: { items$: of([])} }],
      declarations: [CartItemsContainerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartItemsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
