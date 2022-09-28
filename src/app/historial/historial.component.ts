import { Component, OnInit } from '@angular/core';
import { provideAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { faMoneyBillTransfer, faAddressBook, faClockRotateLeft, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';


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

  historial: any = [
    {
      fecha: { date: '2022/08/12' },
      hora: '12:00',
      tipo:'transferencia',
      monto: '-160',
      origen_destino:'josefer1472@gmail.com',
      motivo:'diversion',

      fecha1: { date: '2022/08/12' },
      hora1: '22:25',
      tipo1:'deposito',
      monto1: '+400',
      origen_destino1:'573678769865',
      motivo1:'pagos',
    },
  ];



  constructor(private router:Router,private auth:AuthService) { }

  ngOnInit(): void {
  }

      logout(){
        this.router.navigate(['']);
        this.auth.logout()
      }

}
