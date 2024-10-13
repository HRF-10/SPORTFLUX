import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fisioterapis',
  templateUrl: './fisioterapis.page.html',
  styleUrls: ['./fisioterapis.page.scss'],
})
export class FisioterapisPage implements OnInit {
  usersList: any[] = [];
  recommendedUser: any;
  currentUserName: string;
  searchTerm: string = ''; // Variabel untuk menyimpan input pencarian

  constructor(private api: ApiService, private router: Router) {}

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
        console.log('User Data:', userData); // Cek data pengguna
  
        // Pastikan userData memiliki semua properti yang diharapkan
        if (userData.city) {
          console.log('City:', userData.city); // Cek nilai city
        } else {
          console.warn('City tidak ditemukan untuk pengguna:', userData);
        }
  
        const userNameFromFirestore = userData.name;
        const userCategory = userData.category;
  
        // Hanya tambahkan user dengan kategori 'physiotherapist' dan bukan user saat ini
        if (userCategory === 'physiotherapist' && userNameFromFirestore !== this.currentUserName) {
          this.usersList.push(userData); 
        }
      });
  
      console.log('Filtered Users List (physiotherapists only):', this.usersList);
      this.setRecommendation();
    });
  }

  setRecommendation() {
    if (this.usersList.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.usersList.length);
      this.recommendedUser = this.usersList[randomIndex]; // Pilih pengguna acak yang merupakan trainer
    }
  }

  // Fungsi untuk memfilter pengguna berdasarkan pencarian
  get filteredUsers() {
    return this.usersList.filter(user => 
      (user.name && user.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (user.city && user.city.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  openChat(usr: any) {
    this.router.navigate(['/chat-room2/'], { queryParams: usr, skipLocationChange: false });
  }
}