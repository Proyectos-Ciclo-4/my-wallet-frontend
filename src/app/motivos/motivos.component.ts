import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faMoneyBillTransfer,
  faAddressBook,
  faClockRotateLeft,
  faMoneyCheck,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
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

  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService,
    private webSocket: WsService
  ) {}
  motivosListaResponse: any ;

  motivo: string = '';
  dinero: string = '';
  motivo_color: string = '';
  motivosLista : any = [
    {motivo: "diversion",
    motivo_color: "#FBD871"
  },
  {motivo: "prueba",
    motivo_color: "#A0D1CA"
  },
  {motivo: "prueba",
    motivo_color: "#A0D1CA"
  },
  {motivo: "prueba",
    motivo_color: "#A0D1CA"
  },
  {motivo: "prueba",
    motivo_color: "#A0D1CA"
  },

  ]


  OnClick() {
    this.webSocket.getWs().subscribe(this.switchHandler.bind(this));

    if (this.motivo == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo de motivo no puede quedar vacio!',
      });
    } else {
      if (this.motivo_color == '') {
        this.motivo_color = '#CBCBCB';
      }
      Swal.fire(
        'Tu Motivo Se Creo !',
        'Dirigete a Transaccion y encontraras tu opcion de motivo lista para usar',
        'success'
      )
      console.log(this.motivo,this.motivo_color,this.auth.usuarioLogueado().uid)
      this.enviar_motivo().subscribe(console.log);
    }
  }
  enviar_motivo() {
    return this.user.peticion_crear_motivo({
      walletOrigen: this.auth.usuarioLogueado().uid,
      motivo: this.motivo,
      motivo_color: this.motivo_color,
    });
  }

  ngOnInit(): void {
    this.motivosListaResponse = this.user.get_motivos(this.auth.usuarioLogueado().uid).subscribe()

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
  logout(){
    this.router.navigate(['']);
    this.auth.logout()
  }

  switchHandler(evento: any) {
    console.log(evento);
    switch (evento.type) {
      case 'com.sofka.domain.wallet.eventos.MotivoCreado':
        Swal.fire(
            'Motivo Creado',
            'Su nuevo Motivo ha sido Creado exitosamente',
            'success'
        )
        break;
    }
  }
}
