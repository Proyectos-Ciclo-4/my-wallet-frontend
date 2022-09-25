import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faMoneyBillTransfer, faAddressBook, faClockRotateLeft, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {

  transferenciaIcon=faMoneyBillTransfer
  contactosIcon= faAddressBook
  historialIcon=faClockRotateLeft
  motivosIcon=faMoneyCheck

  constructor(private router:Router) { }

  ngOnInit(): void {
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

}
