import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamenComunicationService } from 'src/app/services/examen-comunication.service';
import { QuestionComponent } from 'src/app/components/question/question.component';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';
import { GlobalStateService } from 'src/app/services/global-state.service';
// importación de los iconos
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
// ionicons
//iconos
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';
// importaciones para el modal
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ModalContentComponent } from 'src/app/components/modal-content/modal-content.component';

@Component({
  selector: 'app-inicio-examen',
  standalone: true,
  imports: [
    CommonModule,
    QuestionComponent,
    IonButton,
    FontAwesomeModule,
    MatButtonModule,
    IonIcon
  ],
  templateUrl: './inicio-examen.component.html',
  styleUrls: ['./inicio-examen.component.scss'],
})
export class InicioExamenComponent {
  title = 'angular-modal-standalone-example';

  constructor(
    private router: Router,
    private examenComunicationService: ExamenComunicationService,
    private globalStateService: GlobalStateService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    addIcons({
      chevronForwardOutline
    })
  }

  // funciones para abrir el modal
  openModal(): void {
    const dialogRef = this.dialog.open(ModalContentComponent, {
      width: '400px', // Ancho del modal
      data: {
        /* Puedes pasar datos al modal si es necesario */
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal se cerró');
      // Puedes manejar el resultado aquí
      //this.comenzarExamen()
    });
  }

  // definición de los iconos
  faCoffee = faCoffee;
  faCircleDot = faCircleDot;

  infoExamen: any;
  examen: any;
  modulos: any[] = [];

  ngOnInit() {
    // llamada a la api para obtener la información el examen
    this.authService.getInfoExamen(1).subscribe({
      next: (res: any) => {
        console.log('Información del examen', res);
        this.infoExamen = res;
      },
      error: (error) => {
        console.error('Error al obtener la información del examen: ', error);
      },
    });

    console.log('Información: ', this.infoExamen);
  }

  comenzarExamen(): void {
    this.examenComunicationService.comenzarExamen(); // Comenzar el examen
  }
}
