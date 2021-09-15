import { Component, Inject, NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogTemplateComponent } from './dialog-template.component';

@Component({
  template: '',
})
class NoopComponent {}

const TEST_DIRECTIVES = [DialogTemplateComponent, NoopComponent];
@NgModule({
  imports: [MatDialogModule, NoopAnimationsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [DialogTemplateComponent],
})
class DialogTestModule {}

describe('DialogTemplateComponent', () => {
  let component: DialogTemplateComponent;
  let fixture: ComponentFixture<DialogTemplateComponent>;
  const model: any = {
    ActionButton: 'Delete',
    SupportingText: 'Are you sure?',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: MAT_DIALOG_DATA, useValue: model }],
      imports: [DialogTestModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
