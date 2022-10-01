import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavigationStart, Router } from '@angular/router';
import { AlertsService } from '../services/alerts.service';
import { UserService } from '../services/user.service';
import { FaConfig } from '@fortawesome/angular-fontawesome';
import {
  faClock,
  faPencilAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  visible: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertsService: AlertsService,
    private user: UserService,
    private faConfig: FaConfig
  ) {
    faConfig.fixedWidth = false;

    this.router.events
      .pipe(filter((value) => value instanceof NavigationStart))
      .subscribe((value) => {
        if (value instanceof NavigationStart) {
          this.hideNavbar(value);
        }
      });
  }

  private hideNavbar(value: NavigationStart) {
    if (value.url === '/') {
      this.visible = false;
      return;
    }

    this.visible = true;
  }

  pencilIcon: IconDefinition = faPencilAlt;
  chartIcon: IconDefinition = faChartLine;
  clockIcon: IconDefinition = faClock;

  ngOnInit(): void {}

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['']);
    });
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
        this.eliminarWallet(this.auth.usuarioLogueado().uid).subscribe(
          console.log
        );
      },
    });
  }

  eliminarWallet(data: any) {
    return this.user.EliminarWallet(data);
  }
}
