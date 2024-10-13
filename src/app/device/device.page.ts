import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToDiagnose() {
    this.router.navigate(['/tabs/diagnose']);
  }
}
