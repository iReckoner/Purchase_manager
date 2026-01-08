import { Component, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // optional, if you want extra styling
})
export class LoginComponent implements OnDestroy {
  // 🔹 Properties for ngModel binding
  showForm = false;
  mobile: string = '';
  otp: string = '';

  // OTP related properties
  isOtpSent = false;
  isResendDisabled = false;
  countdown = 0;
  visitorId: string="";
  hardReload: boolean = false;
  private countdownSubscription: Subscription | null = null;
  @Input() message: string = '';
  @Input() showerror: boolean = false;

  @Output() confirm = new EventEmitter<boolean>();



  constructor(private authService: ApiService,private router: Router,private toast: ToastService) {}
  ngOnInit(): void {
    debugger;
    if (!sessionStorage.getItem('cacheCleared')) {

      // Mark it so we don't do it again after reload
      sessionStorage.setItem('cacheCleared', 'true');

      // Clear browser caches
      if ('caches' in window) {
        caches.keys().then(names => names.forEach(name => caches.delete(name)));
      }

      // Clear IndexedDB
      indexedDB.databases().then(dbs => {
        dbs.forEach(db => indexedDB.deleteDatabase(db.name!));
      });

      // Now reload the page (hard refresh)
      window.location.reload();
    }
    this.generateFingerprint();
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      //  this.formData.email = savedEmail;
       this.mobile=savedEmail;
    }
  }
  // async generateFingerprint(): Promise<void> {
  //   // Initialize the agent at application startup.
  //   debugger;
  //   const fp = await FingerprintJS.load();

  //   // Get the visitor identifier when you need it.
  //   const result = await fp.get();

  //   // The visitor identifier:
  //   this.visitorId = result.visitorId;
  //   sessionStorage.setItem("VisitorId", this.visitorId);
  //   console.log(this.visitorId);
  // }
  async generateFingerprint(): Promise<void> {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    // this.visitorId = result.visitorId; // works if `this` is correct
    sessionStorage.setItem("VisitorId", result.visitorId);
    // console.log(this.visitorId);
  }


  // 🔹 Methods for button clicks
  getOtp() {
    if (!this.mobile) {
      this.toast.showError('Please enter a mobile number');
      return;
    }

    console.log('OTP requested for:', this.mobile);
    this.authService.sendOtp(this.mobile).subscribe({
      next: (res) => {
        this.isOtpSent = true;
        this.startCountdown();
        this.toast.showSuccess('OTP sent successfully \ud83c\udf89');
      },
      error: (err) => {
        console.error('Error sending OTP:', err);
        this.toast.showError('Failed to send OTP \u274c');
      }
    });
  }

  resendOtp() {
    if (this.isResendDisabled) return;

    this.authService.sendOtp(this.mobile).subscribe({
      next: (res) => {
        this.startCountdown();
        this.toast.showSuccess('OTP resent successfully \ud83c\udf89');
      },
      error: (err) => {
        console.error('Error resending OTP:', err);
        this.toast.showError('Failed to resend OTP \u274c');
      }
    });
  }

  private startCountdown() {
    this.isResendDisabled = true;
    this.countdown = 30; // 30 seconds countdown

    // Clear any existing countdown
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    this.countdownSubscription = interval(1000).pipe(
      takeWhile(() => this.countdown > 0)
    ).subscribe(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.isResendDisabled = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }


  onYes() {
    this.confirm.emit(true);
    this.showerror = false;
    this.hardReload=true;
     this.getOtp();
  }

  onNo() {
    this.confirm.emit(false);
    this.showerror = false;
  }
  onPopupConfirm(confirmed: boolean) {
    this.showerror = false;

    if (confirmed) {
      this.hardReload = true;
      this.getOtp();
    }
  }
  newsubmitOtp( hardlogin:boolean) {
    console.log('OTP submitted:', this.otp);
    const visitorId=sessionStorage.getItem("VisitorId");
    this.authService.verifyOtp1(this.mobile, this.otp,visitorId,hardlogin).subscribe({
      next: (res) => {
        debugger;
        if (res.hasOwnProperty("error")) {
          // alert(res.error);
          this.toast.showError(res.error);
          return;
        }
        // this.hardReload=true;
        // this.getOtp();
        console.log('OTP verified successfully:', res);

        localStorage.setItem('accessToken',JSON.stringify(res.data['Token']));
        localStorage.setItem("userData", JSON.stringify(res.data))
        localStorage.setItem('savedEmail', res.data['Email']);
        this.router.navigate(['/app/home'], { replaceUrl: true });
      },
      error: (error) => {
        debugger;

        // if (error.error.message == 'User machine is not register, validate OTP' || error.error.message == 'You are already logged in on another device. Do you want to proceed?' || error.error.message == 'Session is expired, login with OTP') {
        //   const userConfirmed = confirm(
        //     error.error.message
        //   );
        //   if (userConfirmed) {
        //     this.hardReload = true;
        //    this.getOtp();

        //   } else {
        //     // User clicked Cancel — do nothing
        //   }
        // }else{
        //   this.hardReload = true;
        //   this.getOtp();
        //   this.toast.showError(error.error.message);
        // }
        const message = error.error.message;

        if (
          message === 'User machine is not register, validate OTP' ||
          message === 'You are already logged in on another device. Do you want to proceed?' ||
          message === 'Session is expired, login with OTP'
        ) {
          this.message = message;
          this.showerror = true;
        } else {
          this.showerror = true;
          // this.hardReload = true;
          // this.getOtp();
          this.message = message;
          // this.toast.showError(message);
        }

      }
    });



    // this.router.navigate(['/superchamp']);
    // TODO: Call API to verify OTP
  }

  submitOtp() {
    console.log('OTP submitted:', this.otp);
    this.authService.verifyOtp(this.mobile, this.otp).subscribe({
      next: (res) => {
        // console.log('OTP verified successfully:', res);
        this.toast.showSuccess('Login successful! 🎉');
        localStorage.setItem("userData", JSON.stringify(res.data))
        this.router.navigate(['/app/home'], { replaceUrl: true });
      },
      error: (err) => {
        console.error('Error verifying OTP:', err);
        this.toast.showError('Invalid OTP ❌');
        // alert('Invalid OTP');
      }
    });



    // this.router.navigate(['/superchamp']);
    // TODO: Call API to verify OTP
  }
}
