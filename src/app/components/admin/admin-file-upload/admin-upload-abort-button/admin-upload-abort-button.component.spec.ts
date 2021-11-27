import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUploadAbortButtonComponent } from './admin-upload-abort-button.component';

describe('AdminUploadAbortButtonComponent', () => {
  let component: AdminUploadAbortButtonComponent;
  let fixture: ComponentFixture<AdminUploadAbortButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUploadAbortButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUploadAbortButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
