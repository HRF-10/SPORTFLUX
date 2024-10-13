import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  constructor(public appo : AppComponent) { 

    
  }
  sliderValue : any; 
  sliderValue2 : any;
  ngOnInit() {
    
    

    this.sliderValue = 100;
    this.sliderValue2 = 100;
  }



  bgmChange(){
    this.appo.volume((this.sliderValue/100));
  }

  bgmChange2(){
    this.appo.volume2((this.sliderValue2/100));
  }

}
