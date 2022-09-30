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
import { TransaccionExitosa } from '../models/eventos/transaccionExitosa.model';

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
    this.ws.timeOut();
    this.ws.getWs().subscribe(this.switchHandler.bind(this));

    this.user
      .getAllHistory(this.auth.usuarioLogueado().uid)
      .subscribe((historial) => {});

    this.user.getWallet(this.auth.usuarioLogueado().uid).subscribe((wallet) => {
      this.wallet = wallet;
    });
  }

  resetTimeout() {
    this.ws.timeOut();
  }

  switchHandler(evento: any) {
    //console.log(evento);
    switch (evento.type) {
      case 'com.sofka.domain.wallet.eventos.HistorialRecuperado':
        console.log('Historial recuperado!');
        const transExt = { ...evento } as TransaccionExitosa;
        this.appendToHistorial(this.exitosaToAlternative(transExt));
        break;
      case 'com.sofka.domain.wallet.eventos.TransferenciaExitosa':
        console.log(this.historial);
        console.log(evento);
        const transExt2 = { ...evento } as TransaccionExitosa;
        this.appendToHistorial(this.exitosaToAlternative(transExt2));
        this.alertaRecibo(this.exitosaToAlternative(transExt2));
        break;
    }
  }

  private alertaRecibo(info: TransactionAlternative) {
    if (this.wallet.walletId == info.destino) {
      Swal.fire(
        'Informacion de tu transferencia',
        'Has recibido un Deposito de dinero a tu Cuenta por ' +
          info.valor +
          ' USD con motivo ' +
          info.motivo.descripcion
      );
    }
  }

  exitosaToAlternative(event: TransaccionExitosa): TransactionAlternative {
    return {
      destino: event.walletDestino.uuid,
      estado: event.estado.tipoDeEstado,
      motivo: event.motivo,
      fecha: new Date(event.when.seconds * 1000).toString(),
      transferencia_id: event.uuid,
      valor: event.valor.monto,
      walletId: event.aggregateRootId,
    };
  }

  appendToHistorial(evento: TransactionAlternative) {
    this.historial = [evento, ...this.historial];
  }

  logout() {
    this.router.navigate(['']);
    this.auth.logout();
  }
}
