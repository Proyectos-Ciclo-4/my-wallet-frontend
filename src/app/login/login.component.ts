import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Usuario } from '../models/Usuario.model';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
// import 'sweetalert2/*/sweetalert2.scss'

@Component({
  selector: 'app-Login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService
  ) { }

  dataResponse: any | null;
  arreglo_enviar: Array<Usuario> = new Array<Usuario>();

  nuevo_arreglo: any;

  ngOnInit() { }

  onClick() {
    this.auth.loginWithGoogle().then((response) => {
      this.nuevo_arreglo = {
        nombre: response.user.displayName,
        email: response.user.email,
        telefono: response.user.phoneNumber,
        id: response.user.uid,
      };
      this.verificacion(this.nuevo_arreglo);
      this.dataResponse = response;
      this.router.navigate(['home']);
    });
  }

  registro() {
    this.auth.loginWithGoogle().then((response) => {
      this.dataResponse = response;
      this.router.navigate(['/registro']);
    });
  }

  verificacion(nuevo_arreglo: Usuario) {
    this.user.validar_alguno(' ', nuevo_arreglo.email).subscribe({
      next: (res) => {
        if (res == true) {
          Swal.fire(
            'Bienvenido de nuevo ' + nuevo_arreglo.nombre + ' a My Wallet!',
            '',
            'success'
          );
        } else {
          Swal.fire(
            'Error!',
            'Usted no se encuentra registrado en MyWallet, por favor cree un usuario nuevo',
            'warning'
          );
          this.router.navigate(['/registro']);
        }
      },
    });
  }
}
