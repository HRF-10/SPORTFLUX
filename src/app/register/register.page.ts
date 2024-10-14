import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/services/custom-validators';
import { ApiService } from 'src/app/api/api.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  showPassword = false; // Properti untuk mengatur visibilitas password
  hide: boolean = true;
  c_hide: boolean = true;
  registerForm: FormGroup;
  selectedFile: File; // Properti untuk menyimpan file yang dipilih

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public plt: Platform
  ) {
    // Membuat form dengan field yang dibutuhkan, termasuk kategori
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      wa: new FormControl('', Validators.compose([
        Validators.required
      ])),
      gender: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required), // Field untuk kategori
      city: new FormControl('', Validators.required), // New field for city
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, {
      validators: MustMatch('password', 'confirm_password')
    });
  }

  ngOnInit() {}

  // Tangani peristiwa saat file dipilih
  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    if (inputNode.files.length > 0) {
      const file = inputNode.files[0];
      const fileType = file.type.toLowerCase();

      if (fileType !== 'image/jpeg') {
        alert('Please select a JPEG file.');
        inputNode.value = ''; // Kosongkan input file jika tidak valid
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
    }
  }

  // Fungsi untuk menangani proses register
  register() {
    this.api.loader = true; 
    this.api.signUp(
      this.registerForm.value['name'], 
      this.registerForm.value['email'], 
      this.registerForm.value['password'], 
      this.registerForm.value['gender'], 
      this.registerForm.value['wa'],
      this.registerForm.value['category'],
      this.registerForm.value['city']
    );
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword; // Toggle nilai showPassword
  }
}