import { HistorialComponent } from '../historial/historial.component';
import { Motivo } from './motivo.model';

export interface Wallet {
  contactos: ContactoWallet[]
  walletId: string;
  motivos: Motivo[];
  usuario: string;
  saldo: number;
  historial: TransaccionDeHistorial[];
}
export interface ContactoWallet{
  walletId: string, 
  nombre: string,
  telefono: string, 
  email: string
}

export interface TransaccionDeHistorial {
  walletId: string;
  fecha: string;
  estado: string;
  motivo: Motivo;
  valor: number;
  destino: string;
  transferencia_id: string;
}
