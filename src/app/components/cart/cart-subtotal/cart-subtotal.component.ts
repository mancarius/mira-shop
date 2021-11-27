import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-subtotal',
  templateUrl: './cart-subtotal.component.html',
  styleUrls: ['./cart-subtotal.component.scss'],
})
export class CartSubtotalComponent implements OnInit {
  constructor(private cart: CartService) {}

  ngOnInit(): void {}

  public get itemsLength$(): BehaviorSubject<number | null> {
    return this.cart.length$;
  }

  public get subtotal(): number {
    return this.cart.subtotal;
  }
}
