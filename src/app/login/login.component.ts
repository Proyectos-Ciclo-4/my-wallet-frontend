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
  ) {}

  dataResponse: any | null;
  arreglo_enviar: Array<Usuario> = new Array<Usuario>();

  nuevo_arreglo: any;

  ngOnInit() {}

  onClick() {
    this.auth.loginWithGoogle().then((response) => {
      console.log(response);

      this.nuevo_arreglo = {
        nombre: response.user.displayName,
        email: response.user.email,
        telefono: response.user.phoneNumber,
        id: response.user.uid,

      };
      console.log(this.nuevo_arreglo);
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
    console.log(nuevo_arreglo)
    this.user.verificarUsuarioPost(nuevo_arreglo).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}

