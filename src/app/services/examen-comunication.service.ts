import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamenComunicationService {

  constructor() { }

  private siguienteModuloSource = new Subject<void>();
  siguienteModulo$ = this.siguienteModuloSource.asObservable();

  // Subject para la función "comenzarExamen"
  private comenzarExamenSource = new Subject<void>();
  comenzarExamen$ = this.comenzarExamenSource.asObservable();

  // Subject para la función "cerrarModal"
  private cerrarModalSource = new Subject<void>();
  cerrarModal$ = this.cerrarModalSource.asObservable();

  siguienteModulo(): void {
    this.siguienteModuloSource.next(); // Emite un evento
  }

  // Método para emitir el evento "comenzarExamen"
  comenzarExamen(): void {
    this.comenzarExamenSource.next();
  }

  // Método para emitir el evento "cerrarModal"
  cerrarModal(): void {
    this.comenzarExamenSource.next();
  }
}
