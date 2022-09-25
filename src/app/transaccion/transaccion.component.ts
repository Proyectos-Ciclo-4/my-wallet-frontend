import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAddressBook, faClockRotateLeft, faMoneyBillTransfer, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
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
    motivosRoute() {
      this.router.navigate(['/motivos']);
      }

    alertaError(){
      Swal.fire(
        'error',
        'No se pudo realizar la transferencia, por favor revise los datos ingresados e intente nuevamente',
        'warning'
      )
    }
    alertaVerif(){
      Swal.fire(
        'Verifica tu transferencia',
        'Valor a enviar USD: 50 Destinatario: josefer1472@gmail.com Motivo de transferencia: Diversion',
        'info'
        )
    }
}
