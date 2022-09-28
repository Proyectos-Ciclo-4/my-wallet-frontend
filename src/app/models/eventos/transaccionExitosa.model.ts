export interface TransaccionExitosa {
  walletOrigen: TransferenciaID;
  walletDestino: TransferenciaID;
  transferenciaID: TransferenciaID;
  valor: Valor;
  motivo: Motivo;
  estado: Estado;
  when: When;
  uuid: string;
  type: string;
  aggregateRootId: string;
  aggregate: string;
  versionType: number;
}

export interface Estado {
  tipoDeEstado: string;
}

export interface Motivo {
  descripcion: string;
  color: string;
}

export interface TransferenciaID {
  uuid: string;
}

export interface Valor {
  monto: number;
}

export interface When {
  seconds: number;
  nanos: number;
}
