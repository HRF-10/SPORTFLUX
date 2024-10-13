import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { NavController } from '@ionic/angular'; // Import NavController

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  public imuData: any; // Deklarasi imuData untuk menyimpan data IMU

  constructor(private router: Router, private api: ApiService, private navCtrl: NavController) { // Tambahkan ApiService dan NavController
  }

  ngOnInit() {
    this.loadImuData(); // Panggil fungsi untuk memuat data IMU saat inisialisasi
  }

  loadImuData() {
    this.imuData = this.api.getImuData(); // Ambil data IMU dari ApiService
  }

  navigateToImu() {
    if (this.imuData) { // Pastikan imuData tidak kosong
      this.navCtrl.navigateForward('/tabs/imu', {
        queryParams: { imuData: JSON.stringify(this.imuData) }, // Kirim data IMU saat navigasi
      });
    } else {
      console.error('Data IMU tidak tersedia.');
    }
  }
}