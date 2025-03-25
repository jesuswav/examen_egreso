import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ExamenComunicationService } from 'src/app/services/examen-comunication.service';

// comunicación interna
import { GlobalStateService } from 'src/app/services/global-state.service';
import { AuthService } from 'src/app/services/auth.service';

import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-save-answers-modal',
  imports: [MatButtonModule, MatDialogModule, IonButton],
  templateUrl: './save-answers-modal.component.html',
  styleUrls: ['./save-answers-modal.component.scss'],
})
export class SaveAnswersModalComponent implements OnInit {
  respuestasArray: any = [];

  constructor(
    public dialogRef: MatDialogRef<SaveAnswersModalComponent>,
    private examenComunicationService: ExamenComunicationService,
    private authService: AuthService,
    private globalStateService: GlobalStateService
  ) {}
  ngOnInit(): void {
    this.respuestasArray = this.globalStateService.getRespuestasArray();
    console.log(this.respuestasArray);
  }

  onSubmit(): void {
    // obtener respuestasArray
    // enviar las respuestas y registrarlas en el servidor
    this.authService.saveAnswers(this.respuestasArray).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (error) => {
        console.error('Error al obtener las preguntas:', error);
      },
    });
    console.log('Respuestas a enviar: ', this.respuestasArray);

    // cerrar el modal y pasar al siguiente modulo
    this.dialogRef.close();
    this.examenComunicationService.siguienteModulo();
  }
}
