import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Usuario } from '../models/Usuario.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { WsService } from '../services/ws.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  nombre!: string | null;
  email!: string | null;
  resp!: User;
  arreglo_enviar: Usuario[] = [];
  nuevo_arreglo: any;
  telefono!: string | null;
  Telefono: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService,
    private ws: WsService
  ) {}

  //this.nombre = this.auth.getMyUser()?.displayName!;this.email=this.auth.getMyUser()?.email!

  ngOnInit(): void {
    this.resetTimeout();
    this.checkWallet();
    this.autoComplete();
    this.resp = this.auth.usuarioLogueado();

    this.ws.reconnectWs();
    this.ws.getWs().subscribe(this.switchHandler.bind(this));

    this.nuevo_arreglo = {
      email: this.resp.email,
      telefono: this.Telefono,
      usuarioID: this.resp.uid,
    };
  }

  resetTimeout() {
    this.ws.timeOut(this.handleTimeOut.bind(this));
  }

  handleTimeOut() {
    this.auth.logout();
    this.router.navigate(['']);
  }

  checkWallet() {
    this.user.getWallet(this.auth.usuarioLogueado().uid).subscribe((wallet) => {
      if (wallet) {
        this.alertaRegistrado();
        this.router.navigate(['/home']);
      }
    });
  }

  switchHandler(event: any) {
    switch (event.type) {
      case 'com.sofka.domain.wallet.eventos.UsuarioAsignado':
        this.alertaCreado();
        this.router.navigate(['/home']);
        break;
      case 'com.sofka.domain.wallet.eventos.WalletCreada':
        break;
    }
  }

  autoComplete() {
    this.resp = this.auth.usuarioLogueado();
    this.nombre = this.resp.displayName;
    this.email = this.resp.email;
  }

  crear() {
    this.nuevo_arreglo.telefono = this.Telefono;
    if (!/^\+[0-9]{8,12}$/.test(this.nuevo_arreglo.telefono)) {
      Swal.fire(
        '¡Numero de Telefono Invalido!',
        'Empiece por "+" seguido de su indicador de pais y su número de telefono',
        'warning'
      );
    } else {
      this.validacionTelefonoExistente();
    }
  }

  alertaRegistrado() {
    Swal.fire(
      'Tu email ya esta asociado a una cuenta!',
      'Iniciamos sesión por ti',
      'warning'
    );
  }

  alertaCreado() {
    Swal.fire(
      'Saludos',
      'Bienvenido a My Wallet a partir de este momento podras disfrutar de las opciones que tenemos para ti!!!',
      'success'
    );
  }

  validacionTelefonoExistente() {
    this.user
      .validar_alguno(this.nuevo_arreglo.telefono, this.nuevo_arreglo.email)
      .subscribe({
        next: (res) => {
          if (res == true) {
            Swal.fire(
              'Numero de Telefono Invalido',
              'El numero de telefono ya esta asignado a un usuario',
              'warning'
            );
          } else {
            this.user.verificarUsuarioPost(this.nuevo_arreglo).subscribe({
              next: (res) => {},
            });
          }
        },
      });
  }
}
