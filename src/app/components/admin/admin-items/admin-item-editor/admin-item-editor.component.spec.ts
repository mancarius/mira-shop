import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminItemEditorComponent } from './admin-item-editor.component';

describe('AdminItemEditorComponent', () => {
  let component: AdminItemEditorComponent;
  let fixture: ComponentFixture<AdminItemEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminItemEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
