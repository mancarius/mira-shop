import { Component, OnInit } from '@angular/core';
import { ShipmentService } from 'src/app/services/shipment.service';
import { OrderService } from 'src/app/services/order.service';
import { ShippingAddress } from 'src/app/shared/interfaces/shipping-address';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ShippingType } from 'src/app/shared/interfaces/shipping-type';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import {
  MatDialog,
} from '@angular/material/dialog';
import { Route } from 'src/app/shared/enums/route';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss'],
})
export class BuyComponent implements OnInit {
  public routes = Route;
  public isEditingAddress = !this._shipment.shippingAddress;

  constructor(private _shipment: ShipmentService, private _customer: AuthenticationService, private _dialog: MatDialog, private _order: OrderService, private _error: ErrorHandlerService) {}

  ngOnInit(): void {}

  public get shippingAddress(): ShippingAddress | null {
    return this._shipment.shippingAddress;
  }

  public closeAddressEditor() {
    this.isEditingAddress = false;
  }

  public openAddressEditor() {
    this.isEditingAddress = true;
  }

  public async create(): Promise<void> {
    if (!this._customer.currentUserId) {
      return undefined;
    }

    await this._order
      .create({
        cutomer: this._customer.currentUserId,
        shipment: this._shipment.favoriteShipmentType as ShippingType,
        address: this._shipment.shippingAddress as ShippingAddress,
      })
      .then(this._goToSummary)
      .catch((error) => {
        console.error(error);
        this._error.add(error).and.showMessage('Unable to create the order');
      });
  }

  private _goToSummary() { }
}
