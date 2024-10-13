import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { HttpClient } from '@angular/common/http';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements AfterViewInit {
  private emgChart: any;
  private chartData: number[] = [];
  private timeLabels: number[] = [];
  public username: string;
  public imuData: any;
  public emgData: number;
  public recordedData: any[] = []; // To store the recorded data
  public isConnected: boolean = false; // Track connection status
  private updateInterval: any; // Store the interval ID for clearing

  constructor(
    private router: Router,
    public api: ApiService,
    private http: HttpClient,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngAfterViewInit() {
    this.loadUserData();
    this.createChart();
  }

  loadUserData() {
    const userData = JSON.parse(localStorage.getItem('users'));
    this.username = userData ? userData.name : 'User';
  }

  createChart() {
    const initialData = {
      labels: this.timeLabels,
      datasets: [
        {
          label: 'Amplitudo EMG (mV)',
          data: this.chartData,
          borderColor: 'rgba(255, 255, 255, 1)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const config = {
      type: 'line',
      data: initialData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Waktu (detik)',
              color: '#ffffff',
            },
            ticks: {
              color: '#ffffff',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Amplitudo EMG (mV)',
              color: '#ffffff',
            },
            ticks: {
              color: '#ffffff',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
            suggestedMin: 0,
            suggestedMax: 2,
          },
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
            },
          },
        },
      },
    };

    const ctx = document.getElementById('emgChart') as HTMLCanvasElement;
    if (ctx) {
      this.emgChart = new (window as any).Chart(ctx.getContext('2d')!, config);
    } else {
      console.error('Elemen Canvas tidak ditemukan');
    }
  }

  async connectToDevice() {
    const dataUrl = `https://api.atamagri.com/sportflux`;

    try {
      const response: any = await this.http.get(dataUrl).toPromise();

      if (response) {
        this.imuData = {
          accelerometer: {
            x: response.accx,
            y: response.accy,
            z: response.accz,
          },
          gyroscope: {
            x: response.gyrox,
            y: response.gyroy,
            z: response.gyroz,
          },
          magnetometer: {
            x: response.magx,
            y: response.magy,
            z: response.magz,
          },
        };
        this.emgData = response.emg;

        this.api.setImuData(this.imuData);
        this.isConnected = true; // Set connection status to true
        this.recordedData.push({ timestamp: new Date(), imuData: this.imuData, emgData: this.emgData }); // Start recording data

        console.log('Terhubung ke Perangkat EMG:', this.imuData, this.emgData);
        this.showToast('Berhasil terhubung ke Perangkat EMG!');

        this.startDynamicUpdates(dataUrl);
      } else {
        this.showToast('Data IMU dan EMG tidak ditemukan.');
        console.error('Data tidak ditemukan:', response);
      }
    } catch (error) {
      console.error('Koneksi gagal:', error);
      this.showToast('Gagal terhubung ke server API.');
    }
  }

  startDynamicUpdates(dataUrl: string) {
    this.updateInterval = setInterval(async () => {
      try {
        const response: any = await this.http.get(dataUrl).toPromise();
        this.emgData = response.emg;

        if (this.emgData) {
          const newAmplitude = this.emgData;
          this.chartData.push(newAmplitude);
          this.timeLabels.push(this.chartData.length);

          // Record the data
          this.recordedData.push({ timestamp: new Date(), imuData: this.imuData, emgData: this.emgData });

          if (this.chartData.length > 60) {
            this.chartData.shift();
            this.timeLabels.shift();
          }

          this.emgChart.data.labels = this.timeLabels;
          this.emgChart.data.datasets[0].data = this.chartData;
          this.emgChart.update();
        }
      } catch (error) {
        console.error('Gagal mendapatkan data EMG:', error);
      }
    }, 1000);
  }

  async disconnectDevice() {
    this.isConnected = false; // Set connection status to false
    clearInterval(this.updateInterval); // Stop the data updates
    this.recordedData = []; // Clear recorded data
    this.chartData = []; // Clear chart data
    this.timeLabels = []; // Clear time labels
    this.emgData = 0; // Reset EMG data to 0
    this.imuData = {
      accelerometer: { x: 0, y: 0, z: 0 },
      gyroscope: { x: 0, y: 0, z: 0 },
      magnetometer: { x: 0, y: 0, z: 0 },
    }; // Reset IMU data to 0

    // Reset the chart
    this.emgChart.data.labels = this.timeLabels; // Reset chart labels
    this.emgChart.data.datasets[0].data = this.chartData; // Reset chart data
    this.emgChart.update(); // Update the chart

    this.showToast('Disconnected from device.');
  }

  // Download recorded data as CSV
  downloadData() {
    const csvContent = this.convertToCSV(this.recordedData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'recordedData.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Convert recorded data to CSV format
  convertToCSV(data: any[]): string {
    const headers = 'Timestamp,IMU Data,EMG Data\n';
    const rows = data.map(point => {
      const imuData = JSON.stringify(point.imuData);
      return `${point.timestamp},${imuData},${point.emgData}`;
    }).join('\n');
    return headers + rows;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'dark',
    });
    toast.present();
  }
}