import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.page.html',
  styleUrls: ['./question-bank.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonList,
    IonBadge,
    CommonModule,
    FormsModule,
  ],
  providers: [HttpClient], // Proporciona HttpClient aquí
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
    id_modulo: 0,
  };

  modulos: any[] = [];
  preguntas: any[] = [];
  selectedModulo: any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadModulos();
  }

  loadModulos() {
    this.authService.getModulos().subscribe({
      next: (res: any) => {
        console.log('Modulos: ', res);
        this.modulos = res;
      },
      error: (error) => {
        console.error('Error al obtener los modulos:', error);
      },
    });
  }

  loadPreguntas() {
    console.log(this.selectedModulo)
    this.authService.getPreguntas(this.selectedModulo).subscribe({
      next: (res: any) => {
        console.log('Preguntas: ', res);
        this.preguntas = res;
      },
      error: (error) => {
        console.error('Error al obtener las preguntas:', error);
      },
    });
  }

  addPregunta() {
    console.log('pregunta: ', this.pregunta.id)
    if (this.pregunta.id) {
      this.authService.updatePregunta(this.pregunta).subscribe({
        next: (res: any) => {
          console.log('Pregunta actualizada:', res);
          this.loadPreguntas(); // Recargar la lista de preguntas después de actualizar una pregunta
          this.resetForm();
        },
        error: (error) => {
          console.error('Error al actualizar pregunta:', error);
        },
      });
    } else {
      console.log(this.pregunta)
      this.authService.addPregunta(this.pregunta).subscribe({
        next: (res: any) => {
          console.log('Pregunta agregada:', res);
          this.loadPreguntas(); // Recargar la lista de preguntas después de agregar una nueva
          this.resetForm();
        },
        error: (error) => {
          console.error('Error al agregar pregunta:', error);
        },
      });
    }
  }

  editPregunta(pregunta: any) {
    this.pregunta = { ...pregunta };
  }

  deletePregunta(id: number) {
    this.authService.deletePregunta(id).subscribe({
      next: (res: any) => {
        console.log('Pregunta eliminada:', res);
        this.loadPreguntas(); // Recargar la lista de preguntas después de eliminar una pregunta
      },
      error: (error) => {
        console.error('Error al obtener roles:', error);
      },
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
      id_modulo: 0,
    };
  }

  getRespuestaCorrecta(pregunta: any) {
    const respuestas = ['respuesta1', 'respuesta2', 'respuesta3', 'respuesta4'];
    const incisos = ['A', 'B', 'C', 'D'];
    const index = parseInt(pregunta.respuesta_correcta) - 1;
    return `${incisos[index]}. ${pregunta[respuestas[index]]}`;
  }
}
