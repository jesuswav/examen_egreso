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
import * as Papa from 'papaparse';

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
    idPregunta: null,
    pregunta: '',
    respuesta1: '',
    respuesta2: '',
    respuesta3: '',
    respuesta4: '',
    respuestaCorrecta: '',
    idModulo: ''
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
    console.log('Selected modulo', this.selectedModulo)
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

  loadPreguntas() {
    if (this.selectedModulo) {
      this.authService.getPreguntas(this.selectedModulo).subscribe({
        next: (res: any) => {
          this.preguntas = res;
        },
        error: (error) => {
          console.error("Error al obtener preguntas:", error);
        }
      });
    }
  }

  addPregunta() {
    if (this.pregunta.idPregunta) {
      // Editar pregunta existente
      this.http.put(`http://localhost:3200/updatePregunta/${this.pregunta.idPregunta}`, this.pregunta).subscribe(response => {
        console.log('Pregunta actualizada:', response);
        this.loadPreguntas(); // Recargar la lista de preguntas después de actualizar una pregunta
        this.resetPregunta();
      }, error => {
        console.error('Error al actualizar pregunta:', error);
      });
    } else {
      this.authService.addPregunta(this.pregunta).subscribe({
        next: (res: any) => {
          alert(res.message);
          this.loadPreguntas();
          this.resetPregunta();
        },
        error: (error) => {
          console.error("Error al agregar pregunta:", error);
          alert("Error al agregar pregunta, intenta de nuevo.");
        }
      });
    }
  }

  getRespuestaCorrecta(pregunta: any) {
    switch (pregunta.respuestaCorrecta) {
      case 1: return 'A';
      case 2: return 'B';
      case 3: return 'C';
      case 4: return 'D';
      default: return '';
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

  resetPregunta() {
    this.pregunta = {
      idPregunta: null,
      pregunta: '',
      respuesta1: '',
      respuesta2: '',
      respuesta3: '',
      respuesta4: '',
      respuestaCorrecta: '',
      idModulo: ''
    };
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log(results.data); // Debugging line to check the parsed data
          this.authService.addPreguntasFromCSV(results.data).subscribe({
            next: (res: any) => {
              alert(res.message);
              this.loadPreguntas();
            },
            error: (error) => {
              console.error("Error al agregar preguntas desde CSV:", error);
              alert("Error al agregar preguntas desde CSV, intenta de nuevo.");
            }
          });
        },
        error: (error) => {
          console.error("Error al leer el archivo CSV:", error);
          alert("Error al leer el archivo CSV, intenta de nuevo.");
        }
      });
    }
  }
}
