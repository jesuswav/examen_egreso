import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonLabel, IonTabs, IonIcon,IonTabButton, IonTabBar, IonButtons, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';  
import { personAdd,duplicate, barChart, duplicateOutline, statsChartOutline, book, bookOutline, clipboardOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-tabs',
  templateUrl: './admin-tabs.page.html',
  styleUrls: ['./admin-tabs.page.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonContent, IonIcon,IonHeader, IonTabs, IonTabButton, IonTabBar, IonTitle, IonToolbar, CommonModule, FormsModule,IonLabel]
})
export class AdminTabsPage implements OnInit {

  constructor(private router: Router, private authService: AuthService) { 
    addIcons({personAdd,bookOutline,clipboardOutline,duplicateOutline,statsChartOutline,book,duplicate,barChart});
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
