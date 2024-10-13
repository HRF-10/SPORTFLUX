import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router'; // Import Router untuk navigasi

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.page.html',
  styleUrls: ['./trainer.page.scss'],
})
export class TrainerPage implements OnInit {
  usersList: any[] = [];
  recommendedUser: any;
  currentUserName: string;

  constructor(private api: ApiService, private router: Router) {} // Tambahkan Router ke constructor

  ngOnInit() {
    this.loadUserData();
    this.getUsersList();
  }

  loadUserData() {
    const userData = JSON.parse(localStorage.getItem('users'));
    if (userData) {
      this.currentUserName = userData.name;
    } else {
      this.currentUserName = "User";
    }
    console.log('Current User Name:', this.currentUserName);
  }

  getUsersList() {
    this.api.db.collection("users").onSnapshot((querySnapshot) => {
      this.usersList = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const userNameFromFirestore = userData.name;
        const userCategory = userData.category; // Ambil kategori user dari Firestore

        console.log('Firestore User Name:', userNameFromFirestore);
        console.log('User Category:', userCategory);

        // Hanya tambahkan user dengan kategori 'trainer' dan bukan user saat ini
        if (userCategory === 'trainer' && userNameFromFirestore !== this.currentUserName) {
          this.usersList.push(userData); 
        }
      });

      console.log('Filtered Users List (trainers only):', this.usersList);
      this.setRecommendation();
    });
  }  

  setRecommendation() {
    if (this.usersList.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.usersList.length);
      this.recommendedUser = this.usersList[randomIndex]; // Pilih pengguna acak yang merupakan trainer
    }
  }

  // Fungsi untuk membuka chat dengan trainer
  openChat(usr: any) {
    this.router.navigate(['/chat-room/'], { queryParams: usr, skipLocationChange: false });
  }
}