import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ShipmentService } from 'src/app/services/shipment.service';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss'],
})
export class ShipmentComponent implements OnInit {
  public favoriteShippingType: string = '';

  constructor(private shipments: ShipmentService) {
    this.shipments.shippingTypes$.subscribe((data: any) => {
      data.docs.forEach((doc: any) => {
        doc.ref.get().then((shipment: any) => {console.log(shipment.data())})
    })
    });
  }

  ngOnInit(): void {}

  public get shippingTypes$(): any {
    console.log('ShipmentComponent', 'shippingTypes$');
    return this.shipments.shippingTypes$;
  }
}
