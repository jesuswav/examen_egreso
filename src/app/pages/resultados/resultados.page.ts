import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonCardHeader, IonList, IonItem, IonLabel, IonCardTitle, IonCardContent, IonCard, IonCol, IonRow, IonInput, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

Chart.register(...registerables);

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: true,
  imports: [IonInput, IonLabel, IonGrid, IonCardHeader, IonCardTitle, IonCardContent, IonCard, IonCol, IonRow, IonItem, IonList, IonContent, IonButton, CommonModule, FormsModule]
})
export class ResultadosPage implements OnInit {
  @ViewChild('modulosChart', { static: true }) modulosChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('finalChart', { static: true }) finalChart!: ElementRef<HTMLCanvasElement>;

  resultados: any[] = [];
  filteredResultados: any[] = [];
  searchTerm: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadResultados();
  }

  loadResultados() {
    this.authService.getResultados().subscribe({
      next: (res: any) => {
        this.resultados = res;
        this.filteredResultados = res;
        this.createModulosChart();
        this.createFinalChart();
      },
      error: (error) => {
        console.error("Error al obtener resultados:", error);
      }
    });
  }

  filterResultados() {
    this.filteredResultados = this.resultados.filter(resultado =>
      resultado.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  createModulosChart() {
    const modulosData = this.resultados.reduce((acc, resultado) => {
      acc[0] += resultado.modulo1Res;
      acc[1] += resultado.modulo2Res;
      acc[2] += resultado.modulo3Res;
      acc[3] += resultado.modulo4Res;
      acc[4] += resultado.modulo5Res;
      return acc;
    }, [0, 0, 0, 0, 0]);

    const modulosAvg = modulosData.map((modulo: number) => modulo / this.resultados.length);

    new Chart(this.modulosChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Módulo 1', 'Módulo 2', 'Módulo 3', 'Módulo 4', 'Módulo 5'],
        datasets: [{
          label: 'Promedio por Módulo',
          data: modulosAvg,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createFinalChart() {
    const finalData = this.resultados.reduce((acc, resultado) => {
      const calificacion = resultado.resultadoFinal;
      if (!acc[calificacion]) {
        acc[calificacion] = 0;
      }
      acc[calificacion]++;
      return acc;
    }, {});

    new Chart(this.finalChart.nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(finalData),
        datasets: [{
          label: 'Resultado Final',
          data: Object.values(finalData),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getNivelDesempeno(puntaje: number): string {
    if (puntaje >= 700 && puntaje <= 999) {
      return 'ANS';
    } else if (puntaje >= 1000 && puntaje <= 1149) {
      return 'DS';
    } else if (puntaje >= 1150 && puntaje <= 1300) {
      return 'DSS';
    } else {
      return 'Desconocido';
    }
  }

  exportToPDF(resultado: any) {
    if (!resultado.idExamen) {
      console.error('idExamen no está definido en el resultado:', resultado);
      return;
    }

    this.authService.getExamenDetails(resultado.idExamen).subscribe({
      next: (examenDetails: any) => {
        const doc = new jsPDF();

        // Create gradient effect manually
        const gradientColors = ['#00008B', '#00BFFF']; // Darker blue and stronger cyan
        const gradientSteps = 100;
        const gradientHeight = 40;
        const gradientWidth = 210;

        for (let i = 0; i < gradientSteps; i++) {
          const color = this.interpolateColor(gradientColors[0], gradientColors[1], i / gradientSteps);
          doc.setFillColor(color);
          doc.rect(0, (i * gradientHeight) / gradientSteps, gradientWidth, gradientHeight / gradientSteps, 'F');
        }

        // Load the image from assets and convert to base64
        const img = new Image();
        img.src = 'assets/logoU.png';
        img.onload = () => {
          // Add the image to the PDF
          doc.addImage(img, 'PNG', 10, 10, 50, 30);

          // Add a title
          doc.setFontSize(16);
          doc.setTextColor(255, 255, 255);
          doc.text('Reporte Individual de Resultados', 105, 20, { align: 'center' });

          // Add general student data
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(`Nombre del sustentante: ${resultado.nombre}`, 10, 50);
          doc.text(`Carrera: ${resultado.carrera}`, 10, 60);
          doc.text(`Fecha de aplicación: ${resultado.fecha}`, 10, 70);

          // Add module results table
          autoTable(doc, {
            startY: 80,
            head: [['Área', 'Nivel de Desempeño', 'Puntaje']],
            body: [
              [examenDetails.modulo1Nombre, this.getNivelDesempeno(resultado.modulo1Res), resultado.modulo1Res],
              [examenDetails.modulo2Nombre, this.getNivelDesempeno(resultado.modulo2Res), resultado.modulo2Res],
              [examenDetails.modulo3Nombre, this.getNivelDesempeno(resultado.modulo3Res), resultado.modulo3Res],
              [examenDetails.modulo4Nombre, this.getNivelDesempeno(resultado.modulo4Res), resultado.modulo4Res],
              [examenDetails.modulo5Nombre, this.getNivelDesempeno(resultado.modulo5Res), resultado.modulo5Res],
            ],
            styles: {
              fontSize: 10,
              cellPadding: 3,
              halign: 'center',
              valign: 'middle',
              lineColor: [0, 0, 0],
              lineWidth: 0.1,
            },
            headStyles: {
              fillColor: [0, 204, 0], // Verde similar al reporte de CENEVAL
              textColor: [255, 255, 255],
            },
          });

          // Add final result
          const finalY = (doc as any).lastAutoTable.finalY + 10;
          doc.setFontSize(12);
          doc.text(`Testimonio de Desempeño:`, 105, finalY, { align: 'center' });
          doc.text(`Puntaje: ${resultado.resultadoFinal}`, 105, finalY + 10, { align: 'center' });
          doc.text(`Nivel: ${resultado.nivel}`, 105, finalY + 20, { align: 'center' });

          // Add level descriptions table
          autoTable(doc, {
            startY: finalY + 30,
            head: [['Abreviación', 'Significado']],
            body: [
              ['ANS', 'Aún No Satisfactorio'],
              ['DS', 'Satisfactorio'],
              ['DSS', 'Sobresaliente'],
            ],
            styles: {
              fontSize: 10,
              cellPadding: 3,
              halign: 'center',
              valign: 'middle',
              lineColor: [0, 0, 0],
              lineWidth: 0.1,
            },
            headStyles: {
              fillColor: [0, 204, 0], // Verde similar al reporte de CENEVAL
              textColor: [255, 255, 255],
            },
          });

          // Add a footer
          doc.setFontSize(10);
          doc.text('Este es un documento generado automáticamente.', 105, 290, { align: 'center' });

          // Save the PDF
          doc.save(`Reporte_${resultado.nombre}.pdf`);
        };
      },
      error: (error) => {
        console.error('Error al obtener los detalles del examen:', error);
      }
    });
  }

  interpolateColor(color1: string, color2: string, factor: number): string {
    const result = color1.slice(1).match(/.{2}/g)!.map((hex, i) => {
      const value1 = parseInt(hex, 16);
      const value2 = parseInt(color2.slice(1).match(/.{2}/g)![i], 16);
      const value = Math.round(value1 + (value2 - value1) * factor);
      return value.toString(16).padStart(2, '0');
    });
    return `#${result.join('')}`;
  }
}
