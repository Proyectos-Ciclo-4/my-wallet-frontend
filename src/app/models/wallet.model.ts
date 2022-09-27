export interface Wallet {
  walletId:  string;
  motivos:   string[];
  usuario:   string;
  saldo:     number;
  historial: Transacion[];
}

interface Transacion{
  walletId:         string;
  fecha:            string;
  estado:           string;
  motivo:           string;
  valor:            number;
  destino:          string;
  transferencia_id: string;
}
