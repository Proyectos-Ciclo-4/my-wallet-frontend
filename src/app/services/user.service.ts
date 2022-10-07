import {Injectable} from '@angular/core';
import {Auth, getAuth} from '@angular/fire/auth';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Usuario} from '../models/Usuario.model';
import {Usuario as UsuarioBack} from '../models/usuario-backend.model';
import {HttpClient} from '@angular/common/http';
import {TransaccionDeHistorial, Wallet} from '../models/wallet.model';
import {Transferencia} from '../models/transferencia.model';
import {Motivo, TransactionAlternative} from '../models/history.model';
import {usuarioMongo} from '../models/usuarioMongo.model';
import {CrearContacto} from '../models/Contactos.model';
import {BorrarContacto} from "../models/borrarContacto.model";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private http: HttpClient
  ) {
  }

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

  private URL_HTTP: String = 'https://app-service-wallet.herokuapp.com';

  listar(): Observable<Usuario[]> {
    const databaseref = collection(this.firestore, 'users');
    return collectionData(databaseref, {idField: 'id'}) as Observable<Usuario[]>;
  }

  verificarUsuarioPost(body: any) {
    return this.http.post(`${this.URL_HTTP}/new/wallet`, {...body});
  }

  getWallet(userId: string) {
    return this.http.get<Wallet>(`${this.URL_HTTP}/wallet/${userId}`);
  }

  getUserMongo(walletId: string) {
    return this.http.get<usuarioMongo>(`${this.URL_HTTP}/usuario/${walletId}`);
  }

  enviarTransaccion(body: Transferencia) {
    return this.http.post(`${this.URL_HTTP}/new/transaction/`, {...body});
  }

  peticion_crear_contacto(body: any) {
    return this.http.post(`${this.URL_HTTP}/new/contacto`, {...body});
  }

  getContacto(body: any) {
    return this.http.get(`http://localhost:8084/usuario/`);

  }

  getHistory(startDate: string, endDate: string, walletId: string) {
    return this.http.get<TransaccionDeHistorial[]>(
      `${this.URL_HTTP}/history/${startDate}/to/${endDate}/of/${walletId}`
    );
  }

  obtener_contacto_porTelefono(telefono: string) {
    return this.http.get<UsuarioBack>(
      `${this.URL_HTTP}/walletByTelefono/${telefono}`
    );
  }

  obtener_contacto_porEmail(email: string) {
    return this.http.get<UsuarioBack>(
      `${this.URL_HTTP}/walletByEmail/${email}`
    );
  }

  validar_alguno(telefono: string, email: string) {
    return this.http.get<Boolean>(
      `${this.URL_HTTP}/validateBoth/${telefono}/email/${email}`
    );
  }

  EliminarWallet(userId: any) {
    return this.http.delete(`${this.URL_HTTP}/deletewallet/${userId}`);
  }

  EliminarContacto(body: BorrarContacto) {
    return this.http.delete(`${this.URL_HTTP}/borrar/contacto`, {body: body});
  }

  nuevoMotivo(motivo: Motivo, walletID: string) {
    return this.http.post(`${this.URL_HTTP}/new/motivo/`, {
      walletID,
      ...motivo,
    });
  }

  crear_contacto(body: CrearContacto) {
    console.log(body)
    return this.http.post(`${this.URL_HTTP}/nuevo/contacto`, {...body});
  }

  getAllHistory(id: string) {
    return this.http.get<TransactionAlternative[]>(
      `${this.URL_HTTP}/history/${id}`
    );
  }
}
