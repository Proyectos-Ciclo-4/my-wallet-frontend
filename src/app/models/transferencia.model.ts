export interface Transferencia {
  walletOrigen: string;
  walletDestino: string;
  valor: number;
  motivo: { description: string; color: string };
}
