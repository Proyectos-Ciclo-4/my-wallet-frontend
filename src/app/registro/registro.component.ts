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
        this. alertaRegistrado()
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
        this.alertaCreado()
        
        setTimeout(() => {
          this.router.navigate(['/home'])
        },2000)

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
    if (this.nuevo_arreglo.telefono.length <13 || this.nuevo_arreglo.telefono==""){
      Swal.fire(
        'Numero de Telefono Invalido',
        'ingrese un numero de telefono valido',
        'warning')
    }else{
      this.validacionTelefonoExistente()
    }

  }

  alertaRegistrado() {
    Swal.fire(
      'USUARIO EXISTENTE',
      'hola!'+ this.nuevo_arreglo.nombre + ' Ya tienes una cuenta Registrada en my wallet',
      'warning'
    );}

    alertaCreado() {
      Swal.fire(
        'USUARIO CREADO',
        'Bienvenido '+ this.nuevo_arreglo.nombre + ' a my Wallet  a partir de este momento podras disfrutar de las opciones que tenemos para ti!!!',
        'warning'
      );}
      validacionTelefonoExistente(){
        this.user.validar_alguno(this.nuevo_arreglo.telefono,this.nuevo_arreglo.email).subscribe(
          {next: (res) => {
            if(res == true){
              Swal.fire(
                'Numero de Telefono Invalido',
                'El numero de telefono ya esta asignado a un usuario',
                'warning')
            } else {
              this.user.verificarUsuarioPost(this.nuevo_arreglo).subscribe({
                next: (res) => {
                  console.log(res);
                },
              });
            }
          }})
      }
}
