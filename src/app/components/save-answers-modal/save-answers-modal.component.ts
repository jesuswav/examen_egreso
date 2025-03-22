import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ExamenComunicationService } from 'src/app/services/examen-comunication.service';

import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-save-answers-modal',
  imports: [MatButtonModule, MatDialogModule, IonButton], 
  templateUrl: './save-answers-modal.component.html',
  styleUrls: ['./save-answers-modal.component.scss'],
})
export class SaveAnswersModalComponent {

  constructor(
    public dialogRef: MatDialogRef<SaveAnswersModalComponent>,
    private examenComunicationService: ExamenComunicationService
  ) {}

  guardarRespuestas(): void {
    this.examenComunicationService.guardarRespuestas()
    this.dialogRef.close(); // Cierra el modal
    this.examenComunicationService.siguienteModulo()
  }

}
