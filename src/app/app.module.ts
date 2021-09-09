import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { OauthComponent } from './components/auth/login/oauth/oauth.component';

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
import { ShipmentComponent } from './components/shipment/shipment.component';

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
    OauthComponent,
    LoginComponent,
    LogoutComponent,
    AuthComponent,
    DialogTemplateComponent,
    CartSubtotalComponent,
    CartItemsContainerComponent,
    ShipmentComponent,
  ],
  imports: [
    BrowserModule,
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
  ],
  providers: [AngularFirestore, AngularFireAuth, MatDialogConfig],
  bootstrap: [AppComponent],
})
export class AppModule {}
