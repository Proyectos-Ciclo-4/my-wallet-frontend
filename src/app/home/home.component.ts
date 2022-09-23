import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { WsService } from '../services/ws.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private userId!: string;

  constructor(private auth:AuthService,private router:Router,private activatedRoute: ActivatedRoute,private ws:WsService,) { this.userId = this.auth.getMyUser()?.uid!;}
  



  ngOnInit() {

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => {
        return this.ws.start(id);
      })
      ).subscribe({

        next: (event: any) => {
          console.log({type:event.type, event});

          switch (event.type) {

            case 'primer,evento':

              break;
            }
          }
        });
    }

}
