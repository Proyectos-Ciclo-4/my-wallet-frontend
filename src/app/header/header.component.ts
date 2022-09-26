import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public userName!: string;

  constructor(private auth:AuthService, private route:Router ) {
     this.userName = this.auth.getMyUser()?.displayName!;
     console.log(this.auth.getMyUser())

   }


  ngOnInit(): void {

    console.log(this.userName)

  }
  logout(){
    this.route.navigate(['']);
    this.auth.logout()

  }
  home() {
    this.route.navigate(['home']);
  }
}
