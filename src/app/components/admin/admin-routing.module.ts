import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin/admin.guard';
import { AuthGuard } from '../../guards/auth.guard';
import { AdminRoute } from '../../shared/enums/admin-route';
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {
    path: AdminRoute.base,
    redirectTo: AdminRoute.dashboard,
  },
  { path: AdminRoute.auth, component: AdminAuthComponent },
  {
    path: AdminRoute.dashboard,
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
