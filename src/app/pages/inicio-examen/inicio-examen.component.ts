import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamenComunicationService } from 'src/app/services/examen-comunication.service';
import { QuestionComponent } from 'src/app/components/question/question.component';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-inicio-examen',
  standalone: true,
  imports: [CommonModule, QuestionComponent, IonButton],
  templateUrl: './inicio-examen.component.html',
  styleUrls: ['./inicio-examen.component.scss'],
})
export class InicioExamenComponent {
  constructor(
    private router: Router,
    private examenComunicationService: ExamenComunicationService
  ) {}

  comenzarExamen(): void {
    this.examenComunicationService.comenzarExamen(); // Comenzar el examen
  }
}
