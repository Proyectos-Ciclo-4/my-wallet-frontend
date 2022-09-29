import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faAddressBook,
  faClockRotateLeft,
  faMoneyBillTransfer,
  faMoneyCheck,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { History, TransactionAlternative } from '../models/history.model';
import { WsService } from '../services/ws.service';
import { Wallet } from '../models/wallet.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {
  transferenciaIcon = faMoneyBillTransfer;
  contactosIcon = faAddressBook;
  historialIcon = faClockRotateLeft;
  motivosIcon = faMoneyCheck;

  historial: TransactionAlternative[] = [];
  wallet!: Wallet;

  constructor(
    private router: Router,
    private auth: AuthService,
    private user: UserService,
    private ws: WsService
  ) {}

  ngOnInit(): void {
    this.ws.getWs().subscribe(this.switchHandler.bind(this));

    this.user
      .getAllHistory(this.auth.usuarioLogueado().uid)
      .subscribe((historial) => {
        this.historial = historial.reverse();
      });
  }

  switchHandler(evento: any) {
    console.log(evento);
    switch (evento.type) {
      case 'com.sofka.domain.wallet.eventos.HistorialRecuperado':
        const transaccionAlternative = { ...evento } as TransactionAlternative;
        this.appendToHistorial(transaccionAlternative);
        break;
      case 'com.sofka.domain.wallet.eventos.TransferenciaExitosa':
        const transaccionExitosa = { ...evento } as TransactionAlternative;
        this.alertaRecibo(transaccionExitosa);
        this.appendToHistorial(transaccionExitosa);
        break;
    }
  }

  private alertaRecibo(info: TransactionAlternative) {
    if (this.wallet.walletId != info.walletId) {
      Swal.fire(
        'Informacion de tu transferencia',
        'Has recibido un Deposito de dinero a tu Cuenta por ' +
          info.valor +
          ' USD con motivo ' +
          info.motivo.descripcion
      );
    }
  }

  appendToHistorial(evento: TransactionAlternative) {
    this.historial = [evento, ...this.historial];
  }

  logout() {
    this.router.navigate(['']);
    this.auth.logout();
  }
}
