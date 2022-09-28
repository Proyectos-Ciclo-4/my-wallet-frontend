import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppConfig } from '../models/chartconfig.model';
import { ChartConfigService } from '../services/chart-config.service';
import { Gastos } from '../models/gastos.model';
import { UserService } from '../services/user.service';
import { Transaction } from '../models/history.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TransaccionDeHistorial } from '../models/wallet.model';

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
  historyQuery: Array<Transaction> = [];
  mostExpensive = { color: '#f45g56', description: 'Test' };
  cheapest = { color: '#fff192', description: 'Test' };
  walletId!: string;

  constructor(
    private configService: ChartConfigService,
    private userService: UserService,
    private router: Router,
    private auth: AuthService
  ) {
    this.setAvailableDates();
    this.buildForm();
  }

  //actualizar grafico con base a porcentajes
  //100% total de gastos en el perido de tiempo seleccionado
  //consulto gastos en ese tiempo
  //actualizar el modelo

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
    this.walletId = this.auth.getMyUser()?.uid!;
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
    let fromURL = this.formatTime(this.from);
    let untilURL = this.formatTime(this.until);

    this.userService
      .getHistory(fromURL, untilURL, this.walletId)
      .subscribe((response) => {
        console.log(response);
        this.historyQuery = this.transHistReformatter(response);
        console.log(this.historyQuery);
      });

    // const sortedResult = this.historyQuery.sort((a, b) => b.valor - a.valor);
    // const expensive = sortedResult[0];
    // const cheapest = sortedResult[sortedResult.length - 1];

    // this.mostExpensive = {
    //   color: `${expensive.motivo.color}`,
    //   description: expensive.motivo.descripcion,
    // };

    // this.cheapest = {
    //   color: `${cheapest.motivo.color}`,
    //   description: cheapest.motivo.descripcion,
    // };

    const mappedTransactions = this.transformHistoryInDataSets(
      this.historyQuery
    );
    this.data = this.getData(mappedTransactions);
  }

  private formatTime(date: Date) {
    return date.toISOString().split('T')[0];
  }

  private transHistReformatter(
    transHistorial: Array<TransaccionDeHistorial>
  ): Transaction[] {
    return transHistorial.map(
      (unformatted) =>
        ({
          motivo: unformatted.motivo,
          valor: Math.abs(unformatted.valor),
        } as Transaction)
    );
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

  logout() {
    this.router.navigate(['']);
    this.auth.logout();
  }
}
