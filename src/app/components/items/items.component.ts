import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsItemService } from 'src/app/services/cons-item.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
  items$: Observable<Product[]> = this._item.items$;

  constructor(
    private _item: ConsItemService,
    private _error: ErrorHandlerService
  ) {
    this._item.whereAvailable();
  }

  ngOnInit(): void {}

  public findItems(keyword: string) {
    console.log('findItems', keyword);
  }
}
