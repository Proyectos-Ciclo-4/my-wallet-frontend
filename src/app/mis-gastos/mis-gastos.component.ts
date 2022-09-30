import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppConfig } from '../models/chartconfig.model';
import { ChartConfigService } from '../services/chart-config.service';
import { Gastos } from '../models/gastos.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TransaccionDeHistorial, Wallet } from '../models/wallet.model';
import { WsService } from '../services/ws.service';

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
  historyQuery: TransaccionDeHistorial[] = [];
  mostExpensive = { color: '#f45g56', description: 'Test' };
  cheapest = { color: '#fff192', description: 'Test' };
  walletId!: string;
  wallet!: Wallet;

  constructor(
    private configService: ChartConfigService,
    private userService: UserService,
    private router: Router,
    private auth: AuthService,
    private ws: WsService
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
    this.ws.timeOut();
    this.config = this.configService.config;
    this.updateChartOptions();

    this.subscription = this.configService.configUpdate$.subscribe((config) => {
      this.config = config;
      this.updateChartOptions();
    });

    this.walletId = this.auth.getMyUser()?.uid!;
    this.userService.getWallet(this.walletId).subscribe((wallet) => {
      this.wallet = wallet;
    });
  }

  private transformHistoryInDataSets(
    history: TransaccionDeHistorial[]
  ): Gastos {
    let dataP = history.map((transaction) => Math.abs(transaction.valor));
    let total = dataP.reduce((a, b) => a + b, 0);
    let data = dataP.map((valor) => {
      return (valor * 100) / total;
    });

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

  resetTimeout() {
    this.ws.timeOut();
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
        this.historyQuery = this.transHistReformatter(response);

        const sortedResult = this.historyQuery
          .filter((a) => a.valor < 0)
          .sort((a, b) => b.valor - a.valor);
        const cheapest = sortedResult[0];
        const expensive = sortedResult[sortedResult.length - 1];

        this.mostExpensive = {
          color: `${expensive.motivo.color}`,
          description: expensive.motivo.descripcion,
        };

        this.cheapest = {
          color: `${cheapest.motivo.color}`,
          description: cheapest.motivo.descripcion,
        };

        const mappedTransactions =
          this.transformHistoryInDataSets(sortedResult);
        this.data = this.getData(mappedTransactions);
      });
  }

  private formatTime(date: Date) {
    return date.toISOString().split('T')[0];
  }

  private transHistReformatter(
    transHistorial: TransaccionDeHistorial[]
  ): TransaccionDeHistorial[] {
    return this.wallet.motivos.map((motivoA) => {
      return transHistorial
        .filter(
          (transaccion) => transaccion.motivo.descripcion == motivoA.descripcion
        )
        .reduce(
          (a, b) => {
            let currentValue = { ...b };
            a.valor += b.valor;
            return currentValue;
          },
          { valor: 0 } as TransaccionDeHistorial
        );
    });

    // return transHistorial.map(
    //   (unformatted) =>
    //     ({
    //       motivo: {
    //         descripcion: unformatted.motivo.descripcion,
    //         color: unformatted.motivo.color,
    //       },
    //       valor: Math.abs(unformatted.valor),
    //     } as Transaction)
    // );
  }

  // return transHistorial.map(
  //   (unformatted) =>
  //     ({
  //       motivo: {
  //         descripcion: unformatted.motivo.descripcion,
  //         color: unformatted.motivo.color,
  //       },
  //       valor: Math.abs(unformatted.valor),
  //     } as Transaction)
  // );

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
