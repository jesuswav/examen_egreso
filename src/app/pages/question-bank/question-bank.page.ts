import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonList, IonGrid, IonRow, IonCol, IonBadge } from '@ionic/angular/standalone';

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.page.html',
  styleUrls: ['./question-bank.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonList, IonBadge, CommonModule, FormsModule, HttpClientModule]
})
export class QuestionBankPage implements OnInit {
  pregunta = {
    id: null,
    pregunta: '',
    respuesta1: '',
    respuesta2: '',
    respuesta3: '',
    respuesta4: '',
    respuesta_correcta: '',
    id_modulo: ''
  };

  modulos: any[] = [];
  preguntas: any[] = [];
  selectedModulo: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadModulos();
  }

  loadModulos() {
    this.http.get('http://localhost:5000/getModulos').subscribe((response: any) => {
      this.modulos = response;
    }, error => {
      console.error('Error al cargar los módulos:', error);
    });
  }

  loadPreguntas() {
    if (this.selectedModulo) {
      this.http.get(`http://localhost:5000/getPreguntas?id_modulo=${this.selectedModulo}`).subscribe((response: any) => {
        this.preguntas = response;
      }, error => {
        console.error('Error al cargar las preguntas:', error);
      });
    }
  }

  addPregunta() {
    if (this.pregunta.id) {
      // Editar pregunta existente
      this.http.put(`http://localhost:5000/updatePregunta/${this.pregunta.id}`, this.pregunta).subscribe(response => {
        console.log('Pregunta actualizada:', response);
        this.loadPreguntas(); // Recargar la lista de preguntas después de actualizar una pregunta
        this.resetForm();
      }, error => {
        console.error('Error al actualizar pregunta:', error);
      });
    } else {
      // Agregar nueva pregunta
      this.http.post('http://localhost:5000/addPregunta', this.pregunta).subscribe(response => {
        console.log('Pregunta agregada:', response);
        this.loadPreguntas(); // Recargar la lista de preguntas después de agregar una nueva
        this.resetForm();
      }, error => {
        console.error('Error al agregar pregunta:', error);
      });
    }
  }

  editPregunta(pregunta: any) {
    this.pregunta = { ...pregunta };
  }

  deletePregunta(id: number) {
    this.http.delete(`http://localhost:5000/deletePregunta/${id}`).subscribe(response => {
      console.log('Pregunta eliminada:', response);
      this.loadPreguntas(); // Recargar la lista de preguntas después de eliminar una pregunta
    }, error => {
      console.error('Error al eliminar pregunta:', error);
    });
  }

  resetForm() {
    this.pregunta = {
      id: null,
      pregunta: '',
      respuesta1: '',
      respuesta2: '',
      respuesta3: '',
      respuesta4: '',
      respuesta_correcta: '',
      id_modulo: ''
    };
  }

  getRespuestaCorrecta(pregunta: any) {
    const respuestas = ['respuesta1', 'respuesta2', 'respuesta3', 'respuesta4'];
    const incisos = ['A', 'B', 'C', 'D'];
    const index = parseInt(pregunta.respuesta_correcta) - 1;
    return `${incisos[index]}. ${pregunta[respuestas[index]]}`;
  }
}
