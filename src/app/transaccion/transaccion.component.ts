import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Motivo } from '../models/motivo.model';
import { Usuario } from '../models/usuario-backend.model';
import { Wallet } from '../models/wallet.model';
import { AlertsService } from '../services/alerts.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { WsService } from '../services/ws.service';

@Component({
  selector: 'app-transaccion',
  templateUrl: './transaccion.component.html',
  styleUrls: ['./transaccion.component.scss'],
})
export class TransaccionComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService,
    private ws: WsService,
    private alertsService: AlertsService
  ) { }

  //icono


  //Form
  telefono: string = '';
  email: string = '';
  motivosLista: Motivo[] = [];
  motivo!: Motivo;
  dinero: number = 0;
  saldo: number = 0;
  selectedOption: string[] = ['Desconocido', '#CBCBCB'];
  wallet!: Wallet;

  //
  contactoLista: Motivo[] = [];

  //

  //Vista de Transaccion exitosa
  fecha: string = '';
  hora: string = '';
  IdTransaccion: string = '';
  Monto: string = '';
  Destinatario: string = '';
  MotivoExitosotransaccion: string = '';
  userTelefonoPropio: any;
  userEmailPropio: any;

  ngOnInit(): void {
    this.resetTimeout();
    this.ws.getWs().subscribe(this.switchHandler.bind(this));
    let userId = this.auth.getMyUser()?.uid!;
    this.user.getUserMongo(userId).subscribe((user) => {
      this.userTelefonoPropio = user.numero;
    });
    this.userEmailPropio = this.auth.getMyUser()?.email;

    this.user.getWallet(userId).subscribe((wallet) => {
      this.wallet = wallet;
      this.motivosLista = wallet.motivos;
    });
  }

  resetTimeout() {
    this.ws.timeOut(this.handleTimeOut.bind(this));
  }

  handleTimeOut() {
    this.auth.logout();
    this.router.navigate(['']);
  }

  switchHandler(evento: any) {
    console.log(evento);
    switch (evento.type) {
      case 'com.sofka.domain.wallet.eventos.TransferenciaExitosa':
        this.updateTransConfirmation(evento);
        break;
    }
  }

  // Primero valido el dinero  Y llamo VALIDACION_CONTACTO_EXISTENTE
  validacion_datos_propios() {
    if (
      this.email == this.userEmailPropio ||
      this.telefono == this.userTelefonoPropio
    ) {
      Swal.fire(
        'Error',
        'El destinatario no puede ser usted mismo!',
        'warning'
      );
      return false;
    } else {
      return true;
    }
  }

  validar_dinero() {
    this.user.getWallet(this.auth.usuarioLogueado().uid).subscribe((data) => {
      this.saldo = data.saldo;
      if (this.dinero < 1 || this.dinero > this.saldo) {
        // this.dinero > data.saldo || this.dinero < 1)
        Swal.fire(
          'Error',
          'Valor de la transaccion no valido, por favor revise que cuente con saldo suficiente para realizar la transacción',
          'warning'
        );
      } else {
        if (this.validacion_datos_propios()) {
          this.validacion_campos_no_vacios();
        }
      }
    });
  }

  validacion_campos_no_vacios() {
    if (this.email == '' && this.telefono == '') {
      Swal.fire(
        'Error',
        'Debe de ingresar un numero de telefono o un email',
        'warning'
      );
    } else {
      this.validacion_usuario_destino(this.telefono, this.email);
    }
  }

  validacion_usuario_destino(telefono: string, email: string) {
    if (telefono == '') {
      telefono = 'QUERYBYEMAIL';
    }
    if (email == '') {
      email = 'QUERYBYTELEFONO';
    }
    this.user.validar_alguno(telefono, email).subscribe({
      next: (res) => {
        if (res) {
          this.transaccion_armar_peticion();
        } else {
          Swal.fire(
            'error',
            'Este usuario no dispone de wallet, revise tener correctamente los datos del destinatario',
            'warning'
          );
        }
      },
    });
  }

  transaccion_armar_peticion() {
    if (this.email == '') {
      this.user
        .obtener_contacto_porTelefono(this.telefono)
        .subscribe((data) => {
          if (data) {
            this.alertaConfirmar(data);
          } else {
            // this.alertaError();
          }
        });
    } else {
      this.user.obtener_contacto_porEmail(this.email).subscribe((data) => {
        if (data) {
          this.alertaConfirmar(data);
        } else {
          this.alertaError();
        }
      });
    }
  }

  alertaConfirmar(data: Usuario) {
    this.alertsService.confirm({
      title: '¿Desea realizar la transferencia?',
      text: `Valor a enviar USD: ${this.dinero}\n Destinatario: ${this.email == "" ? data.numero : data.email}\n Motivo de transferencia: ${this.selectedOption[0]}`,
      bodyDeConfirmacion: 'Espere por favor...',
      tituloDeConfirmacion: 'Transferencia en progreso',
      bodyDelCancel: 'No se pudo realizar la transferencia',
      tituloDelCancel: 'Error',
      callback: () => {
        this.peticionTransferencia(data).subscribe(console.log);
      },
    });
  }

  peticionTransferencia(data: Usuario) {
    const { usuarioId } = data;
    return this.user.enviarTransaccion({
      walletDestino: usuarioId,
      walletOrigen: this.auth.usuarioLogueado().uid,
      motivo: {
        description: this.selectedOption[0],
        color: this.selectedOption[1],
      },
      valor: this.dinero,
    });
  }

  updateTransConfirmation(evento: any) {
    let fecha = new Date(evento.when.seconds * 1000);
    this.fecha = fecha.toDateString();
    this.hora = fecha.toTimeString();
    this.IdTransaccion = evento.transferenciaID.uuid;
    this.Destinatario = this.email == '' ? this.telefono : this.email;
    this.Monto = evento.valor.monto;
    this.MotivoExitosotransaccion = this.selectedOption[0];
    this.vista_exitosa();
  }

  vista_exitosa() {
    let seleccionar = document.getElementById('contenedor_general');
    seleccionar?.classList.add('ocultar');
    let seleccionarExitoso = document.getElementById(
      'contenedor_oculto_exitoso'
    );
    seleccionarExitoso?.classList.remove('ocultar');
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

  alertaError() {
    Swal.fire(
      'error',
      'No se pudo realizar la transferencia, por favor revise los datos ingresados e intente nuevamente',
      'warning'
    );
  }

  vista_nueva_transfer() {
    let seleccionar = document.getElementById('contenedor_general');
    seleccionar?.classList.remove('ocultar');
    let seleccionarExitoso = document.getElementById(
      'contenedor_oculto_exitoso'
    );
    seleccionarExitoso?.classList.add('ocultar');
  }
}
