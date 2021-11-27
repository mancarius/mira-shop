import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartComponent } from './components/cart/cart.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ItemsComponent } from './components/items/items.component';
import { ItemPreviewComponent } from './components/items/item-preview/item-preview.component';
import { CategoryComponent } from './components/categories/category/category.component';
import { CartItemComponent } from './components/cart/cart-item/cart-item.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { LoginComponent } from './components/auth/login/login.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { AuthComponent } from './components/auth/auth.component';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogTemplateComponent } from './components/dialog-template/dialog-template.component';
import { CartSubtotalComponent } from './components/cart/cart-subtotal/cart-subtotal.component';
import { CartItemsContainerComponent } from './components/cart/cart-items-container/cart-items-container.component';
import { ShippingTypesComponent } from './components/shipment/shipping-types/shipping-types.component';
import { ItemComponent } from './components/items/item/item.component';
import { SelectItemAmountComponent } from './components/cart/select-item-amount/select-item-amount.component';
import { BuyComponent } from './components/buy/buy.component';
import { ShippingAddressFormComponent } from './components/shipment/shipping-address-form/shipping-address-form/shipping-address-form.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { AdminModule } from './components/admin/admin.module';
import { PrivateMenuComponent } from './components/private-menu/private-menu.component';
import { SharedModule } from './shared/module/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    CategoriesComponent,
    ItemsComponent,
    ItemPreviewComponent,
    CategoryComponent,
    CartItemComponent,
    HeaderComponent,
    FooterComponent,
    NavBarComponent,
    LoginComponent,
    LogoutComponent,
    AuthComponent,
    DialogTemplateComponent,
    CartSubtotalComponent,
    CartItemsContainerComponent,
    ShippingTypesComponent,
    ItemComponent,
    SelectItemAmountComponent,
    BuyComponent,
    ShippingAddressFormComponent,
    SearchInputComponent,
    PrivateMenuComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    environment.production ? BrowserAnimationsModule : NoopAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatDialogModule,
    MatDividerModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    AdminModule,
    SharedModule,
  ],
  providers: [AngularFirestore, AngularFireAuth, MatDialogConfig],
  bootstrap: [AppComponent],
})
export class AppModule {}
