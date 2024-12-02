import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  public location: string; // Lokasi pengguna
  public category: string; // Kategori pengguna
  presentingElement: any;
  usersa: any;
  admin: string;
  isAdmin: boolean = false; // Default false

  constructor(private router: Router) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.loadUserData();
  }

  loadUserData() {
    const userData = JSON.parse(localStorage.getItem('users'));

    if (userData) {
      this.username = userData.name || "User";
      this.photoURL = userData.photoURL || 'default-profile-image-url';
      this.waNumber = userData.wa || "No WA Number";
      this.gender = userData.gender || "Not Specified";
      this.location = userData.location || "Unknown";
      this.category = userData.category || "Not Specified";

      if (userData.admin == 1) {
        this.admin = "Admin";
        this.isAdmin = true;
      }

      this.usersa = userData;
      console.log(this.usersa);
    } else {
      this.username = "User";
      this.photoURL = 'default-profile-image-url';
      this.waNumber = "No WA Number";
      this.gender = "Not Specified";
      this.location = "Unknown";
      this.category = "Not Specified";
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoURL = reader.result as string;
        this.savePhotoToLocalStorage();
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  savePhotoToLocalStorage() {
    const userData = JSON.parse(localStorage.getItem('users'));
    if (userData) {
      userData.photoURL = this.photoURL;
      localStorage.setItem('users', JSON.stringify(userData));
    }
  }

  goBack() {
    this.router.navigate(['..']); // Navigasi ke halaman sebelumnya
  }
  
}