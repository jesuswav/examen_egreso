import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ExamenComunicationService } from 'src/app/services/examen-comunication.service';

import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-modal-content',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, IonButton], // Importa los módulos necesarios
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.css'],
})
export class ModalContentComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalContentComponent>,
    private examenComunicationService: ExamenComunicationService
  ) {}

  comenzarExamen(): void {
    this.examenComunicationService.comenzarExamen()
    this.dialogRef.close(); // Cierra el modal
  }
}
