import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { WsService } from '../services/ws.service';
import { UserService } from '../services/user.service';
import { TransaccionDeHistorial, Wallet } from '../models/wallet.model';
import { HistoryHome } from '../models/historyHome.model';
import Swal from 'sweetalert2';
import { TransaccionExitosa } from '../models/eventos/transaccionExitosa.model';
import { AlertsService } from '../services/alerts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private userId!: string;
  public userName!: string;
  public foto!: any;
  wallet: Wallet = { saldo: 0 } as Wallet;
  historial: any;
  saldo!: number;

  constructor(
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private user: UserService,
    private ws: WsService,
    private alertsService: AlertsService
  ) {
    this.userId = this.auth.getMyUser()?.uid!;
    this.userName = this.auth.getMyUser()?.displayName!;
    this.foto = this.auth.user?.photoURL;
  }

  ngOnInit() {
    this.ws.getWs().subscribe(this.switchHandler.bind(this));
    this.resetTimeout();

    this.user.getWallet(this.userId).subscribe((wallet) => {
      this.wallet = wallet;
      this.saldo = wallet.saldo;
      this.historial = this.buildHomeHistorial(wallet.historial);
    });
  }

  resetTimeout() {
    this.ws.timeOut(this.handleTimeOut.bind(this));
  }

  handleTimeOut() {
    this.auth.logout();
    this.router.navigate(['']);
  }

  logout() {
    this.router.navigate(['']);
    this.auth.logout();
  }

  switchHandler(evento: any) {
    console.log(evento);
    switch (evento.type) {
      case 'com.sofka.domain.wallet.eventos.TransferenciaExitosa':
        const transaccionExitosa = { ...evento } as TransaccionExitosa;
        this.actualizarSaldo(evento);
        //this.alertaAnimada();
        this.alertaRecibo(transaccionExitosa);
        this.appendToHistorial(transaccionExitosa);
        break;
      case 'com.sofka.domain.wallet.eventos.WalletDesactivada':
        this.alertaEliminarConfirmada();
        break;
    }
  }

  private actualizarSaldo(evento: any) {
    this.wallet.saldo += evento.valor.monto;
    this.user.getWallet(this.userId).subscribe((wallet) => {
      this.historial = this.buildHomeHistorial(wallet.historial);
    });
  }

  private alertaAnimada() {
    Swal.fire({
      title: 'RECIBISTE UN DEPOSITO!!',
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  }

  private alertaRecibo(info: TransaccionExitosa) {
    if (this.wallet.walletId != info.walletOrigen.uuid) {
      Swal.fire(
        'Informacion de tu transferencia',
        'Has recibido un Deposito de dinero a tu Cuenta por ' +
          info.valor.monto +
          ' USD con motivo ' +
          info.motivo.descripcion
      );
    }
  }

  alertaEliminarwallet() {
    this.alertsService.confirm({
      title: '¿Estás seguro que quieres cancelar tu cuenta?',
      text: `Lamentamos que quieras abandonarnos tan pronto y que no puedas seguir disfrutando de la simplicidad, seguridad y trazabilidad de MyWallet. Si quieres continuar con el proceso de cierre, da clic en SI, de lo contrario da click en cancelar`,
      bodyDeConfirmacion: 'Tu solicitud se encuentra en proceso',
      tituloDeConfirmacion: 'EN PROCESO',
      bodyDelCancel: 'Que gusto que desees continuar con Nosotros',
      tituloDelCancel: '  ',
      callback: () => {
        this.eliminarWallet(this.userId).subscribe(console.log);
      },
    });
  }

  eliminarWallet(data: any) {
    return this.user.EliminarWallet(data);
  }

  alertaEliminarConfirmada() {
    Swal.fire(
      'Wallet en proceso de eliminacion',
      'Tu cuenta ha sido programada para eliminacion, en los próximos 5 días uno de nuestros agentes se contactará contigo para proceder con el cierre definitivo de tu cuenta. Para proceder, debes transferir todo tu saldo a alguno de tus contactos en estos 5 dias habiles ',
      'success'
    );
  }

  buildHomeHistorial(historial: TransaccionDeHistorial[]): HistoryHome[] {
    let historialDeHome: HistoryHome[] = [];
    console.log(historial);
    historial
      .reverse()
      .slice(0, 3)
      .forEach((transaccion) => {
        let fechaDate = transaccion.fecha.split(' ');
        let entrada: HistoryHome = {
          fecha: `${fechaDate[0]} ${fechaDate[1]} ${fechaDate[2]} ${fechaDate[5]}`,
          hora: fechaDate[3],
          valor:
            transaccion.destino == transaccion.walletId
              ? '+' + transaccion.valor
              : '' + transaccion.valor,
        };
        historialDeHome.push(entrada);
      });
    return historialDeHome;
  }

  appendToHistorial(evento: TransaccionExitosa) {
    let fecha = new Date(evento.when.seconds * 1000);
    let entrada: HistoryHome = {
      fecha: fecha.toDateString(),
      hora: fecha.toTimeString().split(' ')[0],
      valor:
        evento.walletDestino == evento.walletOrigen
          ? '+' + evento.valor.monto
          : '' + evento.valor.monto,
    };

    this.historial.pop();

    this.historial = this.buildHomeHistorial([entrada, ...this.historial]);
  }
}
