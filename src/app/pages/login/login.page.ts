import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonItem, 
  IonLabel, IonInput, IonButton, ModalController 
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage {
  data = {
    usuario: '',
    password: '',
  };

  authenticated = false;
  dataApi: any;

  constructor(
    private router: Router, 
    private modalController: ModalController,
    private authService: AuthService
  ) {}

  async login() {
    try {
      this.authenticated = await this.getUser(this.data);
      console.log("Authenticated:", this.authenticated);
      
      if (this.authenticated) {
        switch (this.dataApi.rol) {
          case 1: // Admin
            this.router.navigate(['/admin-tabs']);
            break;
          case 2: // Alumno
            this.router.navigate(['/examen']);
            break;
          default:
            alert('Rol de usuario no reconocido');
        }
      } else {
        alert('Usuario o contraseña inválidos');
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al autenticar, intenta de nuevo.");
    }
  }

  getUser(data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.auth(data).subscribe({
        next: (res: any) => {
          console.log("Respuesta de API:", res);
          
          if (res && res.usuario) {
            this.dataApi = res;  // Tomamos el usuario de la respuesta
            resolve(true);
          } else {
            console.warn("No se encontraron usuarios con esas credenciales.");
            resolve(false);
          }
        },
        error: (error) => {
          console.error("Error en la petición de autenticación:", error);
          reject(error);
        }
      });
    });
  }
}
