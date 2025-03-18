import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonRadio,
  IonRadioGroup,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonRadio,
    IonRadioGroup,
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  @Input() preguntas: any[] = []; // Propiedad para recibir un mensaje

  respuestas: string[] = new Array(this.preguntas.length).fill('');

  constructor() {}

  ngOnInit() {
    console.log('Pregunta: ', this.preguntas);
  }

  guardarRespuestas(): void {
    if (this.respuestas.every((respuesta) => respuesta !== '')) {
      console.log('Respuestas guardadas:', this.respuestas);
      // Aquí puedes enviar las respuestas a un servicio o hacer lo que necesites
    } else {
      console.log('Por favor, responde todas las preguntas.');
    }
  }
}
