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
import { GlobalStateService } from 'src/app/services/global-state.service';
import { AuthService } from 'src/app/services/auth.service';

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
  answers: any[] = [];

  constructor(
    private authService: AuthService,
    private globalStateService: GlobalStateService
  ) {}

  ngOnInit() {
    console.log('Pregunta: ', this.preguntas);
  }

  guardarRespuestas(): void {
    console.log(this.respuestas);
    console.log(this.preguntas);
    this.respuestas.forEach((item, index) => {
      console.log(item);
      this.answers.push({
        idPregunta: index,
        idUsuario: this.globalStateService.getUsuario(),
        idModulo: this.globalStateService.getModulo(),
        respuesta: item,
      });
    });
    console.log('Anwers: ', this.answers);
    if (this.respuestas.every((respuesta) => respuesta !== '')) {
      console.log('Respuestas guardadas:', this.respuestas);
      this.authService.saveAnswers(this.answers).subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (error) => {
          console.error('Error al obtener las preguntas:', error);
        },
      });
      // Aquí puedes enviar las respuestas a un servicio o hacer lo que necesites
    } else {
      console.log('Por favor, responde todas las preguntas.');
    }
  }
}
