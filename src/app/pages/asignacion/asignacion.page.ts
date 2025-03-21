import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonLabel, IonList, IonListHeader, IonButton, IonBadge, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.page.html',
  styleUrls: ['./asignacion.page.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonGrid, IonContent, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonSelect, IonSelectOption, IonItem, IonLabel, IonList, IonListHeader, IonButton, IonBadge, CommonModule, FormsModule]
})
export class AsignacionPage implements OnInit {
  carreras: any[] = [];
  modulos: any[] = [];
  selectedModulos: any[] = [];
  data = {
    idCarrera: 0,
    idModulo: 0
  };

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadCarreras();
    this.loadModulos();
  }

  loadCarreras() {
    this.authService.getCarreras().subscribe({
      next: (data: any[]) => {
        this.carreras = data;
      },
      error: (error) => {
        console.error('Error al obtener las carreras:', error);
      }
    });
  }

  loadModulos() {
    this.authService.getModulos().subscribe({
      next: (data: any[]) => {
        this.modulos = data;
      },
      error: (error) => {
        console.error('Error al obtener los módulos:', error);
      }
    });
  }

  assignModulo(modulo: any) {
    if (this.selectedModulos.length >= 5) {
      alert('Ya has seleccionado 5 módulos.');
      return;
    }

    if (!this.selectedModulos.includes(modulo)) {
      this.selectedModulos.push(modulo);
    }
  }

  removeModulo(modulo: any) {
    const index = this.selectedModulos.indexOf(modulo);
    if (index > -1) {
      this.selectedModulos.splice(index, 1);
    }
  }

  registerExamen() {
    if (this.selectedModulos.length !== 5) {
      alert('Debes seleccionar exactamente 5 módulos.');
      return;
    }

    const examen = {
      idCarrera: this.data.idCarrera,
      idModulo1: this.selectedModulos[0].idModulo,
      idModulo2: this.selectedModulos[1].idModulo,
      idModulo3: this.selectedModulos[2].idModulo,
      idModulo4: this.selectedModulos[3].idModulo,
      idModulo5: this.selectedModulos[4].idModulo
    };

    this.authService.assignExamen(examen).subscribe({
      next: (response) => {
        alert('Examen asignado correctamente.');
        this.selectedModulos = [];
      },
      error: (error) => {
        console.error('Error al asignar el examen:', error);
      }
    });
  }
}