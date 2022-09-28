import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { RegistroComponent } from './registro/registro.component';
import { TransaccionComponent } from './transaccion/transaccion.component';
import { HistorialComponent } from './historial/historial.component';

import { MotivosComponent } from './motivos/motivos.component';
import { MisGastosComponent } from './mis-gastos/mis-gastos.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    ...canActivate(() => redirectLoggedInTo(['home'])),
  },
  {
    path: 'registro',
    component: RegistroComponent,
    ...canActivate(() => redirectUnauthorizedTo([''])),
  },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(() => redirectUnauthorizedTo([''])),
  },
  {
    path: 'transaccion',
    component: TransaccionComponent,
    ...canActivate(() => redirectUnauthorizedTo([''])),
  },
  {
    path: 'motivos',
    component: MotivosComponent,
    ...canActivate(() => redirectUnauthorizedTo([''])),
  },
  {
    path: 'historial',
    component: HistorialComponent,
    ...canActivate(() => redirectUnauthorizedTo([''])),
  },
  
  {
    path: 'mis-gastos',
    component: MisGastosComponent,
    ...canActivate(() => redirectUnauthorizedTo([''])),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

//{path:"nav",component:NavbarComponent},
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
