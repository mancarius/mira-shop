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

  public items$: BehaviorSubject<CartItem[]> = this.cart.items$;
  public itemsLength$: BehaviorSubject<number | null> = this.cart.length$;

  constructor(private cart: CartService) { }

  ngOnInit(): void { }
}
