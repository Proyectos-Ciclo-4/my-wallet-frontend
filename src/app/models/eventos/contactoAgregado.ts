export interface ContactoAgregado {
  walletID:        ID;
  contacto:        Contacto;
  when:            When;
  uuid:            string;
  type:            string;
  aggregateRootId: string;
  aggregate:       string;
  versionType:     number;
}

export interface Contacto {
  nombre:   Nombre;
  email:    Email;
  telefono: Telefono;
  entityId: ID;
}

export interface Email {
  direccion: string;
}

export interface ID {
  uuid: string;
}

export interface Nombre {
  nombreDeUsuario: string;
}

export interface Telefono {
  numero: string;
}

export interface When {
  seconds: number;
  nanos:   number;
}
