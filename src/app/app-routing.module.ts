import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './service/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {
    path: 'login',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path:'not-found',
    pathMatch:'full',
    component:NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
