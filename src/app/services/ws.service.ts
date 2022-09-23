import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  private URL_WS: String = 'ws://localhost:8082/wallet';
  private webSocket!: WebSocketSubject<unknown>;

  constructor(private http: HttpClient, private auth: AuthService) {}

  start(id: string): WebSocketSubject<unknown> {
    this.webSocket = webSocket(`${this.URL_WS}/${id}`);
    return this.webSocket;
  }

  close() {
    this.webSocket.closed;
  }
}
