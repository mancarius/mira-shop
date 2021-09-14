import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ShipmentService } from 'src/app/services/shipment.service';

import { ShipmentComponent } from './shipment.component';

describe('ShipmentComponent', () => {
  let component: ShipmentComponent;
  let fixture: ComponentFixture<ShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ShipmentService,
          useValue: { getAvailableShippingTypes: () => Promise.resolve([]) },
        },
        { provide: ErrorHandlerService, useValue: { add: () => {} } },
      ],
      declarations: [ShipmentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
