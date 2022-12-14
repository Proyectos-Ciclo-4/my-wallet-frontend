export interface History {
  transactions: Transaction[];
}

export interface Transaction {
  walletId: string;
  fecha: Fecha;
  estado: string;
  motivo: Motivo;
  valor: number;
  destino: string;
  transferencia_id: string;
}

export interface TransactionAlternative {
  walletId: string;
  fecha: string;
  estado: string;
  motivo: Motivo;
  valor: number;
  destino: string;
  transferencia_id: string;
}

export interface Fecha {
  date: string;
}

export interface Motivo {
  descripcion: string;
  color: string;
}

export interface DateClass {
  $numberLong: string;
}
