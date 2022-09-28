import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { WsService } from '../services/ws.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
})
export class ContactoComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService,
    private webSocket: WsService
  ) {}

  telefono: string = '';
  email: string = '';
  nombre: string = '';

  ngOnInit(): void {
    this.webSocket.getWs().subscribe(this.switchHandler.bind(this));
  }

  crear_contacto() {
    this.user.peticion_crear_contacto({
      nombre: this.nombre,
      telefono: this.telefono,
      email: this.email,
    });
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

  switchHandler(evento: any) {
    switch (evento.type) {
      case'com.sofka.domain.wallet.eventos.ContactoCreado':
        Swal.fire(
          'Contacto Creado',
          'El contacto ha sido Creado exitosamente',
          'success'
      );
        break;
      case 'crear_contacto':
        this.crear_contacto();
        break;
      case 'trasferenciasRoute':
        this.trasferenciasRoute();
        break;
      case 'contactoRoute':
        this.contactoRoute();
        break;
      case 'historialRoute':
        this.historialRoute();
        break;
      case 'motivosRoute':
        this.motivosRoute();
        break;
      case 'logout':
        this.logout();
        break;
    }
  }
}
