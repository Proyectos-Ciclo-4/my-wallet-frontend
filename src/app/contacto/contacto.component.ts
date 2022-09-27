import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAddressBook, faClockRotateLeft, faMoneyBillTransfer, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { WsService } from '../services/ws.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {

  transferenciaIcon=faMoneyBillTransfer
  contactosIcon= faAddressBook
  historialIcon=faClockRotateLeft
  motivosIcon=faMoneyCheck

  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService,
    private webSocket: WsService
  ) {}
  telefono: string = '';
  email: string = '';
  nombre:string='';


  ngOnInit(): void {}

  crear_contacto() {
    this.user.peticion_crear_contacto({
      nombre:this.nombre,
      telefono: this.telefono,
      email: this.email,
    });
  }
  trasferenciasRoute() {
    this.router.navigate(['/transaccion']);
    }
    contactoRoute() {
      this.router.navigate(['/contacto']);
      }
    historialRoute() {
      this.router.navigate(['/historial']);
      }
    motivosRoute() {
      this.router.navigate(['/motivos']);
      }
      logout(){
        this.router.navigate(['']);
        this.auth.logout()
      }
}

