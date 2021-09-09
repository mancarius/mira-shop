import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProductService } from 'src/app/services/product.service';
import { Category } from 'src/app/shared/interfaces/category';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})

export class ItemsComponent implements OnInit {
  
  items$: Observable<Product[]> = new Observable();

  constructor( private products: ProductService, private errorHandler: ErrorHandlerService ) { }

  ngOnInit(): void {
    this.products.maxResults(20);
    this.items$ = this.products.items$;                                                                                                                                        
  }

}
