import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import {
  IonItem,
  IonLabel,
  IonButton,
  IonList,
  IonRadio,
  IonRadioGroup,
} from '@ionic/angular/standalone';
import { GlobalStateService } from 'src/app/services/global-state.service';
import { AuthService } from 'src/app/services/auth.service';
// importaciones para el modal
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SaveAnswersModalComponent } from '../save-answers-modal/save-answers-modal.component';

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
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  @Input() preguntas: any[] = []; // Propiedad para recibir un mensaje

  respuestas: string[] = new Array(this.preguntas.length).fill('');
  answers: any[] = [];

  // instancia del formulario
  preguntass: any[] = [];
  formulario: FormGroup;

  constructor(
    private authService: AuthService,
    private globalStateService: GlobalStateService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({});
  }

  ngOnInit() {
    this.cargarPreguntas();
  }

  // función para cargar las preguntas
  cargarPreguntas(): void {
    // Datos de ejemplo
    const modulo = this.globalStateService.getModulo();

    this.authService.getPreguntas(modulo).subscribe({
      next: (res: any) => {
        this.preguntass = res;

        // crear los controladores para las preguntas
        this.preguntass.forEach((pregunta) => {
          if (pregunta) {
            console.log('controlador agregado..');
            this.formulario.addControl(
              `pregunta_${pregunta.idPregunta}`,
              this.fb.control('')
            );
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener las preguntas:', error);
      },
    });
  }

  guardarRespuestas(): void {
    // Obtén los valores del formulario
    console.log('RESPUESTAS GUARDADAS')
    console.log(this.formulario.value);

    let respuestasO = this.formulario.value;
    let respuestasA: any[] = [];

    for (const respuesta in respuestasO) {
      console.log(respuesta);
      if (respuestasO.hasOwnProperty(respuesta)) {
        // Filtra solo propiedades propias (no heredadas)
        console.log(`Clave: ${respuesta}, Valor: ${respuestasO[respuesta]}`);

        const idPregunta = respuesta.split('_').pop(); // "23"

        console.log(idPregunta);
        respuestasA.push({
          idPregunta: idPregunta,
          respuesta: respuestasO[respuesta],
          idUsuario: this.globalStateService.getUsuario(),
          idModulo: this.globalStateService.getModulo(),
        });
      }
    }

    console.log(respuestasA)
    this.globalStateService.setRespuestasArray(respuestasA)
  }

  // función para abrir el modal antes de registrar las respuestas de manera definitiva
  openModal(): void {
    this.guardarRespuestas()
    const dialogRef = this.dialog.open(SaveAnswersModalComponent, {
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
}
