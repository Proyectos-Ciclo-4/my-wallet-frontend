import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public userName!: string;

  constructor(private auth: AuthService, private route: Router) {
    this.userName = this.auth.getMyUser()?.displayName!;
    console.log(this.auth.getMyUser());
  }

  ngOnInit(): void {
    console.log(this.userName);
  }

  logout() {
    this.route.navigate(['']);
<<<<<<< HEAD
    this.auth.logout()
=======
    this.auth.logout();
>>>>>>> e5c8fb682fbd9fff41e8a4e4e2135916c3dbadeb
  }

  home() {
    this.route.navigate(['home']);
  }
}
