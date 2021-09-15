import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreStub } from 'src/test/AngularFirestoreStub/AngularFirestoreStub';
import { ErrorHandlerService } from './error-handler.service';
import { ShipmentService } from './shipment.service';

describe('ShipmentService', () => {
  let service: ShipmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useClass: AngularFirestoreStub },
        { provide: ErrorHandlerService, useValue: { add: () => {} } },
      ],
    });
    service = TestBed.inject(ShipmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getAvailableShippingTypes should return a rejection when #_shipmentsCollectionRef is undefined', async () => {
    service['_shipmentsCollectionRef'] = undefined;

    await expectAsync(service.getAvailableShippingTypes()).toBeRejectedWith(
      'Unable to load shipping types.'
    );
  });

  it('#getAvailableShippingTypes should return a rejection when fail', async () => {
    const fakeErrorMessage = 'fake error message';
    spyOn<any>(service['_shipmentsCollectionRef'], 'where').and.throwError(
      fakeErrorMessage
    );

    await expectAsync(service.getAvailableShippingTypes()).toBeRejectedWith(
      fakeErrorMessage
    );
  });

  it('#getShipmentById should return a rejection when #_shipmentsCollectionRef is undefined', async () => {
    service['_shipmentsCollectionRef'] = undefined;

    await expectAsync(
      service.getShipmentById('fake-id')
    ).toBeRejectedWith('Unable to load shipping types.');
  });

  it('#getShipmentById should return a rejection when fail', async () => {
    const fakeErrorMessage = 'fake error message';
    spyOn<any>(service['_shipmentsCollectionRef'], 'doc').and.throwError(
      fakeErrorMessage
    );

    await expectAsync(
      service.getShipmentById('fake_id')
    ).toBeRejectedWith(fakeErrorMessage);
  });

  it('#getShipmentById should return a rejection when an invalid param is passed', async () => {
    await expectAsync(service.getShipmentById('')).toBeRejectedWith(
      'The shipment id received is not a valid string.'
    );
  });
});
