import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminItemsDeleteButtonComponent } from './admin-items-delete-button.component';

describe('AdminItemsDeleteButtonComponent', () => {
  let component: AdminItemsDeleteButtonComponent;
  let fixture: ComponentFixture<AdminItemsDeleteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminItemsDeleteButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminItemsDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
