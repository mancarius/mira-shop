import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminItemEditorFormComponent } from './admin-item-editor-form.component';

describe('AdminItemEditorFormComponent', () => {
  let component: AdminItemEditorFormComponent;
  let fixture: ComponentFixture<AdminItemEditorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminItemEditorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminItemEditorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
