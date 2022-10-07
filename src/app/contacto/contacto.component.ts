import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from 'firebase/auth';
import Swal from 'sweetalert2';
import {CrearContacto} from '../models/Contactos.model';
import {Motivo} from '../models/motivo.model';
import {Usuario} from '../models/Usuario.model';
import {ContactoWallet, Wallet} from '../models/wallet.model';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {WsService} from '../services/ws.service';
import {ContactoEliminado} from "../models/eventos/contactoEliminado";
import {Contacto, ContactoAgregado} from "../models/eventos/contactoAgregado";

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
})
export class ContactoComponent implements OnInit {
  userTelefonoPropio: any;
  userEmailPropio: any;
  nombre!: string;
  telefono!: string;
  email!: string;
  contactoId!: string | null;
  walletId!: string;
  userId = this.auth.getMyUser()?.uid!;

  contactoLista: Motivo[] = [];
  wallet: Wallet = {saldo: 0} as Wallet;

  selectedOption!: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService,
    private ws: WsService
  ) {
  }

  ngOnInit(): void {
    this.resetTimeout();
    let userId = this.auth.getMyUser()?.uid!;
    this.userEmailPropio = this.auth.getMyUser()?.email;
    this.user.getUserMongo(userId).subscribe((user) => {
      this.userTelefonoPropio = user.numero;
    });
    this.ws.reconnectWs();
    this.ws.getWs().subscribe(this.switchHandler.bind(this));
    this.user.getWallet(this.userId).subscribe((wallet) => {
      this.wallet = wallet;

      console.log(
        'soy wallet',
        wallet,
        'this.wallet',
        this.wallet.contactos[0].nombre
      );
    });
  }

  resetTimeout() {
    this.ws.timeOut(this.handleTimeOut.bind(this));
  }

  handleTimeOut() {
    this.auth.logout();
    this.router.navigate(['']);
  }

  Crearcontacto() {
    this.validacion_datos_propios();
    this.alertaCreado();
  }

  switchHandler(event: any) {
    switch (
      event.type) {
      case 'com.sofka.domain.wallet.eventos.ContactoAgregado':
        const contactoAgregado = event as ContactoAgregado;
        this.wallet.contactos.push(this.contactoToContactoWallet(contactoAgregado.contacto))
        this.alertaCreado()
        break;
      case 'com.sofka.domain.wallet.eventos.ContactoEliminado':
        const localEvent = event as ContactoEliminado;
        this.alertaEliminado()
        this.wallet.contactos = this.wallet.contactos.filter(value => value.walletId !== localEvent.contactoID.uuid)
        break;

    }
  }

  contactoToContactoWallet(contacto: Contacto) {
    return {
      walletId: contacto.entityId.uuid,
      email: contacto.email.direccion,
      telefono: contacto.telefono.numero,
      nombre: contacto.nombre.nombreDeUsuario,
    } as ContactoWallet;
  }

  alertaCreado() {
    Swal.fire(
      'Contacto creado exitosamente',
      'Ahora ' + this.nombre + ' hace parte de tus contactos!',
      'success'
    );
  }

  alertaEliminado() {
    Swal.fire(
      'Contacto Eliminado exitosamente',
      'El contacto ha sido eliminado correctamente',
      'success'
    );
  }

  validacion_datos_propios() {
    if (
      this.email == this.userEmailPropio ||
      this.telefono == this.userTelefonoPropio
    ) {
      Swal.fire(
        'Error',
        'El nuevo contacto no puede ser usted mismo!',
        'warning'
      );
      return false;
    } else {
      console.log(this.nombre, this.telefono, this.email);
      return this.user
        .crear_contacto({
          nombre: this.nombre,
          telefono: this.telefono,
          email: this.email,
          contactoId: '',
          walletId: this.userId,
        })
        .subscribe(console.log);
    }
  }

  eliminarContacto() {
    this.user
      .EliminarContacto({
        contactoId: this.selectedOption[0],
        walletId: this.userId,
      })
      .subscribe(console.log);
  }
}
