import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor() { }

  confirm(datos: datosDeConfirmacion): void {
    const {
      bodyDeConfirmacion,
      bodyDelCancel,
      callback,
      text,
      title,
      tituloDeConfirmacion,
      tituloDelCancel,
    } = datos;

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          callback();
          swalWithBootstrapButtons.fire(
            tituloDeConfirmacion,
            bodyDeConfirmacion,
            'success'
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            tituloDelCancel,
            bodyDelCancel,
            'error'
          );
        }
      });
  }
}

interface datosDeConfirmacion {
  title: string;
  text: string;
  tituloDeConfirmacion: string;
  bodyDeConfirmacion: string;
  tituloDelCancel: string;
  bodyDelCancel: string;
  callback: Function;
}
