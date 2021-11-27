import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShipmentService } from 'src/app/services/shipment.service';

import { ShippingTypesComponent } from './shipping-types.component';

describe('ShipmentComponent', () => {
  let component: ShippingTypesComponent;
  let fixture: ComponentFixture<ShippingTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ShipmentService,
          useValue: { getAvailableShippingTypes: () => Promise.resolve([]) },
        },
        { provide: ErrorHandlerService, useValue: { add: () => {} } },
      ],
      declarations: [ShippingTypesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
