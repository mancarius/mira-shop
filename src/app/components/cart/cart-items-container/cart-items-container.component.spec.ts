import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemsContainerComponent } from './cart-items-container.component';

describe('CartItemsContainerComponent', () => {
  let component: CartItemsContainerComponent;
  let fixture: ComponentFixture<CartItemsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartItemsContainerComponent ]
    })
    .compileComponents();
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
