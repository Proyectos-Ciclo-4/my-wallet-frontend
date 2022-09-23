import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { WsService } from '../services/ws.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private userId!: string;
  public userName!: string;
  saldo: number = 0;

  constructor(
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private user: UserService,
    private ws: WsService
  ) {
    this.userId = this.auth.getMyUser()?.uid!;
    this.userName = this.auth.getMyUser()?.displayName!;
  }

  ngOnInit() {
    this.user
      .getWallet(this.userId)
      .subscribe((wallet) => (this.saldo = wallet.saldo));

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
}
