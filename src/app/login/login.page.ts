import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  hide: boolean = true;
  loginForm: FormGroup;
  passwordType: string = 'password'; // Awalnya set ke 'password'


  constructor(public formBuilder: FormBuilder, public api: ApiService) {

    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required, 
        Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6) 
      ])),
    })

   }

  ngOnInit() {
   
  }

  login() {
    this.api.loader = true;
    this.api.signin(this.loginForm.value['email'], this.loginForm.value['password']);
  }
    // Fungsi untuk toggle visibility password
    togglePasswordVisibility() {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    }
}