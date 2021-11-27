import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminItemCategoryInputComponent } from './category-input.component';

describe('AdminItemCategoryInputComponent', () => {
  let component: AdminItemCategoryInputComponent;
  let fixture: ComponentFixture<AdminItemCategoryInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminItemCategoryInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminItemCategoryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
