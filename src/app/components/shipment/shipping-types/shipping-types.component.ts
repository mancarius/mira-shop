import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShipmentService } from 'src/app/services/shipment.service';
import { ShippingType } from 'src/app/shared/interfaces/shipping-type';

@Component({
  selector: 'app-shipping-types',
  templateUrl: './shipping-types.component.html',
  styleUrls: ['./shipping-types.component.scss'],
})
export class ShippingTypesComponent implements OnInit {
  public shippingTypes: ShippingType[] = [];
  private _favorite: ShippingType['id'] | undefined =
    this.shipments.favoriteShipmentType?.id;

  constructor(
    private shipments: ShipmentService,
    private errorHandler: ErrorHandlerService
  ) {
    this._getShippingTypes()
      .then((shipments: ShippingType[]) => {
        this.favoriteShippingType === undefined &&
          (this.favoriteShippingType = shipments[0]?.id);
        this.shippingTypes = shipments;
      })
      .catch(() => {
        this.favoriteShippingType = undefined;
        this.shippingTypes = [];
      });
  }

  ngOnInit(): void {}

  /**
   * Return a promise that resolves with an array of shipping types or
   * an empty array if fails
   * @returns
   */
  private async _getShippingTypes(): Promise<ShippingType[]> {
    try {
      return this.shipments.getAvailableShippingTypes();
    } catch (error: any) {
      console.error(error?.message ?? error);
      this.errorHandler.add(error.message ?? error);
      return Promise.reject(error.message ?? error);
    }
  }

  public set favoriteShippingType(id: ShippingType['id']) {
    this._favorite = id;
    this.shipments.favoriteShipmentType = this.shippingTypes.filter(
      (shipment) => shipment.id === id
    )[0];
  }

  public get favoriteShippingType(): ShippingType['id'] | undefined {
    return this._favorite;
  }
}
