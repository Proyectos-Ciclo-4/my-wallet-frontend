import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  canNavigate: boolean = true;
  signOutIcon: IconDefinition = faSignOutAlt;

  constructor(private auth: AuthService, private route: Router) {
    this.route.events
      .pipe(filter((value) => value instanceof NavigationStart))
      .subscribe((value) => {
        if (value instanceof NavigationStart) {
          if (value.url === '/registro' || value.url === '/') {
            console.log('registro');
            this.canNavigate = false;
            return;
          }
          this.canNavigate = true;
        }
      });
  }

  userName: string = '';
  userImage: string = '';

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      this.userName = user ? '' + user.displayName : '';
      this.userImage = user ? '' + user.photoURL : '';
    });
  }

  logout() {
    this.auth.logout().then(() => {
      this.route.navigate(['/']);
    });
  }

  home() {
    if (this.canNavigate) {
      this.route.navigate(['home']);
    }
  }
}
