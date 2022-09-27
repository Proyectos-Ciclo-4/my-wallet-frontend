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

  // miFormulario = new FormGroup({
  // telefono: new FormControl("",[Validators.required,Validators.minLength(9),Validators.maxLength(14)] ),
  // email: new FormControl("",[Validators.required, Validators.email]),
  // motivo: new FormControl("",Validators.required),
  // dinero: new FormControl(0,[Validators.required,Validators.min(1),Validators.max(40)])

  // })

  telefono: string = '';
  email: string = '';
  motivo: string = '';
  dinero: number = 0;
  // habilitarBoton = false;

  ngOnInit(): void {}

  validar_dinero() {
    // this.user.getWallet(this.auth.usuarioLogueado().uid).subscribe((data) => {

    if (this.dinero < 1) {
      // this.dinero > data.saldo || this.dinero < 1)
      Swal.fire('error', 'Valor de la transaccion no valido', 'warning');
    } else {
      this.validacion_contacto_existente();
    }
  }
  

  validacion_contacto_existente() {
    if (this.email == '' && this.telefono == '') {
      Swal.fire(
        'error',
        'Debe ingresar un numero de telefono O email',
        'warning'
      );
    } else {
      this.user.validar_alguno(this.telefono, this.email).subscribe({
        next: (res) => {
          if (res == true) {            
            Swal.fire(
              'Usuario Encontrado ',
              'Este usuario dispone de billetera',
              'info'
            );
            this.enviar_transaccion()
          } else {
            Swal.fire('error', 'Este usuario no dispone de wallet', 'warning');
          }
        },
      });
    }
  }
  enviar_transaccion() {
    this.user.obtener_contacto(this.email,this.telefono).subscribe((data) => {
      if (data) {
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
      } else {
        this.alertaError();
      }
    });
  }

 
  

  enviarTransferencia(data: Usuario) {
    const { usuarioId } = data;
    if (this.motivo == '') {
      this.motivo = 'Desconocido';
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
}
