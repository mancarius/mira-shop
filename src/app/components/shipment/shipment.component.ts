import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShipmentService } from 'src/app/services/shipment.service';
import { ShippingType } from 'src/app/shared/interfaces/shipping-type';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss'],
})
export class ShipmentComponent implements OnInit {
  public favoriteShippingType: ShippingType['id'];
  public shippingTypes: ShippingType[] = [];

  constructor(
    private shipments: ShipmentService,
    private errorHandler: ErrorHandlerService
  ) {
    this.setShippingTypes().then(() => {
      this.favoriteShippingType = this.shippingTypes[0].id;
    });
   }

  ngOnInit(): void {}

  private async setShippingTypes(): Promise<void> {
    try {
      this.shippingTypes = await this.shipments.getAvailableShippingTypes();
    } catch (error: any) {
      console.log(error?.message ?? error);
      this.errorHandler.add(error.message ?? error);
      this.shippingTypes = [];
    }
  }
}
