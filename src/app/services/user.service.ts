import { Injectable } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../models/Usuario.model';
import { Usuario as UsuarioBack } from '../models/usuario-backend.model';
import { HttpClient } from '@angular/common/http';
import { Wallet } from '../models/wallet.model';
import { Transferencia } from '../models/transferencia.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private http: HttpClient
  ) {}

  newUser() {
    const databaseref = collection(this.firestore, 'users');
    const user = getAuth().currentUser;
    const userref = doc(databaseref, user?.uid);
    return setDoc(userref, {
      id: user?.uid,
      nombre: user?.displayName,
      email: user?.email,
      telefono: user?.phoneNumber,
    });
  }

  private URL_HTTP: String = 'http://localhost:8084';

  listar(): Observable<Usuario[]> {
    const databaseref = collection(this.firestore, 'users');
    return collectionData(databaseref, { idField: 'id' }) as Observable<
      Usuario[]
    >;
  }

  verificarUsuarioPost(body: any) {
    return this.http.post(`${this.URL_HTTP}/new/wallet`, { ...body });
  }

  getWallet(userId: string) {
    return this.http.get<Wallet>(`${this.URL_HTTP}/wallet/${userId}`);
  }
  enviarTransaccion(body: Transferencia) {
    return this.http.post(`${this.URL_HTTP}/new/transaction/`, { ...body });
  }

  peticion_crear_contacto(body: any) {
    return this.http.post(`${this.URL_HTTP}/new/contacto`, { ...body });
  }

  obtener_contacto(telefono: string) {
    return this.http.get<UsuarioBack>(
      `${this.URL_HTTP}/walletByTelefono/${telefono}`
    );
  }
}
