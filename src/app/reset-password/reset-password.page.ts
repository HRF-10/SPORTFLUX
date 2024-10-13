import { Component } from '@angular/core';

import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/api/api.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string;

  constructor(public api: ApiService, private toastController: ToastController) { }

  async resetPassword() {
    try {
      await this.api.resetPassword(this.email);
      const toast = await this.toastController.create({
        message: 'Password reset email sent, please check your inbox',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: error.message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }
}
