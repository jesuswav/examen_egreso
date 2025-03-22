import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonTitle, IonGrid, IonCardHeader, IonToolbar, IonList, IonItem, IonLabel, IonCardTitle, IonCardContent, IonCard, IonCol, IonRow, IonInput } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.page.html',
  styleUrls: ['./modulos.page.scss'],
  standalone: true,
  imports: [IonInput, IonLabel, IonButton, IonCardHeader, IonCardTitle, IonCardContent, IonCard, IonItem, IonList, IonContent, CommonModule, FormsModule]
})
export class ModulosPage implements OnInit {
  modulos: any[] = [];
  data = {
    idModulo: null,
    modulo: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadModulos();
  }

  loadModulos() {
    this.authService.getModulos().subscribe({
      next: (res: any) => {
        this.modulos = res;
      },
      error: (error) => {
        console.error("Error al obtener módulos:", error);
      }
    });
  }

  addModulo() {
    if (this.data.idModulo) {
      this.authService.editModulo(this.data).subscribe({
        next: (res: any) => {
          alert(res.message);
          this.loadModulos();
          this.resetModulo();
        },
        error: (error) => {
          console.error("Error al editar módulo:", error);
          alert("Error al editar módulo, intenta de nuevo.");
        }
      });
    } else {
      this.authService.addModulo(this.data).subscribe({
        next: (res: any) => {
          alert(res.message);
          this.loadModulos();
          this.resetModulo();
        },
        error: (error) => {
          console.error("Error al agregar módulo:", error);
          alert("Error al agregar módulo, intenta de nuevo.");
        }
      });
    }
  }

  editModulo(modulo: any) {
    this.data = { ...modulo };
  }

  deleteModulo(idModulo: number) {
    this.authService.deleteModulo(idModulo).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.loadModulos();
      },
      error: (error) => {
        console.error("Error al eliminar módulo:", error);
        alert("Error al eliminar módulo, intenta de nuevo.");
      }
    });
  }

  resetModulo() {
    this.data = {
      idModulo: null,
      modulo: ''
    };
  }
}
