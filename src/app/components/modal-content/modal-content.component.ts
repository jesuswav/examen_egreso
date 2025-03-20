import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-modal-content',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, IonButton], // Importa los módulos necesarios
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.css']
})
export class ModalContentComponent {

  constructor(public dialogRef: MatDialogRef<ModalContentComponent>) {}

  onSave(): void {
    console.log('Guardar acción');
    this.dialogRef.close(); // Cierra el modal
  }
}