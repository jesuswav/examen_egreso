import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonItem, 
  IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonList, IonListHeader 
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.page.html',
  styleUrls: ['./add-users.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonList,
    IonListHeader,
    CommonModule,
    FormsModule
  ]
})
export class AddUsersPage implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas') private pieCanvas!: ElementRef<HTMLCanvasElement>;
  pieChart: any;

  data = {
    nombre: '',
    usuario: '',
    password: '',
    rol: 0,
    idCarrera: 0
  };

  roles: any[] = [];
  carreras: any[] = [];
  usuarios: any[] = [];
  alumnosPorCarrera: any[] = [];

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadRoles();
    this.loadCarreras();
    this.loadUsers();
    this.loadAlumnosPorCarrera();
  }

  ngAfterViewInit() {
    this.createPieChart();
  }

  loadRoles() {
    this.authService.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res;
      },
      error: (error) => {
        console.error("Error al obtener roles:", error);
      }
    });
  }

  loadCarreras() {
    this.authService.getCarreras().subscribe({
      next: (res: any) => {
        this.carreras = res;
      },
      error: (error) => {
        console.error("Error al obtener carreras:", error);
      }
    });
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        console.log(res)
        this.usuarios = res;
      },
      error: (error) => {
        console.error("Error al obtener usuarios:", error);
      }
    });
  }

  loadAlumnosPorCarrera() {
    this.authService.getAlumnosPorCarrera().subscribe({
      next: (res: any) => {
        this.alumnosPorCarrera = res;
        this.updatePieChart();
        console.log(this.alumnosPorCarrera);
      },
      error: (error) => {
        console.error("Error al obtener alumnos por carrera:", error);
      }
    });
  }

  async register() {
    try {
      const response = await this.authService.registerUser(this.data).toPromise();
      if (response && response.message) {
        alert(response.message);
        this.loadUsers(); // Refresh the user list after registration
        this.loadAlumnosPorCarrera(); // Refresh the alumnos por carrera list after registration
        this.router.navigate(['/admin-tabs']);
      } else {
        alert('Error al registrar usuario');
      }
    } catch (error) {
      console.error("Error en register:", error);
      alert("Error al registrar usuario, intenta de nuevo.");
    }
  }

  createPieChart() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          label: 'Alumnos por Carrera',
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  updatePieChart() {
    const labels = this.alumnosPorCarrera.map(carrera => carrera.carrera);
    const data = this.alumnosPorCarrera.map(carrera => carrera.cantidad);

    this.pieChart.data.labels = labels;
    this.pieChart.data.datasets[0].data = data;
    this.pieChart.update();
  }
}
