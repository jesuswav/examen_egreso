import { Component, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, IonList, IonItem, IonLabel, IonButton],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  @Input() pregunta: any = {}; // Propiedad para recibir un mensaje

  constructor() {}

  ngOnInit() {
    console.log('Pregunta: ', this.pregunta)
  }
}
