import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppConfig } from '../models/chartconfig.model';
import { ChartConfigService } from '../services/chart-config.service';
import { Gastos } from '../models/gastos.model';
import { UserService } from '../services/user.service';
import { Transaction } from '../models/history.model';

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.component.html',
  styleUrls: ['./mis-gastos.component.scss'],
})
export class MisGastosComponent implements OnInit, OnDestroy {
  data: any;
  chartOptions: any;
  subscription!: Subscription;
  config!: AppConfig;
  from: Date = new Date();
  until: Date = new Date();
  form!: FormGroup;

  constructor(
    private configService: ChartConfigService,
    private userService: UserService
  ) {
    this.setAvailableDates();
    this.buildForm();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.config = this.configService.config;
    this.updateChartOptions();
    this.subscription = this.configService.configUpdate$.subscribe((config) => {
      this.config = config;
      this.updateChartOptions();
    });
  }

  private transformHistoryInDataSets(history: Transaction[]): Gastos {
    let data = history.map((transaction) => transaction.valor);

    let backgroundColor = history.map(
      (transaction) => transaction.motivo.color
    );

    let hoverBackgroundColor = history.map(
      (transaction) => transaction.motivo.color
    );

    let labels = history.map((transaction) => transaction.motivo.descripcion);
    let dataset = { data, backgroundColor, hoverBackgroundColor };

    return { labels, dataset };
  }

  private getData(gastos: Gastos) {
    const { labels, dataset } = gastos;
    return {
      labels,
      datasets: [{ ...dataset }],
    };
  }

  private buildForm() {
    this.form = new FormGroup({
      from: new FormControl(this.from),
      until: new FormControl(this.until),
    });
  }

  sendForm() {
    // this.userService.getHistory(this.form.value).subscribe((data) => {});
    // console.log(this.form.value);
    const result = this.userService.getHistory(this.form.value);
    const mappedTransactions = this.transformHistoryInDataSets(result);
    this.data = this.getData(mappedTransactions);
  }

  private setAvailableDates() {
    const today = new Date();
    this.from = new Date(today.getFullYear(), today.getMonth(), 1);
    this.until = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }

  private updateChartOptions() {
    this.chartOptions =
      this.config && this.config.dark
        ? this.getDarkTheme()
        : this.getLightTheme();
  }

  getLightTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
    };
  }

  getDarkTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef',
          },
        },
      },
    };
  }
}
