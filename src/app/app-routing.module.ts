import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RegistroComponent } from './registro/registro.component';
import { NavbarComponent } from './navbar/navbar.component';

const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"registro",component:RegistroComponent},
  {path:"home",component:HomeComponent, ...canActivate(()=> redirectUnauthorizedTo(['']))},

];
//{path:"nav",component:NavbarComponent},
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
