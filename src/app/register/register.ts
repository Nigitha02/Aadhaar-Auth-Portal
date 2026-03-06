import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from '../services/auth.service';
import { UserDet } from '../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  generatedCaptcha: string = '';
  showPopup: boolean = false;
  showErrorMessage = false;
  showCaptchaSection: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    //private userDet: UserDet
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-z ]+$/)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],
      captchaInput: ['', Validators.required]
    });
  }

  get f(): any {
    return this.registerForm.controls;
  }

  generateCaptcha(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.generatedCaptcha = '';

    for (let i = 0; i < 6; i++) {
      this.generatedCaptcha += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }
  }

  isFormValid(): boolean {
    return (
      this.f.fullName.valid &&
      this.f.email.valid &&
      this.f.phone.valid &&
      this.generatedCaptcha !== '' &&
      this.registerForm.value.captchaInput === this.generatedCaptcha
    );
  }

  phoneExists: boolean = false;

  onSubmit(): void {

    if (
      this.f.fullName.invalid ||
      this.f.email.invalid ||
      this.f.phone.invalid
    ) {
      this.showErrorMessage = true;
      return;
    }
    this.registerForm.get('phone')?.valueChanges.subscribe(() => {
      this.phoneExists = false;
      this.registerForm.get('phone')?.setErrors(null);
    });

    this.showErrorMessage = false;

    if (!this.showCaptchaSection) {
      this.showCaptchaSection = true;
      this.generateCaptcha();
      return;
    }

    if (this.registerForm.value.captchaInput !== this.generatedCaptcha) {
      this.showErrorMessage = true;
      return;
    }

    const userData = {
      phoneno: this.registerForm.value.phone,
      name: this.registerForm.value.fullName,
      gmail: this.registerForm.value.email
    };

    this.registerService.registerUser(userData).subscribe(
      response => {
        this.phoneExists = false;
        this.showPopup = true;

        const registeredPhone = this.registerForm.value.phone;

        setTimeout(() => {
          this.showPopup = false;
          this.router.navigate(['/login'], {
            state: { mobile: registeredPhone }
          });
        }, 2000);
      },
      error => {
        if (error.status === 409) {
          this.phoneExists = true;   // 👈 Mark phone as existing
          alert('Phone number already exists. Please enter a different number.');
          this.registerForm.controls['phone'].setErrors({ phoneExists: true });
          window.location.reload();
        } else {
          console.error('Registration failed:', error);
        }
      }
    );
  }
}
