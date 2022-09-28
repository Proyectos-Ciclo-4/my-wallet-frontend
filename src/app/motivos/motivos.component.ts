import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faMoneyBillTransfer,
  faAddressBook,
  faClockRotateLeft,
  faMoneyCheck,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Motivo } from '../models/motivo.model';
import { Wallet } from '../models/wallet.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { WsService } from '../services/ws.service';

@Component({
  selector: 'app-motivos',
  templateUrl: './motivos.component.html',
  styleUrls: ['./motivos.component.scss'],
})



export class MotivosComponent implements OnInit {
  transferenciaIcon = faMoneyBillTransfer;
  contactosIcon = faAddressBook;
  historialIcon = faClockRotateLeft;
  motivosIcon = faMoneyCheck;

  wallet!: Wallet;
  motivo_descripcion_input: string = '';
  motivo_color_input: string = '';
  motivosLista: Array<Motivo> = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService,
    private ws: WsService
  ) {}
  motivosListaResponse: any;


  ngOnInit(): void {

    this.ws.getWs().subscribe(this.switchHandler.bind(this))

    let userId = this.auth.getMyUser()?.uid!;
    this.user.getWallet(userId).subscribe((wallet) => { 
    this.wallet = wallet
    //this.motivosLista = wallet.motivos
    })
    this.falsearMotivos()
    console.log(this.motivosLista)
  }

  OnClick() {
    if (this.motivo_descripcion_input == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo de motivo no puede quedar vacio!',
        
      });
    } else {
      if (this.motivo_color_input == '') {
        this.motivo_color_input = '#CBCBCB';
      }
      // Swal.fire(
      //   'Tu Motivo Se Creo !',
      //   'Dirigete a Transaccion y encontraras tu opcion de motivo lista para usar',
      //   'success'
      // )
      console.log(
        this.motivo_descripcion_input,
        this.motivo_color_input,
        this.auth.usuarioLogueado().uid
      );
      Swal.fire({
        title: 'Luego no podras modificar tus motivos,',
        showDenyButton: true,
       
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.enviar_motivo().subscribe(console.log);
          Swal.fire('Creando su motivo', 'espere por favor...', 'success');
        } else if (result.isDenied) {
          Swal.fire('Los cambios no seran guardados', '', 'info');
        }
      });
    }
  }
  enviar_motivo() {
    let newMotivo : Motivo = {descripcion:this.motivo_descripcion_input , color:this.motivo_color_input}
    return this.user.nuevoMotivo(newMotivo,this.wallet.walletId);
  }

  switchHandler(evento : any){
    switch(evento.type){
      case("com.sofka.domain.wallet.eventos.MotivoCreado"):
        Swal.fire('Motivo Creado','','success')
    }
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
  logout() {
    this.router.navigate(['']);
    this.auth.logout();
  }

  falsearMotivos() {
    let m1 : Motivo = {descripcion:"Desconocido", color:"#454554"}
    let m2 : Motivo = {descripcion:"Desconocido", color:"#454554"}
    let m3 : Motivo = {descripcion:"Desconocido", color:"#454554"}
    let m4 : Motivo = {descripcion:"Desconocido", color:"#454554"}
    let m5 : Motivo = {descripcion:"Desconocido", color:"#454554"}
    let m6 : Motivo = {descripcion:"Desconocido", color:"#454554"}
    let m7 : Motivo = {descripcion:"Desconocido", color:"#454554"}
    let m8 : Motivo = {descripcion:"Desconocido", color:"#454554"}
    let m9 : Motivo = {descripcion:"Desconocido", color:"#454554"}
    this.motivosLista = [m1,m2,m3,m4,m5,m6,m7,m8,m9]
  }

}
