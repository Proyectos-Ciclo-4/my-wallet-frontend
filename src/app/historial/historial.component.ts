import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { TransactionAlternative } from '../models/history.model';
import { WsService } from '../services/ws.service';
import { Wallet } from '../models/wallet.model';
import Swal from 'sweetalert2';
import { TransaccionExitosa } from '../models/eventos/transaccionExitosa.model';
import { faClock, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {
  historial: TransactionAlternative[] = [];
  wallet!: Wallet;
  clockIcon: IconDefinition = faClock;

  constructor(
    private router: Router,
    private auth: AuthService,
    private user: UserService,
    private ws: WsService
  ) { }

  ngOnInit(): void {
    this.resetTimeout();
    this.ws.getWs().subscribe(this.switchHandler.bind(this));

    this.user
      .getAllHistory(this.auth.usuarioLogueado().uid)
      .subscribe((historial) => { });

    this.user.getWallet(this.auth.usuarioLogueado().uid).subscribe((wallet) => {
      this.wallet = wallet;
    });
  }

  handleTimeOut() {
    this.auth.logout().then(() => this.router.navigate(['']));
  }


  resetTimeout() {
    this.ws.timeOut(this.handleTimeOut.bind(this));
  }

  switchHandler(evento: any) {
    switch (evento.type) {
      case 'com.sofka.domain.wallet.eventos.HistorialRecuperado':
        const transExt = { ...evento } as TransaccionExitosa;
        this.appendToHistorial(this.exitosaToAlternative(transExt));
        break;
      case 'com.sofka.domain.wallet.eventos.TransferenciaExitosa':
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
      walletId: event.walletOrigen.uuid,
    };
  }

  appendToHistorial(evento: TransactionAlternative) {
    this.historial = [evento, ...this.historial];
    this.historial.sort(
      (t1, t2) => new Date(t2.fecha).getTime() - new Date(t1.fecha).getTime()
    );
  }

  logout() {
    this.router.navigate(['']);
    this.auth.logout();
  }

  displaySenderData(id: string) {
    this.user.getUserMongo(id).subscribe((user) => {
      Swal.fire(
        'Datos del Remitente',
        `Email: ${user.email} Telefono: ${user.numero}`,
        'info'
      );
    });
  }
}
