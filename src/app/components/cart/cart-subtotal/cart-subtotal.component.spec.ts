import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartService } from 'src/app/services/cart.service';

import { CartSubtotalComponent } from './cart-subtotal.component';

describe('CartSubtotalComponent', () => {
  let component: CartSubtotalComponent;
  let fixture: ComponentFixture<CartSubtotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: CartService, useValue: {} },
      ],
      declarations: [ CartSubtotalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartSubtotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
