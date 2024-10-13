import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-preases',
  templateUrl: './preases.page.html',
  styleUrls: ['./preases.page.scss'],
})
export class PreasesPage implements OnInit {
  answer1: string = ''; // Variabel untuk menyimpan jawaban pertama
  answer2: string = ''; // Variabel untuk menyimpan jawaban kedua
  answer3: string = ''; // Variabel untuk menyimpan jawaban ketiga
  answer4: string = ''; // Variabel untuk menyimpan jawaban keempat
  answer5: string = ''; // Variabel untuk menyimpan jawaban kelima

  constructor(public api: ApiService) { } // Injeksi AngularFirestore

  ngOnInit() {
    
  }

  updatePreases() {
    const data = {
      answer1: this.answer1,
      answer2: this.answer2,
      answer3: this.answer3,
      answer4: this.answer4,
      answer5: this.answer5,
    };


    this.api.updatePreases(JSON.stringify(data));

    }
 
}
