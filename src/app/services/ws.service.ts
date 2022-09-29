import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  private URL_WS: String = 'ws://localhost:8082/wallet';
  private webSocket!: WebSocketSubject<unknown>;

  constructor(private auth: AuthService) {
    this.reconnectWs();
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
}
