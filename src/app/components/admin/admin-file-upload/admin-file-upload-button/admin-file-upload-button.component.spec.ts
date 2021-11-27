import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFileUploadButtonComponent } from './admin-file-upload-button.component';

describe('AdminFileUploadButtonComponent', () => {
  let component: AdminFileUploadButtonComponent;
  let fixture: ComponentFixture<AdminFileUploadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFileUploadButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFileUploadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
