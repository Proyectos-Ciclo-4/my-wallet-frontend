import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertsService } from '../services/alerts.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private alertsService: AlertsService,
    private user: UserService
  ) {}

  ngOnInit(): void {}

  logout() {
    this.router.navigate(['']);
    this.auth.logout();
  }

  alertaEliminarwallet() {
    this.alertsService.confirm({
      title: '¿Estás seguro que quieres cancelar tu cuenta?',
      text: `Lamentamos que quieras abandonarnos tan pronto y que no puedas seguir disfrutando de la simplicidad, seguridad y trazabilidad de MyWallet. Si quieres continuar con el proceso de cierre, da clic en SI, de lo contrario da click en cancelar`,
      bodyDeConfirmacion: 'Tu solicitud se encuentra en proceso',
      tituloDeConfirmacion: 'EN PROCESO',
      bodyDelCancel: 'Que gusto que desees continuar con Nosotros',
      tituloDelCancel: '  ',
      callback: () => {
        this.eliminarWallet(this.userId).subscribe(console.log);
      },
    });
  }

  userId(userId: any) {
    throw new Error('Method not implemented.');
  }

  eliminarWallet(data: any) {
    return this.user.EliminarWallet(data);
  }
}
