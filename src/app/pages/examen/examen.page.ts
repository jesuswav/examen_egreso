import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ExamenModuloComponent } from '../examen-modulo/examen-modulo.component';
import { ExamenComunicationService } from 'src/app/services/examen-comunication.service';
import { Subscription } from 'rxjs';
import { GlobalStateService } from 'src/app/services/global-state.service';
//iconos
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.page.html',
  styleUrls: ['./examen.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  providers: [HttpClient],
})
export class ExamenPage implements OnInit {
  preguntas: any[] = [];
  answeredQuestions = 0;
  totalQuestions = 5;
  answeredSet = new Set<number>();
  timeLeft = 6000; // 10 minutes in seconds
  timerInterval: any;

  // suscribciones un evento interno
  private siguienteModuloSubscription: Subscription | undefined;
  private comenzarExamenSubscription: Subscription | undefined;

  examen: any[] = [];
  modulos: any[] = [];
  moduloActualIndex: number = 0;

  @ViewChild(ExamenModuloComponent) moduloComponent!: ExamenModuloComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private examenComunicationService: ExamenComunicationService,
    private globalStateService: GlobalStateService
  ) {
    addIcons({
      logOutOutline,
    });
  }

  ngOnInit() {
    this.preguntas = history.state.preguntas;
    //this.startTimer();
    this.getExamen();
    // ejecutar funciónd esde el componente hijo
    this.siguienteModuloSubscription =
      this.examenComunicationService.siguienteModulo$.subscribe(() => {
        this.siguienteModulo(); // Ejecuta la función del componente padre
      });
    //
    this.comenzarExamenSubscription =
      this.examenComunicationService.comenzarExamen$.subscribe(() => {
        this.comenzarExamen(); // Ejecuta la función "comenzarExamen"
      });
  }

  updateProgress = (questionId: number) => {
    if (!this.answeredSet.has(questionId)) {
      this.answeredSet.add(questionId);
      this.answeredQuestions++;
      const progressValue = this.answeredQuestions / this.totalQuestions;
      const progressBar = document.getElementById(
        'progress-bar'
      ) as HTMLIonProgressBarElement;
      const progressText = document.getElementById(
        'progress-text'
      ) as HTMLParagraphElement;
      progressBar.value = progressValue;
      progressText.textContent = `Progreso: ${this.answeredQuestions}/${this.totalQuestions}`;
    }
  };

  startTimer() {
    this.timerInterval = setInterval(() => {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      const timerElement = document.getElementById('timer') as HTMLDivElement;
      timerElement.textContent = `Tiempo restante: ${minutes}:${
        seconds < 10 ? '0' : ''
      }${seconds}`;
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timerInterval);
        this.submit();
      }
    }, 1000);
  }

  submit() {
    // Lógica para enviar las respuestas
    console.log('Respuestas enviadas');
    clearInterval(this.timerInterval);
    // Aquí puedes añadir la lógica para enviar las respuestas al servidor
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getExamen() {
    this.authService.getExamen(1).subscribe({
      next: (res: any) => {
        console.log('Examen: ', res);
        this.examen = res;
        this.globalStateService.setExamen(res);
        this.examen.forEach((item: any) => this.modulos.push(item.idModulo));
      },
      error: (error) => {
        console.error('Error al obtener los modulos:', error);
      },
    });
  }

  comenzarExamen(): void {
    if (this.modulos.length > 0) {
      this.moduloActualIndex = 0;
      this.router.navigate(['/examen/modulo', this.modulos[0]]); // Redirige al primer módulo
    }
  }

  siguienteModulo(): void {
    console.log('holaaaa');
    this.moduloActualIndex++;
    console.log('actual: ', this.moduloActualIndex);
    console.log('totales: ', this.modulos.length);
    if (this.moduloActualIndex < this.modulos.length) {
      console.log('-------');
      const siguienteModulo = this.modulos[this.moduloActualIndex];
      this.router.navigate(['/examen/modulo', siguienteModulo]); // Navega al siguiente módulo
    } else {
      console.log('asdasdasd');
      this.router.navigate(['/examen/final']); // Navega al fin del examen
    }
  }
}
