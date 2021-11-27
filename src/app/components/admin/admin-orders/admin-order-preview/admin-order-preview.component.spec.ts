import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderPreviewComponent } from './admin-order-preview.component';

describe('AdminOrderPreviewComponent', () => {
  let component: AdminOrderPreviewComponent;
  let fixture: ComponentFixture<AdminOrderPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOrderPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrderPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
