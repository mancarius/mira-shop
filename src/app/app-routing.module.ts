import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { ItemsComponent } from './components/items/items.component';
import { AuthComponent } from './components/auth/auth.component';
import { ShipmentComponent } from './components/shipment/shipment.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'shipment', component: ShipmentComponent, canActivate: [AuthGuard] },
  { path: '', component: ItemsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
