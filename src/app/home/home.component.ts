import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { WsService } from '../services/ws.service';
import { UserService } from '../services/user.service';
import { TransaccionDeHistorial, Wallet } from '../models/wallet.model';
import { HistoryHome } from '../models/historyHome.model';
import Swal from 'sweetalert2';
import { TransaccionExitosa } from '../models/eventos/transaccionExitosa.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private userId!: string;
  public userName!: string;
  public foto!: any;
  wallet!: Wallet;
  historial: any;
  saldo!: number;
  idDestino!: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private user: UserService,
    private ws: WsService
  ) {
    this.userId = this.auth.getMyUser()?.uid!;
    this.userName = this.auth.getMyUser()?.displayName!;
    this.foto = this.auth.user?.photoURL;
  }

  ngOnInit() {
    this.ws.getWs().subscribe(this.switchHandler.bind(this));

    this.user.getWallet(this.userId).subscribe((wallet) => {
      this.wallet = wallet;
      this.saldo = wallet.saldo;
      this.historial = buildHomeHistorial(wallet.historial);
    });
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
        this.alertaAnimada()
        this.alertaRecibo(transaccionExitosa);
        break;
    }
  }

  private actualizarSaldo(evento: any) {
    this.wallet.saldo += evento.valor.monto;
  }

  private alertaAnimada(){
    Swal.fire({
      title: 'RECIBISTE UN DEPOSITO!!',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
  }

  private alertaRecibo(info:TransaccionExitosa) {
    Swal.fire(
      'Informacion de tu transferencia',
      'Has recibido un Deposito de dinero a tu Cuenta por '+info.valor+'USD con motivo '+info.motivo+' Fecha '+info.when,
      'info'
    );
  }
}

function buildHomeHistorial(
  historial: Array<TransaccionDeHistorial>
): Array<HistoryHome> {
  let historialDeHome: Array<HistoryHome> = new Array<HistoryHome>();

  historial
    .reverse()
    .slice(0, 3)
    .forEach((transaccion) => {
      let fechaSplit = transaccion.fecha.split(' ');

      let entrada: HistoryHome = {
        fecha: `${fechaSplit[0]} ${fechaSplit[1]} ${fechaSplit[2]} ${fechaSplit[5]}`,
        hora: fechaSplit[3],
        valor:
          transaccion.destino == transaccion.walletId
            ? '+' + transaccion.valor
            : '' + transaccion.valor,
      };

      historialDeHome.push(entrada);
    });
  return historialDeHome;
}
