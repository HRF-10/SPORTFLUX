import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/api/api.service'; // Import ApiService

// Deklarasi THREE sebagai variabel global
declare var THREE: any;

@Component({
  selector: 'app-imu',
  templateUrl: './imu.page.html',
  styleUrls: ['./imu.page.scss'],
})
export class ImuPage implements OnInit {
  public accelerometerX: number = 0;
  public accelerometerY: number = 0;
  public accelerometerZ: number = 0;
  public gyroscopeX: number = 0;
  public gyroscopeY: number = 0;
  public gyroscopeZ: number = 0;
  public magnetometerX: number = 0;
  public magnetometerY: number = 0;
  public magnetometerZ: number = 0;

  private scene: any;
  private camera: any;
  private renderer: any;
  private object: any;

  constructor(private navCtrl: NavController, private api: ApiService) {} // Inject ApiService

  ngOnInit() {
    this.initThreeJS(); // Initialize Three.js scene
    this.loadImuData(); // Load IMU data on initialization
  }

  initThreeJS() {
    const canvasElm = document.getElementById("3d-container") as HTMLCanvasElement;
    const canvasWidth = window.innerWidth; // Set canvas width
    const canvasHeight = 300; // Set canvas height

    // Create scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
    this.camera.position.z = 5; // Jarak kamera dari objek

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(canvasWidth, canvasHeight);
    this.renderer.setClearColor(0xffffff, 0); // Mengubah warna latar belakang menjadi putih
    document.getElementById('3d-container')!.appendChild(this.renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Create a rectangular shape (papan) berwarna coklat dengan ukuran yang lebih besar
    const geometry = new THREE.BoxGeometry(2, 0.5, 5); // Ukuran balok (width, height, depth) diperbesar
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x8B4513, // Warna coklat (saddle brown)
        transparent: true, 
        opacity: 0.8 
    });
    this.object = new THREE.Mesh(geometry, material); // Membuat mesh dari geometris dan material
    this.scene.add(this.object); // Menambahkan objek ke scene

    // Add edges to the object
    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Warna hitam untuk garis tepi
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    this.object.add(edgeLines); // Tambahkan garis tepi ke objek

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Update object rotation based on IMU data
    if (this.object) {
      // Sesuaikan rotasi objek berdasarkan data IMU
      this.object.rotation.x = this.accelerometerX * Math.PI / 180; // Konversi ke radian saat melakukan rotasi
      this.object.rotation.y = this.accelerometerY * Math.PI / 180; // Konversi ke radian saat melakukan rotasi
      this.object.rotation.z = this.gyroscopeZ * Math.PI / 180; // Konversi ke radian saat melakukan rotasi
    }

    this.renderer.render(this.scene, this.camera);
  }

  loadImuData() {
    const imuData = this.api.getImuData(); // Ambil data IMU dari ApiService
    this.setImuData(imuData); // Atur data IMU
  }

  setImuData(imuData: any) {
    if (imuData) {
      // Tidak ada konversi ke radian, gunakan nilai derajat langsung
      this.accelerometerX = imuData.accelerometer.x; // Gunakan data akselerometer
      this.accelerometerY = imuData.accelerometer.y; // Gunakan data akselerometer
      this.accelerometerZ = imuData.accelerometer.z; // Gunakan data akselerometer
      this.gyroscopeX = imuData.gyroscope.x; // Gunakan data giroskop
      this.gyroscopeY = imuData.gyroscope.y; // Gunakan data giroskop
      this.gyroscopeZ = imuData.gyroscope.z; // Gunakan data giroskop
      this.magnetometerX = imuData.magnetometer.x; // Mengambil data magnetometer
      this.magnetometerY = imuData.magnetometer.y; // Mengambil data magnetometer
      this.magnetometerZ = imuData.magnetometer.z; // Mengambil data magnetometer
    }
  }

  goBack() {
    this.navCtrl.navigateBack('/tabs/home');
  }
}