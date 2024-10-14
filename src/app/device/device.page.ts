import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage implements OnInit, OnDestroy {
  public imuData: any;
  public emgData: number;
  public duration: number = 0; // Inisialisasi durasi dalam detik
  public formattedDuration: string = '00:00:00'; // Format durasi awal
  public datastreamSize: number; 
  public deviceStatus: string; 
  public isConnected: boolean;
  private durationInterval: any; // Interval ID untuk durasi

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.fetchData();
    this.startDuration(); // Mulai menghitung durasi
  }

  ngOnDestroy() {
    this.stopDuration(); // Hentikan interval saat komponen di-unload
  }

  fetchData() {
    // Get data from ApiService
    this.imuData = this.api.getImuData();
    this.emgData = this.api.getEmgData();
    
    // Calculate datastream size
    this.datastreamSize = this.calculateDatastreamSize();

    // Set device status
    this.deviceStatus = this.api.getConnectionStatus() ? 'Connected' : 'Disconnected';
  }

  private startDuration() {
    this.durationInterval = setInterval(() => {
      if (this.api.getConnectionStatus()) { // Hanya perbarui durasi jika terhubung
        this.duration++; // Increment durasi
        this.formattedDuration = this.formatDuration(this.duration); // Update format durasi
      } else {
        this.stopDuration(); // Hentikan jika tidak terhubung
      }
    }, 1000); // Update setiap detik
  }

  private stopDuration() {
    if (this.durationInterval) {
      clearInterval(this.durationInterval); // Hentikan interval
    }
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Format ke dua digit dengan padStart
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  private calculateDatastreamSize(): number {
    const recordedData = this.api.getRecordedData();
    return recordedData.length; // Example logic: size could be the count of recorded data
  }

  loadData() {
    this.imuData = this.api.getImuData();
    this.emgData = this.api.getEmgData();
    this.isConnected = this.api.getConnectionStatus();
  }

  navigateToDiagnose() {
    this.router.navigate(['/tabs/device-info']);
  }
}