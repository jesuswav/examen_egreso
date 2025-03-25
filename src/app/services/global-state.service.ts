import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  constructor() {}

  private idUsuario: number = 0;
  private idModulo: number = 0;
  private examen: any[] = [];
  private respuestasArray: any[] = [];

  // manejo del usuario
  getUsuario(): number {
    return this.idUsuario;
  }
  setUsuario(newValue: number) {
    this.idUsuario = newValue;
  }

  // manejo del modulo
  getModulo(): number {
    return this.idModulo;
  }
  setModulo(newValue: number) {
    this.idModulo = newValue;
  }

  // manejo de la información del examen
  getExamen(): any {
    return this.examen;
  }
  setExamen(newValue: any) {
    this.examen = newValue;
  }

  // manejo de las respuestas enviadas por medio del modal
  getRespuestasArray(): any {
    return this.respuestasArray;
  }
  setRespuestasArray(respuestasArray: any[]) {
    this.respuestasArray = respuestasArray
  }
}
