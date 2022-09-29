import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faAddressBook,
  faClockRotateLeft,
  faMoneyBillTransfer,
  faMoneyCheck,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { History, TransactionAlternative } from '../models/history.model';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {
  transferenciaIcon = faMoneyBillTransfer;
  contactosIcon = faAddressBook;
  historialIcon = faClockRotateLeft;
  motivosIcon = faMoneyCheck;

  historial: TransactionAlternative[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private user: UserService
  ) {}

  ngOnInit(): void {
    this.user
      .getAllHistory(this.auth.usuarioLogueado().uid)
      .subscribe((historial) => {
        this.historial = historial;
      });
  }

  logout() {
    this.router.navigate(['']);
    this.auth.logout();
  }
}
