import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import * as XLSX from 'xlsx';
import * as firebase from 'firebase';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(public api: ApiService) { 

  }

  usersa : any;

  ngOnInit() {
    this.someFunction();
    

 
  }

  
    m1 : any = [1,0,1,0,3,3,1,0,3,4];

    m2 : any = [2,3,2,2,4,2,0,4,2,2];
  
  


  calcump1m1(user){
 
    const userAnswers = JSON.parse(user.skorp1m1).answers1;
    console.log(userAnswers);
    return this.compareAnswers(userAnswers, this.m1);
  }

  calcump1m2(user){

    const userAnswers = JSON.parse(user.skorp1m2).answers1;
    return this.compareAnswers(userAnswers, this.m2);
  }

  calcump2m1(user){

    const userAnswers = JSON.parse(user.skorp2m1).answers1;
    return this.compareAnswers(userAnswers, this.m1);
  }

  calcump2m2(user){

    const userAnswers = JSON.parse(user.skorp2m2).answers1;
    return this.compareAnswers(userAnswers, this.m2);
  }

  getName(user){
    console.log(user);
    return user.name;
  }

 


  compareAnswers(userAnswers, correctAnswers) {
    let score = 0;
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] === correctAnswers[i]) {
        score++;
      }
    }
    return (score*10);
  }


  async someFunction() {
    try {
      this.usersa = await this.api.getAllUsers(); 
      console.log(this.usersa); 
      var count = 0;
  
      // Iterasi melalui setiap pengguna
      this.usersa.forEach(user => {
        count = count + 1;
        console.log("HALALALALALALALALALALAL");
  
        const ionRow = document.createElement('ion-row');
        const ionCol = document.createElement('ion-col');
  
        const textDiv2 = document.createElement('div');
        textDiv2.style.textAlign = 'center';
        textDiv2.textContent = 'User Count: ' + count;
        ionCol.appendChild(textDiv2);
  
        const textDiv = document.createElement('div');
        textDiv.style.textAlign = 'center';
        textDiv.textContent = 'User Name: ' + user.name;
        ionCol.appendChild(textDiv);
  
        // Mendefinisikan tipe scores dengan lebih jelas
        let scores: { score1?: number; score2?: number; score3?: number; score4?: number } = {};
  
        for (let i = 1; i <= 5; i++) {
          const ionItem = document.createElement('ion-item');
          ionItem.setAttribute('shape', 'round');
          ionItem.style.textAlign = 'center';
          ionItem.style.background = 'transparent';
          ionItem.style.color = 'black';
          ionItem.style.borderRadius = '40px';
  
          let score;
          switch (i) {
            case 1:
              var answers1 = [5,5,5,5,5,5,5,5,5,5];
              if(user.skorp1m1 != undefined){
                if(JSON.parse(user.skorp1m1).answers1 != undefined){
                  answers1 = JSON.parse(user.skorp1m1).answers1;
                }
              }
              let score1 = 0;
              for (let i = 0; i < answers1.length; i++) {
                if (answers1[i] === this.m1[i]) {
                  score1++;
                }
              }
              score1 = (score1*10);
              scores.score1 = score1;  // Simpan score1 ke dalam objek scores
              ionItem.innerHTML = `SKOR PRE-TEST MATERI 1: ${score1}`;
              break;
            case 2:
              var answers2 = [5,5,5,5,5,5,5,5,5,5];
              if(user.skorp2m1 != undefined){
                if(JSON.parse(user.skorp2m1).answers1 != undefined){
                  answers2 = JSON.parse(user.skorp2m1).answers1;
                }
              }
              let score2 = 0;
              for (let i = 0; i < answers2.length; i++) {
                if (answers2[i] === this.m1[i]) {
                  score2++;
                }
              }
              score2 = (score2*10);
              scores.score2 = score2;  // Simpan score2 ke dalam objek scores
              ionItem.innerHTML = `SKOR POST-TEST MATERI 1: ${score2}`;
              break;
            case 3:
              var answers3 = [5,5,5,5,5,5,5,5,5,5];
              if(user.skorp1m2 != undefined){
                if(JSON.parse(user.skorp1m2).answers1 != undefined){
                  answers3 = JSON.parse(user.skorp1m2).answers1;
                }
              }
              let score3 = 0;
              for (let i = 0; i < answers3.length; i++) {
                if (answers3[i] === this.m2[i]) {
                  score3++;
                }
              }
              score3 = (score3*10);
              scores.score3 = score3;  // Simpan score3 ke dalam objek scores
              ionItem.innerHTML = `SKOR PRE-TEST MATERI 2: ${score3}`;
              break;
            case 4:
              var answers4 = [5,5,5,5,5,5,5,5,5,5];
              if(user.skorp2m2 != undefined){
                if(JSON.parse(user.skorp2m2).answers1 != undefined){
                  answers4 = JSON.parse(user.skorp2m2).answers1;
                }
              }
              let score4 = 0;
              for (let i = 0; i < answers4.length; i++) {
                if (answers4[i] === this.m2[i]) {
                  score4++;
                }
              }
              score4 = (score4*10);
              scores.score4 = score4;  // Simpan score4 ke dalam objek scores
              ionItem.innerHTML = `SKOR POST-TEST MATERI 2: ${score4}`;
              break;
            case 5:
              var preases1 = "";
              var preases2 = "";
              var preases3 = "";
              if(user.preases != undefined){
                console.log("JAJAJAKAALALALALAAAAAAAAAAAAAAAAAAAAAAAA");
                if(JSON.parse(user.preases).answer1 != undefined){
                  preases1 = "PRE-ASESMENT SOAL 1 : " + JSON.parse(user.preases).answer1;
                }
                if(JSON.parse(user.preases).answer2 != undefined){
                  preases2 = "PRE-ASESMENT SOAL 2 : " + JSON.parse(user.preases).answer2;
                }
                if(JSON.parse(user.preases).answer3 != undefined){
                  preases3 = "PRE-ASESMENT SOAL 3 : " + JSON.parse(user.preases).answer3;
                }
              }
              ionItem.innerHTML = `${preases1}<br><br>${preases2}<br><br>${preases3}<br><br>`;
              break;
          }
  
          ionCol.appendChild(ionItem);
        }
  
        // Menyimpan skor ke dalam objek pengguna
        user.scores = scores;
  
        ionRow.appendChild(ionCol);
        document.getElementById('container').appendChild(ionRow);
      });
  
      console.log(this.usersa);  // Cetak pengguna dengan skor yang sudah disimpan
  
      // Konversi data ke format yang sesuai untuk Excel
      const users = this.usersa.map(user => ({
        name: user.name,
        scorep1m1: user.scores.score1,
        jawabanp1m1: user.skorp1m1,
        scorep2m1: user.scores.score2,
        jawabanp2m1: user.skorp2m1,
        scorep1m2: user.scores.score3,
        jawabanp1m2: user.skorp1m2,
        scorep2m2: user.scores.score4,
        jawabanp2m2: user.skorp2m2,
        preases: user.preases
      }));
  
      // Buat file Excel
      const worksheet = XLSX.utils.json_to_sheet(users);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
  
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'users.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
  
      console.log('File Excel berhasil dibuat: users.xlsx');
  
    } catch (error) {
      console.error('Error exporting users to Excel: ', error);
    }
  }
  
  

  async exportToExcel(){
    this.api.exportUsersToExcel();
  }

}
