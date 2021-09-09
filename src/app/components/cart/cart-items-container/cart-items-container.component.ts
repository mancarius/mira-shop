import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/shared/interfaces/cart-item';

@Component({
  selector: 'app-cart-items-container',
  templateUrl: './cart-items-container.component.html',
  styleUrls: ['./cart-items-container.component.scss']
})
export class CartItemsContainerComponent implements OnInit {

  constructor(private cart: CartService) { }

  ngOnInit(): void {
  }

  public get items$(): BehaviorSubject<CartItem[] | null> {
    return this.cart.items$;
  }

}