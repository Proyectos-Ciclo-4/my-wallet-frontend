import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { RegistroComponent } from './registro/registro.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { TransaccionComponent } from './transaccion/transaccion.component';
import { HistorialComponent } from './historial/historial.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MotivosComponent } from './motivos/motivos.component';
import { MisGastosComponent } from './mis-gastos/mis-gastos.component';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'primeng/chart';
import { HomeComponent } from './home/home.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    TransaccionComponent,
    HistorialComponent,
    
    MotivosComponent,
    MisGastosComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    CalendarModule,
    TableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
