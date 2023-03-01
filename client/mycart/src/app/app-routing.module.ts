import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomGuard } from 'src/Utlis/guards/custom.guard';
import { NotFoundComponent } from './user/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'customer',
    canActivate: [CustomGuard],
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'admin',
    canActivate: [CustomGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
