import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { ItemsComponent } from './components/items/items.component';
import { ItemComponent } from './components/items/item/item.component';
import { AuthComponent } from './components/auth/auth.component';
import { BuyComponent } from './components/buy/buy.component';
import { Route } from './shared/enums/route';

const routes: Routes = [
  { path: Route.auth, component: AuthComponent },
  { path: Route.cart, component: CartComponent },
  { path: Route.buy, component: BuyComponent, canActivate: [AuthGuard] },
  {
    path: Route.item,
    children: [{ path: '**', component: ItemComponent }],
  },
  { path: Route.shop, component: ItemsComponent },
  { path: '', component: ItemsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule],
})
export class AppRoutingModule {}
