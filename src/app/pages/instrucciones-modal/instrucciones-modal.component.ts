import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-instrucciones-modal',
  templateUrl: './instrucciones-modal.component.html',
  styleUrls: ['./instrucciones-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class InstruccionesModalComponent {
  constructor(private modalController: ModalController) {}

  accept() {
    this.modalController.dismiss({ accepted: true });
  }

  cancel() {
    this.modalController.dismiss({ accepted: false });
  }
}
