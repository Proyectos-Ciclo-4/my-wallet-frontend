import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RegistroComponent } from './registro/registro.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TransaccionComponent } from './transaccion/transaccion.component';
import { HistorialComponent } from './historial/historial.component';

const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"registro",component:RegistroComponent, ...canActivate(()=> redirectUnauthorizedTo(['']))},
  {path:"transaccion",component:TransaccionComponent, ...canActivate(()=> redirectUnauthorizedTo(['']))},
  {path:"historial",component:HistorialComponent, ...canActivate(()=> redirectUnauthorizedTo(['']))},
  {path:"home",component:HomeComponent, ...canActivate(()=> redirectUnauthorizedTo(['']))},

];
//{path:"nav",component:NavbarComponent},
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
