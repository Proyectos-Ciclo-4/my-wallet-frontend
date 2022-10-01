import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private auth: AuthService, private route: Router) {}

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
    this.route.navigate(['home']);
  }
}
