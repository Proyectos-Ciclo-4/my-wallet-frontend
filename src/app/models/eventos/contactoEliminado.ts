export interface ContactoEliminado {
  walletID:        ID;
  contactoID:      ID;
  when:            When;
  uuid:            string;
  type:            string;
  aggregateRootId: string;
  aggregate:       string;
  versionType:     number;
}

export interface ID {
  uuid: string;
}

export interface When {
  seconds: number;
  nanos:   number;
}
