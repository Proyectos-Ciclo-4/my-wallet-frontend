import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { WsService } from '../services/ws.service';
import { UserService } from '../services/user.service';
import {
  faAddressBook,
  faClockRotateLeft,
  faEarthAsia,
  faMoneyBillTransfer,
  faMoneyCheck,
} from '@fortawesome/free-solid-svg-icons';
import { TransaccionDeHistorial, Wallet } from '../models/wallet.model';
import { HistoryHome } from '../models/historyHome.model';
import { Fecha } from '../models/history.model';

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
  saldo!:number;

  transferenciaIcon = faMoneyBillTransfer;
  contactosIcon = faAddressBook;
  historialIcon = faClockRotateLeft;
  motivosIcon = faMoneyCheck;

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

    this.user
    .getWallet(this.userId)
    .subscribe((wallet) => {
      this.wallet = wallet;
      this.saldo = wallet.saldo;
      this.historial = buildHomeHistorial(wallet.historial);
      
    });
  
    this.user
      .getWallet(this.userId)
      .subscribe((wallet) => (this.wallet = wallet));
    
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          return this.ws.start(id);
        })
      )
      .subscribe({
        next: (event: any) => {
          console.log({ type: event.type, event });

          switch (event.type) {
            case 'UsuarioDenegado':
              this.router.navigate(['registro']);

              break;

            case 'Usuarioasignado':
              this.router.navigate(['home']);

              break;
          }
        },
      });
  }

  logout() {
    this.router.navigate(['']);
    this.auth.logout();
  }
}

function buildHomeHistorial(historial:Array<TransaccionDeHistorial>): Array<HistoryHome> {
  let historialDeHome : Array<HistoryHome> = new Array<HistoryHome>();
  historial.forEach(transaccion => {
    
    let fechaSplit = transaccion.fecha.split(" ") 

    let entrada:HistoryHome = {
      fecha : `${fechaSplit[0]} ${fechaSplit[1]} ${fechaSplit[2]} ${fechaSplit[5]}`,
      hora : fechaSplit[3],
      valor : (transaccion.destino == transaccion.walletId) ? ("+" + transaccion.valor) : ("" + transaccion.valor)
    }

    historialDeHome.push(entrada)
  })
  return historialDeHome
}

