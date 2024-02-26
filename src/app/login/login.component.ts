import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isShowPassword:boolean = false

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.form = this.fb.group({
      username: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z0-9_]*'),
        ],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(5),
          Validators.pattern('^[a-zA-Z0-9]*')
        ],
      ],
    });
  }
  updateStatusPassword(){
    this.isShowPassword = !this.isShowPassword
  }
  login() {
    if(!this.form.valid){
      this.form.markAllAsTouched()
      return;
    }
    this.authService.login(this.form.get('username')?.value);
  }
}
