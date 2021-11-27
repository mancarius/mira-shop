import { Component, OnInit, Input } from '@angular/core';
import { Route } from 'src/app/shared/enums/route';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss'],
})
export class ItemPreviewComponent implements OnInit {
  @Input() item: Product | undefined;
  public dashedItemName = '';
  public routes = Route;

  constructor() { }

  ngOnInit(): void {
    this.dashedItemName = this.item?.name.replace(/\s+/g, "-").toLowerCase() ?? '';
  }
}
