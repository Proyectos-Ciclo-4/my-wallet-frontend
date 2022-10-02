import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  private URL_WS: String = 'wss://app-wallet-socket.herokuapp.com/wallet';
  private webSocket!: WebSocketSubject<unknown>;
  private timeOutId!: any;

  constructor(private auth: AuthService) {
    this.reconnectWs();
    this.ping();
  }

  reconnectWs() {
    this.webSocket = webSocket(
      `${this.URL_WS}/${this.auth.usuarioLogueado().uid}`
    );
  }

  getWs(): WebSocketSubject<unknown> {
    return this.webSocket;
  }

  close() {
    this.webSocket.unsubscribe();
  }

  private ping() {
    setInterval(() => {
      this.webSocket.next('ping');
    }, 10000);
  }

  timeOut(callBack: () => void) {
    // this.ClearTimeOut();
    //
    // this.timeOutId = setTimeout(() => {
    //   alert('Se ha cerrado la sesion por inactividad');
    //   callBack();
    // }, 180000);
  }

  private ClearTimeOut() {
    if (this.timeOutId) {
      clearTimeout(this.timeOutId);
    }
  }
}
