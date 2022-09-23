import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { query, QueryDocumentSnapshot } from 'firebase/firestore';
import { Usuario } from '../models/Usuario.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  nombre!: string | null;
  email!:string| null;
  resp!:User
  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService
  ) {  }
//this.nombre = this.auth.getMyUser()?.displayName!;this.email=this.auth.getMyUser()?.email!



  ngOnInit(): void {
    this.autoComplete()



  }


  autoComplete(){
  this.resp=this.auth.usuarioLogueado()
  this.nombre=this.resp.displayName
  this.email=this.resp.email
  console.log(this.nombre,this.email)
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
