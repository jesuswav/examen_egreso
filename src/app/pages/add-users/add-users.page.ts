import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonList, IonBadge } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.page.html',
  styleUrls: ['./add-users.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol, IonList, IonBadge, CommonModule, FormsModule, HttpClientModule]
})
export class AddUsersPage implements OnInit {
  user = {
    name: '',
    usuario: '',
    password: '',
    carrera_id: ''
  };

  carreras: any[] = [];
  usuarios: any[] = [];
  usuariosPorCarrera: any = {};

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadCarreras();
    this.loadUsuarios();
  }

  loadCarreras() {
    this.http.get('http://localhost:5000/getCarreras').subscribe((response: any) => {
      this.carreras = response;
    }, error => {
      console.error('Error al cargar las carreras:', error);
    });
  }

  loadUsuarios() {
    this.http.get('http://localhost:5000/getUsers').subscribe((response: any) => {
      this.usuarios = response;
      this.updateUsuariosPorCarrera();
    }, error => {
      console.error('Error al cargar los usuarios:', error);
    });
  }

  updateUsuariosPorCarrera() {
    this.usuariosPorCarrera = this.usuarios.reduce((acc, usuario) => {
      if (!acc[usuario.carrera]) {
        acc[usuario.carrera] = 0;
      }
      acc[usuario.carrera]++;
      return acc;
    }, {});
  }

  registerUser() {
    this.http.post('http://localhost:5000/registerUser', this.user).subscribe(response => {
      console.log('Usuario registrado:', response);
      this.loadUsuarios(); // Recargar la lista de usuarios después de registrar uno nuevo
      // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito
    }, error => {
      console.error('Error al registrar usuario:', error);
    });
  }
}
