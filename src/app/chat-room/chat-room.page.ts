import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {

  public username: string; // Properti untuk menyimpan nama pengguna yang login
  public user2Name: string; // Properti untuk menyimpan nama pengguna lain (user2)

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
    this.route.queryParamMap.subscribe(snap => {
      this.user = snap['params']; // Mengambil data pengguna lain (user2)
      this.user2Name = this.user.name; // Simpan nama user2
      this.getChat();
    });
    this.session = localStorage.getItem('loggedIn'); // Mendapatkan sesi pengguna yang login
  }

  ngOnInit() {
    this.loadUserData(); // Memuat data pengguna login
  }

  loadUserData() {
    // Ambil data pengguna dari localStorage
    const userData = JSON.parse(localStorage.getItem('users'));
    if (userData) {
      this.username = userData.name; // Ambil nama pengguna login
    } else {
      this.username = "User"; // Default jika tidak ada data pengguna login
    }
  }

  ionViewDidEnter() {
    // Scroll otomatis ke bagian bawah saat chat room dibuka
    this.content.scrollToBottom();
  }

  goBack() {
    this.router.navigate(['/tabs/chat'], { replaceUrl: true, skipLocationChange: false });
  }

  logout() {
    this.api.signOut();
  }

  async sendChat() {
    if (this.chat) {
      const newMessage = {
        from: this.session, // Pengguna yang login
        to: this.user.id,   // Pengguna lain (user2)
        msg: this.chat,
        status: 'pending',
        timestamp: new Date(),
      };

      try {
        await this.api.sendMsg(this.user.id, this.user.id, this.session, this.chat); // Mengirim pesan
        newMessage.status = 'sent'; // Jika pesan berhasil dikirim
      } catch (error) {
        newMessage.status = 'failed'; // Jika pesan gagal dikirim
      }

      this.messages.push(newMessage); // Tambahkan pesan ke daftar pesan
      this.chat = ''; 
      this.content.scrollToBottom(); // Scroll ke bawah setelah pesan dikirim
    }
  }  

  getChat() {
    this.api.db.collection("chatRoom")
      .where('id', 'array-contains', this.session) // Mendapatkan pesan yang terkait dengan sesi pengguna login
      .onSnapshot((querySnapshot) => {
        this.loader = false;
        querySnapshot.forEach((doc) => {
          let data = doc.data();

          if ((data.from == this.user.id && data.to == this.session) || 
              (data.from == this.session && data.to == this.user.id)) {
            if (this.chatKeys.indexOf(data.key) < 0) {
              // Tentukan status pesan (seen atau sent)
              data.status = data.seen ? 'seen' : 'sent';
              this.messages.push(data); // Tambahkan pesan ke array
              this.chatKeys.push(data.key); // Tambahkan kunci chat
            }
          }
        });
        this.messages.sort(this.sortDate); // Urutkan pesan berdasarkan waktu
      });
  }

  sortDate(a, b) {
    var dateA = new Date(a.timestamp.toDate());
    var dateB = new Date(b.timestamp.toDate());
    return dateA > dateB ? 1 : -1;
  }

  formatDate(message: any) {
    let date = message['timestamp'] ? message['timestamp'].toDate() : new Date();
    return this.api.formatAMPM(date);
  }

  ionViewWillLeave() {
    console.log('unsubscribe successfully');
  }

}
