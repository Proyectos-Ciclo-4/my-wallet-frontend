import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario-backend.model';
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
    private webSocket: WsService,
    private alertsService: AlertsService
  ) {}

  telefono: string = '';
  email: string = '';
  motivo: string = '';
  dinero: number = 0;
  saldo: number = 0;

  
  // habilitarBoton = false;

  ngOnInit(): void {}

  // Primero valido el dinero  Y llamo VALIDACION_CONTACTO_EXISTENTE

  validar_dinero() {
    this.user.getWallet(this.auth.usuarioLogueado().uid).subscribe((data) => {
      this.saldo = data.saldo;
    })
    if (this.dinero < 1 || this.dinero > this.saldo) {
      // this.dinero > data.saldo || this.dinero < 1)
      Swal.fire('Error', 'Valor de la transaccion no valido, por favor revise que cuente con saldo suficiente para realizar la transacción', 'warning');
    } else {
      this.validacion_contacto_existente();
    }
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
      this.verifUserDestino(this.telefono,this.email)
    }
  }

  enviarTransferencia(data: Usuario) {
    const { usuarioId } = data;
    if (this.motivo == '') {
      this.motivo = 'Desconocido';
      // aca compruebo si esta sin llenar el input de motivo y lo seteo a desconocido
    }
    return this.user.enviarTransaccion({
      walletDestino: usuarioId,
      walletOrigen: this.auth.usuarioLogueado().uid,
      motivo: this.motivo,
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

  verifUserDestino(telefono:string,email:string){ 
    
    if (telefono == ""){
      telefono = "QUERYBYEMAIL"
    }
    if (email == ""){
      email = "QUERYBYTELEFONO"
    }

    this.user.validar_alguno(telefono, email).subscribe({
    next: (res) => {
      if (res == true) {
        Swal.fire(
          'Usuario Encontrado ',
          'Este usuario dispone de billetera',
          'info'
        );
        this.enviar_transaccion();
      } else {
        Swal.fire('error', 'Este usuario no dispone de wallet,revise tener correctamente los datos del destinatario', 'warning');
      }
    },
  });}

  enviar_transaccion() {
    if(this.email==""){
    this.user.obtener_contacto_porTelefono(this.telefono).subscribe((data) => {
      if (data) {
        this.alertaConfirmar(data)
      } else {
       // this.alertaError();
      }
    })} else {
      console.log("Entro al else")
      this.user.obtener_contacto_porEmail(this.email).subscribe((data) => {
        if (data) {
          console.log(data)
          this.alertaConfirmar(data)
        } else {
         // this.alertaError();
        }})

}

  }

  alertaConfirmar(data:Usuario){
    this.alertsService.confirm({
      title: '¿Desea realizar la transferencia?',
      text: `Valor a enviar USD: ${this.dinero} Destinatario: ${data.email} Motivo de transferencia: ${this.motivo}`,
      bodyDeConfirmacion: 'Transferencia realizada con exito',
      tituloDeConfirmacion: 'Transferencia realizada',
      bodyDelCancel: 'No se pudo realizar la transferencia',
      tituloDelCancel: 'Error',
      callback: () => {
        this.enviarTransferencia(data).subscribe(console.log);
      },
    });
  }


}
