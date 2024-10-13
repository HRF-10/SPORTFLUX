import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public username: string; // Nama pengguna
  public waNumber: string; // Nomor WhatsApp pengguna
  public gender: string; // Gender pengguna
  public photoURL: string; // Foto profil pengguna
  presentingElement: any;
  usersa: any;
  admin: string;
  isAdmin: boolean = false; // Default false

  constructor() { }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.loadUserData(); // Memuat data pengguna
  }

  loadUserData() {
    // Ambil data pengguna dari localStorage
    const userData = JSON.parse(localStorage.getItem('users'));

    if (userData) {
      this.username = userData.name || "User"; // Set nama pengguna, default "User"
      this.photoURL = userData.photoURL || 'default-profile-image-url'; // Default gambar profil
      this.waNumber = userData.wa || "No WA Number"; // Set nomor WA
      this.gender = userData.gender || "Not Specified"; // Set gender

      // Cek apakah user adalah admin
      if (userData.admin == 1) {
        this.admin = "Admin";
        this.isAdmin = true;
      }

      this.usersa = userData; // Simpan data pengguna
      console.log(this.usersa); // Debugging
    } else {
      // Jika tidak ada data pengguna, set nilai default
      this.username = "User";
      this.photoURL = 'default-profile-image-url';
      this.waNumber = "No WA Number";
      this.gender = "Not Specified";
    }
  }
}