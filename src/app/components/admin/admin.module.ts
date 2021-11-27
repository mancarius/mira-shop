import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
import { SharedModule } from '../../shared/module/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { AdminItemsComponent } from './admin-items/admin-items.component';
import { AdminItemEditorComponent } from './admin-items/admin-item-editor/admin-item-editor.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminOrderComponent } from './admin-orders/admin-order/admin-order.component';
import { AdminOrderPreviewComponent } from './admin-orders/admin-order-preview/admin-order-preview.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatRippleModule } from '@angular/material/core';
import { AdminItemsDeleteButtonComponent } from './admin-items/admin-items-delete-button/admin-items-delete-button.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutModule } from '@angular/cdk/layout';
import { AdminItemEditorFormComponent } from './admin-items/admin-item-editor/admin-item-editor-form/admin-item-editor-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { CategoryInputComponent } from './admin-items/admin-item-editor/category-input/category-input.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AdminFileUploadButtonComponent } from './admin-file-upload/admin-file-upload-button/admin-file-upload-button.component';
import { AdminFileUploadComponent } from './admin-file-upload/admin-file-upload.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminUploadAbortButtonComponent } from './admin-file-upload/admin-upload-abort-button/admin-upload-abort-button.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminAuthComponent,
    AdminItemsComponent,
    AdminItemEditorComponent,
    AdminOrdersComponent,
    AdminOrderComponent,
    AdminOrderPreviewComponent,
    AdminItemsDeleteButtonComponent,
    AdminItemEditorFormComponent,
    CategoryInputComponent,
    AdminFileUploadButtonComponent,
    AdminFileUploadComponent,
    AdminUploadAbortButtonComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatRippleModule,
    MatDialogModule,
    LayoutModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatProgressBarModule,
  ],
  bootstrap: [AdminComponent],
})
export class AdminModule {}
