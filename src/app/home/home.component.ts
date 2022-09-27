import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { WsService } from '../services/ws.service';
import { UserService } from '../services/user.service';
import {
  faAddressBook,
  faClockRotateLeft,
  faMoneyBillTransfer,
  faMoneyCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Wallet } from '../models/wallet.model';

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
  historial: any = [
    {
      valor: 0,
      fecha: { date: '2022/08/12' },
      hora: '12:00',
    },
  ];

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
