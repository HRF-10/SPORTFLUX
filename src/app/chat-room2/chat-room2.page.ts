import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-chat-room2',
  templateUrl: './chat-room2.page.html',
  styleUrls: ['./chat-room2.page.scss'],
})
export class ChatRoom2Page implements OnInit {
  
  public username: string; // Menyimpan nama pengguna yang login
  public user2Name: string; // Menyimpan nama pengguna lain (user2)
  
  @ViewChild(IonContent, { static: true }) content: IonContent;

  user: any;
  chat: string;
  unsubscribe: any;
  messages: any = [];
  chatKeys: any = [];
  session: any;
  loader: boolean = true;

  constructor(
    public api: ApiService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    // Mendapatkan data pengguna lain (user2) dari query params
    this.route.queryParamMap.subscribe(snap => {
      this.user = snap['params']; // Mengambil data pengguna lain
      this.user2Name = this.user.name; // Simpan nama pengguna lain (user2)
      this.getChat(); // Memanggil fungsi untuk mengambil chat
    });
    this.session = localStorage.getItem('loggedIn'); // Mendapatkan sesi pengguna yang login
  }

  ngOnInit() {
    this.loadUserData(); // Memuat data pengguna yang login
  }

  loadUserData() {
    // Ambil data pengguna login dari localStorage
    const userData = JSON.parse(localStorage.getItem('users'));
    if (userData) {
      this.username = userData.name; // Simpan nama pengguna yang login
    } else {
      this.username = "User"; // Default jika data pengguna login tidak ditemukan
    }
  }

  ionViewDidEnter() {
    // Scroll otomatis ke bagian bawah saat masuk ke chat room
    this.content.scrollToBottom();
  }

  goBack() {
    // Navigasi kembali ke halaman chat list
    this.router.navigate(['/tabs/chat2'], { replaceUrl: true, skipLocationChange: false });
  }

  logout() {
    // Fungsi untuk logout
    this.api.signOut();
  }

  async sendChat() {
    // Fungsi untuk mengirim pesan
    if (this.chat) {
      const newMessage = {
        from: this.session, // Pengguna yang login
        to: this.user.id,   // Pengguna lain (user2)
        msg: this.chat,
        status: 'pending',
        timestamp: new Date(),
      };

      try {
        // Mengirim pesan ke server melalui API
        await this.api.sendMsgChat2(this.user.id, this.user.id, this.session, this.chat);
        newMessage.status = 'sent'; // Jika pesan berhasil dikirim
      } catch (error) {
        newMessage.status = 'failed'; // Jika pesan gagal dikirim
      }

      // Tambahkan pesan baru ke array pesan
      this.messages.push(newMessage);
      this.chat = ''; // Kosongkan input chat setelah pesan dikirim
      this.content.scrollToBottom(); // Scroll otomatis ke bawah
    }
  }

  getChat() {
    // Mengambil pesan dari Firestore (koleksi chatRoom2)
    this.api.db.collection("chatRoom2")
      .where('id', 'array-contains', this.session) // Mengambil pesan terkait pengguna login
      .onSnapshot((querySnapshot) => {
        this.loader = false;
        querySnapshot.forEach((doc) => {
          let data = doc.data();

          // Memfilter pesan berdasarkan pengirim dan penerima
          if ((data.from == this.user.id && data.to == this.session) || 
              (data.from == this.session && data.to == this.user.id)) {
            if (this.chatKeys.indexOf(data.key) < 0) {
              // Tentukan status pesan (seen atau sent)
              data.status = data.seen ? 'seen' : 'sent';
              this.messages.push(data); // Tambahkan pesan ke array messages
              this.chatKeys.push(data.key); // Simpan kunci pesan
            }
          }
        });
        // Urutkan pesan berdasarkan timestamp
        this.messages.sort(this.sortDate);
      });
  }

  sortDate(a, b) {
    // Fungsi untuk mengurutkan pesan berdasarkan timestamp
    var dateA = new Date(a.timestamp.toDate());
    var dateB = new Date(b.timestamp.toDate());
    return dateA > dateB ? 1 : -1;
  }

  formatDate(message: any) {
    // Format tanggal pesan
    let date = message['timestamp'] ? message['timestamp'].toDate() : new Date();
    return this.api.formatAMPM(date);
  }

  ionViewWillLeave() {
    // Logging ketika pengguna keluar dari halaman
    console.log('unsubscribe successfully');
  }

}
