import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faRupiahSign } from '@fortawesome/free-solid-svg-icons';

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
  ) {}

  //Form
  telefono: string = '';
  email: string = '';
  motivosLista: Motivo[] = [];
  motivo!: Motivo;
  dinero: number = 0;
  saldo: number = 0;
  selectedOption: Array<string> = [];
  wallet!:Wallet;

  //Vista de Transaccion exitosa
  fecha: string = '';
  hora: string = '';
  IdTransaccion: string = '';
  Monto: string = '';
  Destinatario: string = '';
  MotivoExitosotransaccion: string = '';

  ngOnInit(): void {
    this.ws.getWs().subscribe(this.switchHandler.bind(this));
    let userId = this.auth.getMyUser()?.uid!;
    this.user.getWallet(userId).subscribe((wallet) => { 
      this.wallet = wallet
      this.motivosLista = wallet.motivos
      this.motivo = this.motivosLista[0]
      this.selectedOption = [this.motivo.descripcion];
      })
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

  validar_dinero() {
    console.log(this.selectedOption)
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
        this.validacion_contacto_existente();
      }
    });
  }
  //2.0 :Segundo valido usuario -revisa q no este nulo y valida que existe un usuario
  //2.2 :si se valido llama a enviar transaccion

  //3.Enviar transaccion llama a la funcion obtener contacto HTTP {telefono,mail} para obtener su usuario y recibe data
  //4.Esto llama a enviarTransferencia q le estoy pasando la respeusta de obtener contacto 3 (data)
  //5. enviarTransferencia adentro seteo el motivo a desconocido y ya llamo la peticion http post

  validacion_contacto_existente() {
    if (this.email == '' && this.telefono == '') {
      Swal.fire(
        'Error',
        'Debe ingresar un numero de telefono O email',
        'warning'
      );
    } else {
      this.verifUserDestino(this.telefono, this.email);
    }
  }

  enviarTransferencia(data: Usuario) {
    const { usuarioId } = data;
    return this.user.enviarTransaccion({
      walletDestino: usuarioId,
      walletOrigen: this.auth.usuarioLogueado().uid,
      motivo: {description: this.selectedOption[0], color: this.selectedOption[1]},
      valor: this.dinero,
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

  alertaError() {
    Swal.fire(
      'error',
      'No se pudo realizar la transferencia, por favor revise los datos ingresados e intente nuevamente',
      'warning'
    );
  }
  alertaVerif() {
    Swal.fire(
      'Verifica tu transferencia',
      'Valor a enviar USD: 50 Destinatario: josefer1472@gmail.com Motivo de transferencia: Diversion',
      'info'
    );
  }

  verifUserDestino(telefono: string, email: string) {
    if (telefono == '') {
      telefono = 'QUERYBYEMAIL';
    }
    if (email == '') {
      email = 'QUERYBYTELEFONO';
    }

    this.user.validar_alguno(telefono, email).subscribe({
    next: (res) => {
      if (res == true) {
        this.enviar_transaccion();
        console.log("Transaccion enviada")
      } else {
        Swal.fire('error', 'Este usuario no dispone de wallet, revise tener correctamente los datos del destinatario', 'warning');
      }
    },
  });}

  enviar_transaccion() {
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
      console.log('Entro al else');
      this.user.obtener_contacto_porEmail(this.email).subscribe((data) => {
        if (data) {
          console.log(data);
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
      text: `Valor a enviar USD: ${this.dinero}\n Destinatario: ${data.email}\n Motivo de transferencia: ${this.selectedOption[0]}`,
      bodyDeConfirmacion: 'Espere por favor...',
      tituloDeConfirmacion: 'Transferencia en progreso',
      bodyDelCancel: 'No se pudo realizar la transferencia',
      tituloDelCancel: 'Error',
      callback: () => {
        this.enviarTransferencia(data).subscribe(console.log);
      },
    });
  }

  updateTransConfirmation(evento: any) {
    console.log(evento)

    let unixtime = new Date(evento.when.seconds*1000).toISOString().split("T")
    this.fecha = unixtime[0]
    this.hora = (unixtime[1].split("Z")[0] + " Universal Time")
    this.IdTransaccion = evento.transferenciaID.uuid
    this.Destinatario = this.email == "" ? this.telefono : this.email
    this.Monto = evento.valor.monto
    this.MotivoExitosotransaccion = this.selectedOption[0]
    this.vista_exitosa()
  }

  vista_exitosa() {
    let seleccionar = document.getElementById('contenedor_general');
    seleccionar?.classList.add('ocultar');
    let seleccionarExitoso = document.getElementById(
      'contenedor_oculto_exitoso'
    );
    seleccionarExitoso?.classList.remove('ocultar');
  }
}
