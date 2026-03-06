import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-aadhaar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aadhaar.html',
  styleUrls: ['./aadhaar.css']
})
export class AadhaarComponent {

  constructor(private http: HttpClient) { }

  /* -----------------------------
     Signals
  ----------------------------- */
  aadhaarInputValue = signal<string>('');
  rawAadhaar = signal<string>('');

  isScanning = signal<boolean>(false);
  isScanned = signal<boolean>(false);
  showPopup = signal<boolean>(false);
  isFlipped = signal<boolean>(false);

  scanResultIcon = signal<string>('');
  scanStatusText = signal<string>('');

  popupImg = signal<string>('');
  popupName = signal<string>('');
  popupNameTamil = signal<string>('');
  popupFatherNameTamil = signal<string>('');
  popupDob = signal<string>('');
  popupGender = signal<string>('');
  popupAadhaar = signal<string>('');

  // Dummy Address Signals
  popupAddress = signal<string>('123 Anna Street');
  popupCity = signal<string>('Chennai');
  popupPincode = signal<string>('600001');

  /* -----------------------------
     Computed
  ----------------------------- */
  isButtonEnabled = computed(() => this.rawAadhaar().length === 12);

  /* -----------------------------
     Aadhaar Input Formatting
  ----------------------------- */
  onInputChange(value: string): void {
    const digits = value.replace(/\D/g, '').substring(0, 12);
    this.rawAadhaar.set(digits);

    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1-');
    this.aadhaarInputValue.set(formatted);

    this.resetState();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!/[0-9]|Backspace|Tab|ArrowLeft|ArrowRight/.test(event.key)) {
      event.preventDefault();
    }
  }

  /* -----------------------------
     Scan Aadhaar (Backend Call)
  ----------------------------- */
  startScan(): void {
    if (this.isScanning() || !this.isButtonEnabled()) return;

    this.isScanning.set(true);
    this.scanStatusText.set('Scanning...');

    const aadhaarNumber = this.rawAadhaar();

    this.http.get<any>(`http://localhost:8080/api/aadhaar/${aadhaarNumber}`)
      .subscribe({
        next: (response) => {
          this.isScanning.set(false);
          if (response) {
            this.handleSuccess(response);
          } else {
            this.handleFailure();
          }
        },
        error: (error) => {
          console.error('Scan Error:', error);
          this.isScanning.set(false);
          this.handleFailure();
        }
      });
  }

  /* -----------------------------
     Success Handler
  ----------------------------- */
  private handleSuccess(data: any): void {
    this.isScanned.set(true);
    this.scanResultIcon.set('✔');
    this.scanStatusText.set('Aadhaar Verified');

    this.popupName.set(data.nameEnglish || '');
    this.popupNameTamil.set(data.nameTamil || '');
    this.popupFatherNameTamil.set(data.fatherNameTamil || '');
    this.popupDob.set(data.dob || '');
    this.popupGender.set(data.gender || '');
    this.popupAadhaar.set(data.aadhaarNumber || this.aadhaarInputValue());

    // Dummy address (frontend only)
    this.popupAddress.set('123 Anna Street');
    this.popupCity.set('Chennai');
    this.popupPincode.set('600001');

    // Photo Base64
    if (data.photoBase64) {
      this.popupImg.set('data:image/jpeg;base64,' + data.photoBase64);
    } else {
      this.popupImg.set('');
    }

    this.showPopup.set(true);
  }

  /* -----------------------------
     Failure Handler
  ----------------------------- */
  private handleFailure(): void {
    this.isScanned.set(true);
    this.scanResultIcon.set('✖');
    this.scanStatusText.set('Aadhaar Not Found');
    this.showPopup.set(false);
  }

  /* -----------------------------
     Reset State
  ----------------------------- */
  resetState(): void {
    this.isScanning.set(false);
    this.isScanned.set(false);
    this.scanResultIcon.set('');
    this.scanStatusText.set('');
    this.showPopup.set(false);
    this.isFlipped.set(false);
  }

  toggleFlip(): void {
    this.isFlipped.update(value => !value);
  }

  closePopup(): void {
    this.showPopup.set(false);
    this.isFlipped.set(false);
  }
}