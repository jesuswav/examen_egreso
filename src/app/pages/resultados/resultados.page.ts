import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonCardHeader, IonList, IonItem, IonLabel,IonCardTitle, IonCardContent, IonCard, IonCol, IonRow } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: true,
  imports: [IonLabel,IonGrid, IonCardHeader, IonCardTitle, IonCardContent, IonCard, IonCol, IonRow,IonItem, IonList, IonContent, CommonModule, FormsModule]
})
export class ResultadosPage implements OnInit {
  resultados: any[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadResultados();
  }

  loadResultados() {
    this.authService.getResultados().subscribe({
      next: (res: any) => {
        this.resultados = res;
      },
      error: (error) => {
        console.error("Error al obtener resultados:", error);
      }
    });
  }
}
