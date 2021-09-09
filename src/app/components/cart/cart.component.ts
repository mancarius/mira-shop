import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/shared/interfaces/cart-item';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  public totalItems: number = 0;
  public subtotal: number = 0;

  constructor(private cart: CartService) {
    console.log('CartComponent');
  }

  ngOnInit(): void {
    this.items$.subscribe((items) => {
      if (items?.length) {
        this.totalItems = items?.reduce(
          (total, item) => total + item.amount,
          0
        );
      }
      else {
        this.totalItems = 0;
      }
    });
  }

  public get items$(): BehaviorSubject<CartItem[] | null> {
    return this.cart.items$;
  }
  public get itemsLength$(): BehaviorSubject<number | null> {
    return this.cart.length$;
  }
}
