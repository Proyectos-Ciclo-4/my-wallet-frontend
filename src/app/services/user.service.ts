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
import { TransaccionDeHistorial, Wallet } from '../models/wallet.model';
import { Transferencia } from '../models/transferencia.model';
import { HistoryGetter } from '../models/history-getter.model';
import { Motivo, Transaction } from '../models/history.model';
import { usuarioMongo } from '../models/usuarioMongo.model';
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
    //console.log("Retrieving wallet of " + userId)
    //console.log("petition: " + `${this.URL_HTTP}/wallet/${userId}`)
    //this.http.get<Wallet>(`${this.URL_HTTP}/wallet/${userId}`).subscribe((wallet) =>{
    //console.log(wallet.historial)
    //})
    return this.http.get<Wallet>(`${this.URL_HTTP}/wallet/${userId}`);
  }
  getUserMongo(walletId: string) {
    //console.log("Retrieving wallet of " + userId)
    //console.log("petition: " + `${this.URL_HTTP}/wallet/${userId}`)
    //this.http.get<Wallet>(`${this.URL_HTTP}/wallet/${userId}`).subscribe((wallet) =>{
    //console.log(wallet.historial)
    //})
    return this.http.get<usuarioMongo>(`${this.URL_HTTP}/usuario/${walletId}`);
  }
  enviarTransaccion(body: Transferencia) {
    return this.http.post(`${this.URL_HTTP}/new/transaction/`, { ...body });
  }
  peticion_crear_contacto(body: any) {
    return this.http.post(`${this.URL_HTTP}/new/contacto`, { ...body });
  }
  getHistory(startDate:string,endDate:string,walletId:string) {
    return this.http.get<TransaccionDeHistorial[]>(`${this.URL_HTTP}/history/${startDate}/to/${endDate}/of/${walletId}`);
  }
  
  // getHistory(body: HistoryGetter): Transaction[] {
  //   // return this.http.post(`${this.URL_HTTP}/history`, { ...body });
  //   return [
  //     {
  //       motivo: { color: '#42A5F5', descripcion: 'indefinido' },
  //       valor: 70,
  //     } as Transaction,
  //     {
  //       motivo: { color: '#66BB6A', descripcion: 'diversion' },
  //       valor: 90,
  //     } as Transaction,
  //     {
  //       motivo: { color: '#FFA726', descripcion: 'servicios' },
  //       valor: 50,
  //     } as Transaction,
  //   ];
  // }
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
  /*
  get_motivos(userId: string) {
    return this.http.get<Wallet>(`${this.URL_HTTP}/motivo/${userId}`);
  }


  /* nuevoMotivo(motivo:Motivo, walletId:string){
    return this.http.post(`${this.URL_HTTP}/new/motivo`, { walletId, motivo });
  }*/
  nuevoMotivo(motivo:Motivo, walletID:string){
    return this.http.post(`${this.URL_HTTP}/new/motivo/`, { walletID, ...motivo });
  }
}