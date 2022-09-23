import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { query, QueryDocumentSnapshot } from 'firebase/firestore';
import { Usuario } from '../models/Usuario.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  nombre!: string | null;
  email!:string| null;
  resp!:User
  arreglo_enviar: Array<Usuario> = new Array<Usuario>();
  nuevo_arreglo: any;
  telefono!:string| null;
  Telefono:string= '';



  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService
  ) {  }
//this.nombre = this.auth.getMyUser()?.displayName!;this.email=this.auth.getMyUser()?.email!

  ngOnInit(): void {
    this.autoComplete()
    this.resp=this.auth.usuarioLogueado()
    console.log(this.Telefono)
    this.nuevo_arreglo = {
      nombre: this.resp.displayName,
      email: this.resp.email,
      telefono: this.Telefono,
      id: this.resp.uid,
    };
    console.log(this.nuevo_arreglo)

  }




  autoComplete(){
  this.resp=this.auth.usuarioLogueado()
  this.nombre=this.resp.displayName
  this.email=this.resp.email
  console.log(this.nombre,this.email)
  }

  crear(){
    console.log(this.Telefono)
      console.log(this.nuevo_arreglo)
      this.nuevo_arreglo.telefono = this.Telefono
      this.user.verificarUsuarioPost(this.nuevo_arreglo).subscribe({
        next: (res) => {
          console.log(res);
        },
      });
  }
}
