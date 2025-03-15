import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.page.html',
  styleUrls: ['./examen.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule], 
  providers: [HttpClient]
})
export class ExamenPage implements OnInit {
  preguntas: any[] = [];
  answeredQuestions = 0;
  totalQuestions = 5;
  answeredSet = new Set<number>();
  timeLeft = 6000; // 10 minutes in seconds
  timerInterval: any;

  examen: any[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.preguntas = history.state.preguntas;
    this.startTimer();
    this.getExamen();
  }

  updateProgress = (questionId: number) => {
    if (!this.answeredSet.has(questionId)) {
      this.answeredSet.add(questionId);
      this.answeredQuestions++;
      const progressValue = this.answeredQuestions / this.totalQuestions;
      const progressBar = document.getElementById('progress-bar') as HTMLIonProgressBarElement;
      const progressText = document.getElementById('progress-text') as HTMLParagraphElement;
      progressBar.value = progressValue;
      progressText.textContent = `Progreso: ${this.answeredQuestions}/${this.totalQuestions}`;
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      const timerElement = document.getElementById('timer') as HTMLDivElement;
      timerElement.textContent = `Tiempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
      },
      error: (error) => {
        console.error('Error al obtener los modulos:', error);
      },
    });
  }
}
