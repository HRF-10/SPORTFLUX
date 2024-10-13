

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiService } from './api/api.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public api: ApiService
  ) {
    this.initializeApp();
    this.api.configApp();

    this.bgm = new Audio('assets/bgm.mp3');
    this.klik = new Audio('../../assets/click.wav');
    this.play();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#009688');
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }


  bgm : any; 




  public play(){
    this.bgm.play();
    this.bgm.loop = true;
  }

  klikk(){
    this.klik.pause();
    this.klik.currentTime = 0;
    this.klik.play();
  }




  public volume(value){
    this.bgm.volume = value;
  }

  public volume2(value){
    this.klik.volume = value;
  }


  public klik : any;






  
  ngOnInit(){
    this.bgm.volume = 0;
    
  
  }
}
