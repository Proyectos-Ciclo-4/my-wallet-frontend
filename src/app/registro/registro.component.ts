import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { query, QueryDocumentSnapshot } from 'firebase/firestore';
import { Usuario } from '../models/Usuario.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { NgForm } from '@angular/forms';
import { WsService } from '../services/ws.service';
import {
  faAddressBook,
  faClockRotateLeft,
  faMoneyBillTransfer,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  nombre!: string | null;
  email!: string | null;
  resp!: User;
  arreglo_enviar: Array<Usuario> = new Array<Usuario>();
  nuevo_arreglo: any;
  telefono!: string | null;
  Telefono: string = '';
  transferenciaIcon = faMoneyBillTransfer;
  contactosIcon = faAddressBook;
  historialIcon = faClockRotateLeft;

  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService,
    private webSocket: WsService
  ) {}
  //this.nombre = this.auth.getMyUser()?.displayName!;this.email=this.auth.getMyUser()?.email!

  ngOnInit(): void {
    this.checkWallet();
    this.autoComplete();
    this.resp = this.auth.usuarioLogueado();

    this.connectToWs(this.resp.uid);

    this.nuevo_arreglo = {
      email: this.resp.email,
      telefono: this.Telefono,
      usuarioID: this.resp.uid,
    };
  }

  checkWallet() {
    this.user.getWallet(this.auth.usuarioLogueado().uid).subscribe((wallet) => {
      if (wallet) {
        this.router.navigate(['/home']);
      }
    });
  }

  connectToWs(id: string) {
    this.webSocket.start(id).subscribe(this.switchHandler.bind(this));
  }

  switchHandler(event: any) {
    switch (event.type) {
      case 'com.sofka.domain.wallet.eventos.UsuarioAsignado':
        this.router.navigate(['/home']);
        break;
      case 'com.sofka.domain.wallet.eventos.WalletCreada':
        this.router.navigate(['/home']);
        break;
    }
  }

  autoComplete() {
    this.resp = this.auth.usuarioLogueado();
    this.nombre = this.resp.displayName;
    this.email = this.resp.email;
    console.log(this.nombre, this.email);
  }

  crear() {
    this.nuevo_arreglo.telefono = this.Telefono;
    console.log(this.nuevo_arreglo);
    this.user.verificarUsuarioPost(this.nuevo_arreglo).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}
