import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamenComunicationService } from 'src/app/services/examen-comunication.service';

@Component({
  selector: 'app-inicio-examen',
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
