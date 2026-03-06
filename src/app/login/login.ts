import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  message = '';
  generatedOtp = '';
  otpSent = false;
  otpVerified = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {

    this.loginForm = this.fb.group({
      mobile: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      otp: ['']
    });
  }

  requestOtp() {

    this.message = '';

    const mobileControl = this.loginForm.get('mobile');

    if (!mobileControl || mobileControl.invalid) {
      this.message = 'Enter valid 10-digit mobile number';
      return;
    }

    const mobileNumber = mobileControl.value;

    // 🔹 Call backend to check if phone exists
    this.loginService.validatePhone(mobileNumber).subscribe({

      next: (response: boolean) => {

        if (response === true) {

          // ✅ Generate OTP ONLY if phone exists
          this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
          this.otpSent = true;

          this.loginForm.get('otp')?.setValidators([
            Validators.required,
            Validators.pattern(/^[0-9]{6}$/)
          ]);

          this.loginForm.get('otp')?.updateValueAndValidity();

          this.message = `OTP Sent Successfully (Demo OTP: ${this.generatedOtp})`;

        } else {

          // ❌ Phone does not exist
          this.message = 'Phone number not registered';

        }
      },

      error: () => {
        this.message = 'Server error. Please try again.';
      }

    });
  }


  onSubmit() {

    this.message = '';

    if (!this.otpSent) {
      this.message = 'Please request OTP first';
      return;
    }

    const enteredOtp = this.loginForm.get('otp')?.value;

    if (!enteredOtp) {
      this.message = 'Enter OTP';
      return;
    }

    if (enteredOtp === this.generatedOtp) {

      this.message = 'Login Successful!';
      this.router.navigate(['/aadhaar']);

    } else {

      this.message = 'Enter valid OTP';
      this.loginForm.get('otp')?.reset();
    }
  }
}