import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  _URL_AUTH,
  _URL_GET_USERS,
  _URL_GET_RESULTADOS,
  _URL_GET_PREGUNTAS_MODULO,
} from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:5000/api'; // Cambia esto a la URL de tu API

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

  public getPreguntas(idModulo: any): Observable<any> {
    return this.http.get(_URL_GET_PREGUNTAS_MODULO, { params: { idModulo } });
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

  public getPreguntas(selectedModulo: any): Observable<any> {
    return this.http.get(
      `http://localhost:3200/getPreguntas?id_modulo=${selectedModulo}`
    );
  }

  public addPregunta(data: any): Observable<any> {
    return this.http.post('http://localhost:3200/addPregunta', data);
  }

  public addModulo(data: any): Observable<any> {
    return this.http.post('http://localhost:3200/addModulo', data);
  }

  public editPregunta(pregunta: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/preguntas/${pregunta.idPregunta}`, pregunta);
  }

  public deletePregunta(idPregunta: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/preguntas/${idPregunta}`);
  }

  public deleteModulo(idModulo: number): Observable<any> {
    return this.http.delete(`http://localhost:3200/deleteModulo/${idModulo}`);
  }

  public editModulo(data: any): Observable<any> {
    return this.http.put('http://localhost:3200/editModulo', data);
  }

  public getExamen(idExamen: number): Observable<any> {
    return this.http.get(`http://localhost:3200/getExamen/${idExamen}`);
  }

  public getInfoExamen(idExamen: number): Observable<any> {
    return this.http.get(`http://localhost:3200/getInfoExamen/${idExamen}`);
  }

  public saveAnswers(answers: any): Observable<any> {
    return this.http.post('http://localhost:3200/saveAnswers', answers);
  }

  public logout() {
    // Aquí puedes limpiar cualquier dato de sesión si es necesario
    console.log('Usuario deslogueado');
  }

  assignExamen(examen: any): Observable<any> {
    return this.http.post('http://localhost:5000/assignExamen', examen);
  }

  public getExamenDetails(idExamen: number): Observable<any> {
    return this.http.get(`http://localhost:5000/getExamenDetails/${idExamen}`);
  }

  public addPreguntasFromCSV(preguntas: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/preguntas/csv`, { preguntas });
  }
}
