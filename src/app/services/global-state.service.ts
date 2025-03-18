import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  constructor() {}

  private idUsuario: number = 0;
  private idModulo: number = 0;

  getUsuario(): number {
    return this.idUsuario;
  }

  setUsuario(newValue: number) {
    this.idUsuario = newValue;
  }

  getModulo(): number {
    return this.idModulo;
  }

  setModulo(newValue: number) {
    this.idModulo = newValue;
  }
}
