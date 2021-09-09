import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss']
})
export class ItemPreviewComponent implements OnInit {

  @Input() item: Product | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
