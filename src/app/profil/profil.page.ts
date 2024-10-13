import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { ApiService } from 'src/app/api/api.service';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {


  constructor(private modalController: ModalController, public element: ElementRef, public appo : AppComponent, public api: ApiService, private toastController: ToastController) { 
    

  }


  presentingElement: any = null;

  isAdmin : any;

  


  @ViewChild('modal', { static: true }) modal: any;

  // Method to change password
  changePassword(newPassword: string) {
    // Logic to change password
  }

  // Typically referenced to your ion-router-outlet


  usersa : any; 
  photoURL : any;
  admin : any = "User";
  user : any;

  async exportToExcel(){
    this.api.exportUsersToExcel();
  }
 
  async resetPassword() {
    try {
      await this.api.resetPassword(this.usersa.id + "@gmail.com");
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

  async openCardModal() {
    const modal = await this.modalController.create({
      component: this.modal
    });
    return await modal.present();
  }

  closeCardModal() {
    this.modalController.dismiss();
  }




logout() {
  this.api.signOut();
}

ngOnInit() {
  this.presentingElement = document.querySelector('.ion-page');
  // Ambil data pengguna dari localStorage
  const userData = JSON.parse(localStorage.getItem('users'));
  console.log(userData);
  console.log("ahakakakak");

  if (userData) {
    // Jika data pengguna ditemukan, ambil URL foto profilnya
    this.usersa = userData;

    this.photoURL = userData.photoURL;
    this.user = userData;
    this.photoURL = userData.photoURL;
    if(userData.admin == 1){
      this.admin = "Admin";
      this.isAdmin = true;
    }

    console.log(this.usersa);
  }

}

}
