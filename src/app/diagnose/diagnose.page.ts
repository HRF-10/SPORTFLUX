import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
declare const Chart: any;

@Component({
  selector: 'app-diagnose',
  templateUrl: './diagnose.page.html',
  styleUrls: ['./diagnose.page.scss'],
})
export class DiagnosePage implements OnInit {
  muscleWaveCharts: any[] = [];
  showCharts: boolean = false; // Menyimpan status untuk menampilkan grafik

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // Inisialisasi grafik saat halaman dimuat
    this.initializeMuscleWaveCharts();
  }

  toggleCharts() {
    this.showCharts = !this.showCharts; // Mengubah status showCharts
    if (this.showCharts) {
      // Tunggu hingga DOM diperbarui
      setTimeout(() => {
        this.initializeMuscleWaveCharts(); // Inisialisasi grafik jika aktif
      }, 0);
    } else {
      // Hancurkan grafik jika dinonaktifkan
      this.muscleWaveCharts.forEach(chart => chart.destroy());
      this.muscleWaveCharts = []; // Kosongkan array grafik
    }
  }

  initializeMuscleWaveCharts() {
    for (let i = 1; i <= 4; i++) {
      const ctx = document.getElementById(`heartRateChart${i}`) as HTMLCanvasElement;
      if (!ctx) {
        console.error(`Canvas element with ID heartRateChart${i} not found`);
        continue; // Lewati iterasi jika canvas tidak ditemukan
      }

      const initialData = {
        labels: [],
        datasets: [{
          label: '',
          data: [],
          borderColor: 'white',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        }]
      };

      const chart = new Chart(ctx, {
        type: 'line',
        data: initialData,
        options: {
          scales: {
            x: {
              type: 'linear',
              title: {
                display: false,
              },
              ticks: {
                display: false,
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
              },
            },
            y: {
              beginAtZero: false,
              suggestedMin: -1,
              suggestedMax: 1,
              title: {
                display: false,
              },
              ticks: {
                display: false,
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
              },
            }
          },
          plugins: {
            legend: {
              display: false,
            }
          }
        }
      });

      this.muscleWaveCharts.push(chart);
      this.updateMuscleWaveChart(chart, i);
    }
  }

  updateMuscleWaveChart(chart: any, channelId: number) {
    let time = 0;
    const frequencyMultiplier = channelId * 0.5;
    const phaseOffset = channelId * Math.PI / 4;

    setInterval(() => {
      const newWaveData = Math.sin((time / 10) * frequencyMultiplier + phaseOffset) + (Math.random() - 0.5) / 5;
      chart.data.labels.push(time);
      chart.data.datasets[0].data.push(newWaveData);
      chart.update();
      time++;

      // Menghapus data lebih dari 10 label
      if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }
    }, 1000);
  }

  goBack() {
    this.navCtrl.back();
  }
}