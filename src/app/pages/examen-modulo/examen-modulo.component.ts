import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ExamenComunicationService } from 'src/app/services/examen-comunication.service';
import { QuestionComponent } from 'src/app/components/question/question.component';
import { IonButton } from '@ionic/angular/standalone';
import { GlobalStateService } from 'src/app/services/global-state.service';

@Component({
  selector: 'app-examen-modulo',
  standalone: true,
  imports: [QuestionComponent, IonButton],
  templateUrl: './examen-modulo.component.html',
  styleUrls: ['./examen-modulo.component.scss'],
})
export class ExamenModuloComponent implements OnInit {
  idModulo: number = 0;
  preguntas: any[] = [];
  modulos: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private examenComunicationService: ExamenComunicationService,
    private globalStateService: GlobalStateService
  ) {}

  ngOnInit(): void {
    this.idModulo = +this.route.snapshot.paramMap.get('id')!;

    console.log('Modulos', this.modulos);

    console.log('modulo en el que nos encontramos', this.idModulo);

    this.obtenerPreguntas();
    // asignar modulo al estado global de la aplicación
    this.globalStateService.setModulo(this.idModulo)
  }

  obtenerPreguntas(): void {
    //Aquí obtienes las preguntas del módulo actual desde el servicio
    this.authService.getPreguntas(this.idModulo).subscribe((data) => {
      console.log('Preguntas por modulo', data);
      this.preguntas = data;
    });
  }

  siguienteModulo(): void {
    this.examenComunicationService.siguienteModulo(); // Notifica al componente padre
  }
}
