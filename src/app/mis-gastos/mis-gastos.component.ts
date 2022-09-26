import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.component.html',
  styleUrls: ['./mis-gastos.component.scss'],
})
export class MisGastosComponent implements OnInit {
  from: Date = new Date();
  until: Date = new Date();
  form!: FormGroup;

  constructor() {
    this.setAvailableDates();
    this.buildForm();
  }

  ngOnInit(): void {}

  private buildForm() {
    this.form = new FormGroup({
      from: new FormControl(this.from),
      until: new FormControl(this.until),
    });
  }

  sendForm() {
    console.log(this.form.value);
  }

  private setAvailableDates() {
    const today = new Date();
    this.from = new Date(today.getFullYear(), today.getMonth(), 1);
    this.until = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }
}
