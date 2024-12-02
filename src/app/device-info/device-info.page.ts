import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { trigger, transition, style, animate } from '@angular/animations';


declare var THREE: any;
declare var Chart: any;

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.page.html',
  styleUrls: ['./device-info.page.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})

export class DeviceInfoPage implements OnInit, AfterViewInit, OnDestroy {
  public accelerometerX: number = 0;
  public accelerometerY: number = 0;
  public accelerometerZ: number = 0;
  public gyroscopeX: number = 0;
  public gyroscopeY: number = 0;
  public gyroscopeZ: number = 0;
  public magnetometerX: number = 0;
  public magnetometerY: number = 0;
  public magnetometerZ: number = 0;

  public imuData: any[] = [];
  public emg: number = 0;
  public recordedData: any[] = [];

  private imuChart: any;
  private chartData: number[] = [];
  private timeLabels: number[] = [];

  private scene: any;
  private camera: any;
  private renderer: any;
  private object: any;

  private updateInterval: any; // Timer untuk update real-time

  constructor(private navCtrl: NavController, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.initThreeJS();
  }

  ngAfterViewInit() {
    this.createImuChart(); // Initialize the IMU chart
    this.startRealTimeUpdate(); // Mulai update real-time data IMU
    window.addEventListener('resize', this.onResize.bind(this)); // Handle resizing
  }

  startRealTimeUpdate() {
    this.updateInterval = setInterval(() => {
      this.updateDeviceData(); // Ambil data IMU dari API
      this.updateImuTable(); // Perbarui tabel data real-time
      this.updateImuChart(); // Perbarui grafik dengan data IMU terbaru
      this.update3DObject(); // Perbarui objek 3D
    }, 500); // Interval polling tiap 500 ms (0.5 detik)
  }
  
  updateImuTable() {
    const imuData = {
      emg: this.emg, // Tambahkan data emg di sini
      accelerometerX: this.accelerometerX,
      accelerometerY: this.accelerometerY,
      accelerometerZ: this.accelerometerZ,
      gyroscopeX: this.gyroscopeX,
      gyroscopeY: this.gyroscopeY,
      gyroscopeZ: this.gyroscopeZ,
      magnetometerX: this.magnetometerX,
      magnetometerY: this.magnetometerY,
      magnetometerZ: this.magnetometerZ,
    };
  
    // Tambahkan data baru di urutan terakhir (baris bawah)
    this.imuData.push(imuData);
  
    // Batasi data hanya untuk 5 baris
    if (this.imuData.length > 5) {
      this.imuData.shift(); // Hapus data pertama jika lebih dari 5
    }
  }
    
  updateDeviceData() {
    const imuData = this.api.getImuData(); // Ambil data IMU dari API
    this.setDeviceData(imuData); // Set data ke variabel
  }

  createImuChart() {
    const initialData = {
      labels: this.timeLabels,
      datasets: [
        {
          label: 'Amplitudo IMU (mV)',
          data: this.chartData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
              text: 'Amplitudo IMU (mV)',
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

    const ctx = document.getElementById('imuChart') as HTMLCanvasElement;
    if (ctx && ctx.getContext) {
      this.imuChart = new Chart(ctx.getContext('2d')!, config);
    } else {
      console.error('Elemen Canvas tidak ditemukan atau context tidak tersedia');
    }
  }

  updateImuChart() {
    const newAmplitude = this.accelerometerX; // Sesuaikan dengan data yang ingin ditampilkan
    this.chartData.push(newAmplitude);
    this.timeLabels.push(this.chartData.length);

    if (this.chartData.length > 60) {
      this.chartData.shift(); // Hapus data lama jika lebih dari 60 detik
      this.timeLabels.shift();
    }

    this.imuChart.data.labels = this.timeLabels; // Update chart labels
    this.imuChart.data.datasets[0].data = this.chartData; // Update chart data
    this.imuChart.update(); // Refresh the chart

    // Simpan data yang direkam
    this.recordedData.push({
      timestamp: new Date().toISOString(),
      imu: newAmplitude,
    });
  }

  onResize() {
    if (this.renderer) {
      const canvasWidth = window.innerWidth;
      const canvasHeight = 300;
      this.renderer.setSize(canvasWidth, canvasHeight);
      this.camera.aspect = canvasWidth / canvasHeight;
      this.camera.updateProjectionMatrix();
    }
  }

  initThreeJS() {
    const canvasElm = document.getElementById("3d-container") as HTMLCanvasElement;
    const canvasWidth = window.innerWidth;
    const canvasHeight = 300;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(canvasWidth, canvasHeight);
    this.renderer.setClearColor(0xffffff, 0);
    document.getElementById('3d-container')!.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    const geometry = new THREE.BoxGeometry(2, 0.5, 5);
    const material = new THREE.MeshBasicMaterial({
      color: 0x8B4513,
      transparent: true,
      opacity: 0.8
    });
    this.object = new THREE.Mesh(geometry, material);
    this.scene.add(this.object);

    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    this.object.add(edgeLines);

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.object) {
      this.object.rotation.x = this.accelerometerX ? (this.accelerometerX * Math.PI / 180) : 0;
      this.object.rotation.y = this.accelerometerY ? (this.accelerometerY * Math.PI / 180) : 0;
      this.object.rotation.z = this.gyroscopeZ ? (this.gyroscopeZ * Math.PI / 180) : 0;
    }

    this.renderer.render(this.scene, this.camera);
  }

  update3DObject() {
    // Update rotasi objek berdasarkan data IMU
    this.object.rotation.x = this.accelerometerX ? (this.accelerometerX * Math.PI / 180) : 0;
    this.object.rotation.y = this.accelerometerY ? (this.accelerometerY * Math.PI / 180) : 0;
    this.object.rotation.z = this.gyroscopeZ ? (this.gyroscopeZ * Math.PI / 180) : 0;
  }

  setDeviceData(imuData: any) {
    if (imuData) {
      this.emg = imuData.emg ? imuData.emg : 0;

      this.accelerometerX = imuData.accelerometer && imuData.accelerometer.x ? imuData.accelerometer.x : 0;
      this.accelerometerY = imuData.accelerometer && imuData.accelerometer.y ? imuData.accelerometer.y : 0;
      this.accelerometerZ = imuData.accelerometer && imuData.accelerometer.z ? imuData.accelerometer.z : 0;

      this.gyroscopeX = imuData.gyroscope && imuData.gyroscope.x ? imuData.gyroscope.x : 0;
      this.gyroscopeY = imuData.gyroscope && imuData.gyroscope.y ? imuData.gyroscope.y : 0;
      this.gyroscopeZ = imuData.gyroscope && imuData.gyroscope.z ? imuData.gyroscope.z : 0;

      this.magnetometerX = imuData.magnetometer && imuData.magnetometer.x ? imuData.magnetometer.x : 0;
      this.magnetometerY = imuData.magnetometer && imuData.magnetometer.y ? imuData.magnetometer.y : 0;
      this.magnetometerZ = imuData.magnetometer && imuData.magnetometer.z ? imuData.magnetometer.z : 0;
    }
  }

  downloadData() {
    // Buat header CSV
    const header = 'Timestamp,EMG,AccelerometerX,AccelerometerY,AccelerometerZ,GyroscopeX,GyroscopeY,GyroscopeZ,MagnetometerX,MagnetometerY,MagnetometerZ\n';
    
    // Buat baris data untuk setiap entri
    const csvRows = this.imuData.map(row => {
        return `${new Date().toISOString()},${row.emg},${row.accelerometerX},${row.accelerometerY},${row.accelerometerZ},${row.gyroscopeX},${row.gyroscopeY},${row.gyroscopeZ},${row.magnetometerX},${row.magnetometerY},${row.magnetometerZ}`;
    });

    // Gabungkan header dan data
    const csvData = header + csvRows.join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imu_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Hapus URL blob
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    window.removeEventListener('resize', this.onResize.bind(this));
  }
  
  goBack() {
    this.router.navigate(['..']); // Navigasi ke halaman sebelumnya
  }
}