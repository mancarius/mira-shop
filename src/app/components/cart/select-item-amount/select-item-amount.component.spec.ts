import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectItemAmountComponent } from './select-item-amount.component';

describe('SelectItemAmountComponent', () => {
  let component: SelectItemAmountComponent;
  let fixture: ComponentFixture<SelectItemAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectItemAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectItemAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
