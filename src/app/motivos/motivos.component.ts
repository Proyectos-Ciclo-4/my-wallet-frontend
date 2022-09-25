import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faMoneyBillTransfer, faAddressBook, faClockRotateLeft, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { WsService } from '../services/ws.service';

@Component({
  selector: 'app-motivos',
  templateUrl: './motivos.component.html',
  styleUrls: ['./motivos.component.scss']
})
export class MotivosComponent implements OnInit {
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
  motivo: string = '';
  dinero: string = '';

  ngOnInit(): void {}


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
}
