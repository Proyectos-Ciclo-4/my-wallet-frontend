import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAddressBook, faClockRotateLeft, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { WsService } from '../services/ws.service';

@Component({
  selector: 'app-transaccion',
  templateUrl: './transaccion.component.html',
  styleUrls: ['./transaccion.component.scss'],
})
export class TransaccionComponent implements OnInit {

  transferenciaIcon=faMoneyBillTransfer
  contactosIcon= faAddressBook
  historialIcon=faClockRotateLeft

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

  enviar_transaccion() {
    this.user.enviarTransaccion({
      telefono: this.telefono,
      email: this.email,
      motivo: this.motivo,
      dinero: this.dinero,
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
}
