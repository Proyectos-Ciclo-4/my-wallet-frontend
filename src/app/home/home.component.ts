import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { WsService } from '../services/ws.service';
import { UserService } from '../services/user.service';
import { faAddressBook, faClockRotateLeft, faMoneyBillTransfer, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private userId!: string;
  public userName!: string;
  public foto!: any;
  saldo: number = 0;

  transferenciaIcon=faMoneyBillTransfer
  contactosIcon= faAddressBook
  historialIcon=faClockRotateLeft
  motivosIcon=faMoneyCheck

  constructor(
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private user: UserService,
    private ws: WsService
  ) {
    this.userId = this.auth.getMyUser()?.uid!;
    this.userName = this.auth.getMyUser()?.displayName!;
    this.foto= this.auth.user?.photoURL
    console.log(this.foto)
  }

  ngOnInit() {
    this.user
      .getWallet(this.userId)
      .subscribe((wallet) => (this.saldo = wallet.saldo


        ));

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
