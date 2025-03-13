import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { _URL_AUTH, _URL_GET_USERS, _URL_GET_RESULTADOS, _URL_GET_PREGUNTAS_MODULO } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public auth(data: any): Observable<any> {
    return this.http.post(_URL_AUTH, data);
  }

  public getUsers(): Observable<any> {
    return this.http.get(_URL_GET_USERS);
  }

  public getResultados(): Observable<any> {
    return this.http.get(_URL_GET_RESULTADOS);
  }

  public getPreguntasModulo(modulo: number): Observable<any> {
    return this.http.get(`${_URL_GET_PREGUNTAS_MODULO}?modulo=${modulo}`);
  }

  public registerUser(data: any): Observable<any> {
    return this.http.post('http://localhost:3200/registerUser', data);
  }

  public getRoles(): Observable<any> {
    return this.http.get('http://localhost:3200/getRoles');
  }

  public getCarreras(): Observable<any> {
    return this.http.get('http://localhost:3200/getCarreras');
  }

  public getAlumnosPorCarrera(): Observable<any> {
    return this.http.get('http://localhost:3200/getAlumnosPorCarrera');
  }

  public getModulos(): Observable<any> {
    return this.http.get('http://localhost:3200/getModulos');
  }

  public getPreguntas(selectedModulo: string) : Observable<any> {
    return this.http.get(`http://localhost:3200/getPreguntas?id_modulo=${selectedModulo}`)
  }

  public logout() {
    // Aquí puedes limpiar cualquier dato de sesión si es necesario
    console.log('Usuario deslogueado');
  }
}
