import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-splash1',
  templateUrl: './splash1.page.html',
  styleUrls: ['./splash1.page.scss'],
})
export class Splash1Page implements OnInit {

  constructor(public api: ApiService,
    public route: ActivatedRoute,
    public router: Router) { }

  ngOnInit(): void {
    
  }
  





}
