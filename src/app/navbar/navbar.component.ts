import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  visible = true;
  constructor(private rout: ActivatedRoute) {}

  ngOnInit(): void {
    if (window.location.pathname.endsWith('home')) {
      this.visible = false;
    }
    this.rout.url.subscribe({
      next: (value) => {
        if (value[0].path === 'home') {
          this.visible = true;
        } else {
          this.visible = false;
        }
      },
    });
    //console.log(this.rout.snapshot.root)
  }
}
