import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { Router } from '@angular/router';
import { QueryValueType } from '@angular/compiler/src/core';

import { ModalController } from '@ionic/angular';
import { ModalNewchatPage } from 'src/app/modal-newchat/modal-newchat.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  session: any;
  usersList: any;
  availableList: any;
  now: Date = new Date();
  usersa  : any; 
  photoURL : any;
  constructor(
    public api: ApiService,
    public router: Router,
    public modalController: ModalController
  ) { 
    this.session = localStorage.getItem('loggedIn')
    this.getUsersList();
  }

  async showModalChat() {
    const modal = await this.modalController.create({
      component: ModalNewchatPage,
      componentProps: { data:this.availableList }
    });
    return await modal.present();
  }

  ngOnInit() {
    // Ambil data pengguna dari localStorage
    const userData = JSON.parse(localStorage.getItem('users'));
    console.log(userData);
    console.log("ahakakakak");
    if (userData) {
      // Jika data pengguna ditemukan, ambil URL foto profilnya
      this.usersa = userData.users;
      this.photoURL = userData.photoURL;
  
      console.log(this.usersa);
    }
  }

  logout() {
    this.api.signOut();
  }

  getUsersList() {
    this.api.db.collection("users")
    .onSnapshot((querySnapshot)=> {
      this.usersList     = [];
      this.availableList = [];

      querySnapshot.forEach((doc) =>{
        var userData = doc.data();

        this.availableList.push(userData);

        this.api.db.collection("chatRoom")
          .where('id', 'array-contains', userData.id)
          .orderBy("timestamp", "desc")
          .limit(1)
          .onSnapshot((querySnapshot)=> {
              querySnapshot.forEach((result) => {
                this.usersList.push({
                  user: userData,
                  lastMSG: result.data()
                });
              });
          });
      });
    });
  }

  openChat(usr: any){
    this.router.navigate(['/chat-room/'], { queryParams: usr, skipLocationChange: false });
  }

  chatTime(message: any) {
    return this.api.formatAMPM(message.toDate());
  }

}
