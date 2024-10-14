import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  loader: boolean = false;
  user: any;
  db: any;
  public admin : any;
  public isConnected: boolean = false;
  storage : any;
  logged : any;
  ida : any;
  private imuData: any = {
    accelerometer: { x: 0, y: 0, z: 0 },
    gyroscope: { x: 0, y: 0, z: 0 },
    magnetometer: { x: 0, y: 0, z: 0 }
  };
  private emgData: any;
  private recordedData: any[] = [];
  

  constructor(
    private snack: SnackbarService,
    private router: Router
  ) {
    
  }

  configApp() {
    firebase.initializeApp(environment.firebase);
    this.db = firebase.firestore();//firebase.database();
    this.storage = firebase.storage();
  }

  signin(email: string, password: string) {
    localStorage.clear();
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
        this.loader = false;
        this.user = {
            id: email.substring(0, email.indexOf('@')).toLowerCase()
        };

        localStorage.setItem('loggedIn', this.user.id); 

        this.db.collection("users").doc(this.user.id).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    this.user = {
                        id: this.user.id,
                        name: userData.name,
                        gender: userData.gender,
                        wa: userData.wa,
                        photoURL: userData.photoURL,
                        admin: userData.admin,
                        preases: userData.preases,
                    };

                    localStorage.setItem('users', JSON.stringify(this.user));

                    this.getOtherUsers(this.user.id);

                    if (this.user.preases == 0) {
                      this.router.navigate(['/tabs/home'], { skipLocationChange: false })
                    }

                } else {
                    console.log("Dokumen pengguna tidak ditemukan");
                }
            })
            .catch((error) => {
                console.error('Error getting user document:', error);
            });
    })
    .catch((error) => {
        this.loader = false;
        console.log('Error during sign-in:', error);
        this.snack.openSnackBar(error.message, 'ok');
    });
  }

  // Metode untuk mengambil pengguna lain
  getOtherUsers(loggedInUserId: string) {
    this.db.collection("users").get().then(snapshot => {
        const otherUsers = [];
        snapshot.forEach(doc => {
            const userData = doc.data();
            if (doc.id !== loggedInUserId) {
                otherUsers.push({
                    id: doc.id,
                    name: userData.name
                });
            }
        });
        localStorage.setItem('otherUsers', JSON.stringify(otherUsers));
        console.log('Other users:', otherUsers);
    }).catch(error => {
        console.error('Error getting users:', error);
    });
  }

  updatePreases(newPreasesValue: string) {
    const userDataFromLocalStorage = localStorage.getItem('users');
    const userData = JSON.parse(userDataFromLocalStorage);
    const userId = userData.id;
    const userRef = this.db.collection("users").doc(userId);
  
    userRef.update({
      preases: newPreasesValue
    })
    .then(() => {
      console.log(`Nilai preases untuk pengguna dengan ID ${userId} berhasil diperbarui.`);
      this.router.navigate(['/tabs/home'], { replaceUrl : true, skipLocationChange: false });
    })
    .catch((error) => {
      console.error("Error updating document:", error);
    });
  }

  async getAllUsers() {
    try {
      const usersCollection = await this.db.collection("users").get();
      
      const users = [];
      usersCollection.forEach(doc => {
        users.push(doc.data());
      });
  
      return users;
    } catch (error) {
      console.error("Error fetching users: ", error);
      throw error;
    }
  }

  async exportUsersToExcel() {
    try {
      const users = await this.getAllUsers();

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

  signUp(
    name: string, 
    email: string, 
    password: string, 
    gender: string, 
    wa: string, 
    category: string,
    city: string,
  ) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((_user) => {
        this.loader = false;
  
        this.user = {
          name: name,
          id: email.substring(0, email.indexOf('@')).toLowerCase()
        };

        localStorage.setItem('loggedIn', this.user.id);
        localStorage.setItem('users', JSON.stringify(this.user));
  
        // Simpan data pengguna di Firestore
        this.db.collection("users").doc(this.user.id).set({
          name: name,
          id: this.user.id,
          gender: gender,
          wa: wa,
          category: category,
          city: city,
          preases: 0,
        }).then(() => {
          this.router.navigate(['splash1'], { skipLocationChange: false });
        }).catch((error) => {
          console.error('Error saat menyimpan informasi pengguna di Firestore:', error);
          this.snack.openSnackBar('Error menyimpan data di Firestore: ' + error.message, 'ok');
        });
  
      })
      .catch((error) => {
        this.loader = false;
        console.log('Error saat signup:', error);
        this.snack.openSnackBar(error.message, 'ok'); // Tampilkan pesan error
      });
  }

  sendWelcomeMessage(userId: string, nama : string) {
    let unique = this.generateRandomString(16);

    this.db.collection("chatRoom/").doc(unique).set({
      key: this.generateRandomString(6),
      id: ['admin3', userId], // Admin mengirim pesan ke pengguna baru
      to: userId,
      from: 'admin3',
      msg: 'Selamat datang, !'+nama+'Di sini, setiap klik adalah peluang untuk membangun dunia digital yang lebih baik. Selamat bergabung dalam Digital Ethics Class, tempat di mana kita bersama-sama menjelajahi tata krama online, membentuk sikap bijak, dan menjadikan internet sebagai tempat yang aman dan inspiratif. Dengan konten yang menyenangkan dan edukatif, kita akan mengupas topik-topik menarik seputar etika digital. Bersiaplah untuk mendapatkan pengetahuan baru, keterampilan yang diperlukan, dan menjadi pahlawan digital yang bertanggung jawab! Ayo mulai petualangan etika digital kita bersama. Selamat belajar dan nikmati setiap momennya!',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });



    console.log('bababbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  }

  sendWelcomeMessage2(userId: string, nama : string) {
    let unique = this.generateRandomString(16);

    this.db.collection("chatRoom2/").doc(unique).set({
      key: this.generateRandomString(6),
      id: ['admin3', userId], // Admin mengirim pesan ke pengguna baru
      to: userId,
      from: 'admin3',
      msg: 'Selamat datang, !'+nama+'Di sini, setiap klik adalah peluang untuk membangun dunia digital yang lebih baik. Selamat bergabung dalam Digital Ethics Class, tempat di mana kita bersama-sama menjelajahi tata krama online, membentuk sikap bijak, dan menjadikan internet sebagai tempat yang aman dan inspiratif. Dengan konten yang menyenangkan dan edukatif, kita akan mengupas topik-topik menarik seputar etika digital. Bersiaplah untuk mendapatkan pengetahuan baru, keterampilan yang diperlukan, dan menjadi pahlawan digital yang bertanggung jawab! Ayo mulai petualangan etika digital kita bersama. Selamat belajar dan nikmati setiap momennya!',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });



    console.log('bababbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  }

  signOut(){
    localStorage.clear();
    firebase.auth().signOut().then(()=> {
      this.user = {};
      localStorage.removeItem('loggedIn');
      this.router.navigate(['/login'], { skipLocationChange: false });
      
    }).catch((error)=> {
      console.log('error while logout', error);
    });
    
  }

  sendMsg(id: string, to:string, from:string, msg: string) {
    let unique = this.generateRandomString(16);

    this.db.collection("chatRoom/").doc(unique).set({
      key: this.generateRandomString(6),
      id: [`${to}`, `${from}`],
      to: (to) ? to : 'admin',
      from: (from) ? from : 'admin',
      msg: msg,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  sendMsgChat2(id: string, to:string, from:string, msg: string) {
    let unique = this.generateRandomString(16);

    this.db.collection("chatRoom2/").doc(unique).set({
      key: this.generateRandomString(6),
      id: [`${to}`, `${from}`],
      to: (to) ? to : 'admin',
      from: (from) ? from : 'admin',
      msg: msg,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  resetPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  generateRandomString(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  setImuData(data: any) {
    this.imuData = data;
  }

  setEmgData(data: any) {
    this.emgData = data;
  }

  getImuData() {
    return this.imuData;
  }

  getEmgData() {
    return this.emgData;
  }

  setRecordedData(data: any[]) {
    this.recordedData = data;
  }

  getRecordedData(): any[] {
    return this.recordedData;
  }

  addRecordedData(dataPoint: any) {
    this.recordedData.push(dataPoint);
  }

  clearRecordedData() {
    this.recordedData = [];
  }

  updateConnectionStatus(status: boolean) {
    this.isConnected = status;
  }

  getConnectionStatus(): boolean { // Tambahkan metode untuk mendapatkan status koneksi
    return this.isConnected;
  }

}
