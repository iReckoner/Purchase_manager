import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastService } from 'src/app/services/toast.service';

export interface UserData {
  name: string;
  phone: string;
  email?: string;
}
interface PartyList {
  PartyId: number;
  // title: string;
  // image: string;
  PartyName: string;
  Address1:string;
  Address2:string;
  // active:boolean;
}

export interface GrowthData {
  monthlyGrowth: string;
  quarterlyGrowth: string;
}

export interface UserStats {
  totalOrders: number | string;
  totalSpent: number | string;
  savedAmount: number | string;
  points: number | string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileImage: string | ArrayBuffer | null = null;
  apiUrl: string = '';
  notification = {
    show: false,
    message: '',
    type: 'success' // 'success' or 'error'
  };
  isPopupOpen = false;
  partyList: any;
  userData: any = {};
  partylistdata: any[] = [];

  growthlistdata: any[] = [];
  profileForm!: FormGroup;

  growthData: GrowthData = {
    monthlyGrowth: "0",
    quarterlyGrowth: "0"
  };
  isOpen = false;
  zoom = 1;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }


  constructor(private router: Router,private authService: ApiService,private fb: FormBuilder,private sanitizer: DomSanitizer,private toast: ToastService) { }

  ngOnInit(): void {
    this.apiUrl = this.authService.getApiUrl();
    this.loadUserData();




  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.notification = {
      show: true,
      message,
      type
    };
    setTimeout(() => {
      this.notification.show = false;
    }, 3000);
  }

  loadUserData(): void {
    debugger;
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      this.userData = JSON.parse(savedData);
      this.profileForm = this.fb.group({
        name: [{ value: this.userData.ContactName || '', disabled: true }],
        email: [this.userData.Email || '', [Validators.required, Validators.email]],
        phone: [this.userData.Phone || '', [Validators.required,Validators.pattern(/^\d{10}$/)]],
        bankaccountname: [{ value: this.userData.BankName || '', disabled: true }],
        bankaccountno: [{ value: this.userData.BankAccountNo || '', disabled: true }],
        ifsccode: [{ value: this.userData.IfscCode || '', disabled: true }],
        upiid: [{ value: this.userData.UPIId || '', disabled: true }],
        designation: [{ value: this.userData.Designation || '', disabled: true }],
        department: [{ value: this.userData.Department || '', disabled: true }],
        add1:[{ value: this.userData.AddressLine1 || '', disabled: false }],
        add2:[{ value: this.userData.AddressLine2 || '', disabled: false }],
      });
    }
    const savedImage = `${this.apiUrl}/images/viewImage/Contact_${this.userData.ContactId}.PNG`;
    if (savedImage) {
      this.profileImage = savedImage;
    }
    this.getrestaurantdata(this.userData.ContactId);

    // this.gettextfile();
  }
  getrestaurantdata(ContactId:string ): void {

    this.authService.getrestrauntdata(ContactId).subscribe(
      (response) => {
        console.log('Restaurants:', response);
        this.partylistdata= response;
        this.partyList=[];
        for (let i = 0; i < this.partylistdata.length; i++) {
          const chunk :PartyList={
            PartyId: this.partylistdata[i].PartyId,
            PartyName: this.partylistdata[i].PartyName,
            Address1: this.partylistdata[i].PerAdd1,
            Address2: this.partylistdata[i].PerAdd2
          }
          this.partyList.push(chunk);
        }
        this.getgrowthpercentdata(this.userData.ContactId);
        console.log(this.partyList);
      },
      (error) => {
        console.error('Error fetching points data:', error);
      }
    );
  }
  getgrowthpercentdata(ContactId:string ): void {

    this.authService.getgrowthpercent(ContactId).subscribe(
      (response) => {
        console.log('Restaurants:', response);
        this.growthlistdata= response;
        this.growthData.monthlyGrowth=Number(response[0].Last1stMonthGrowth).toFixed(2);
        this.growthData.quarterlyGrowth=Number(response[0].AvgGrowthPercent).toFixed(2);
        console.log(this.growthlistdata);
      },
      (error) => {
        console.error('Error fetching points data:', error);
      }
    );
  }

handleImgError(event: any) {
  if (!event.target.dataset.hasError) {
    event.target.dataset.hasError = "true"; // only once
    event.target.src = 'assets/default.PNG';
  }
}

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        this.showNotification('Image size should be less than 2MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
        // In a real app, you would upload this to your server
        localStorage.setItem('profileImage', e.target.result);
        this.showNotification('Profile image updated successfully');
      };
      reader.readAsDataURL(file);
    }
  }

  editProfile(): void {
    // In a real app, you would navigate to an edit profile page or open a modal
    this.showNotification('Edit profile functionality will be implemented soon', 'error');
  }
  openpopup(){
    this.isPopupOpen=true
  }
  closePopup() {
    this.isPopupOpen = false;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const formData = this.profileForm.getRawValue();
    const existingData = localStorage.getItem('userData');
    const sessionData = existingData ? JSON.parse(existingData) : {};
    const updatedSessionData = {
      ...sessionData,          // keep old values
      Email: formData.email,
      Phone: formData.phone,
      AddressLine1: formData.add1,
      AddressLine2: formData.add2
    };
    localStorage.setItem('userData', JSON.stringify(updatedSessionData));
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      this.userData = JSON.parse(savedData);}
      console.log(this.userData);
    const payload = {
      data: {
        "ContactMaster":
          {
            ContactId:this.userData.ContactId,
            ContactName: formData.name,
            Email: formData.email,
            Phone: formData.phone,
            AddressLine1: formData.add1,
            AddressLine2: formData.add2,
            // Designation: formData.designation,
            // Department: formData.department,
            // Bio: formData.bio
          }

      }
    };
    console.log('FINAL PAYLOAD:', payload);
this.authService.UpdateMaster(payload,this.userData.ContactId).subscribe(
  (response) => {
    this.close();

  },
  (error) => {
    console.error('Error fetching points data:', error);
  }
);
  }
  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} 00:00:00`;
  }

  selectedFile!: File;

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];

    // preview image
    this.profileImage = URL.createObjectURL(this.selectedFile);
  }
 this. uploadImage(this.selectedFile);
}
uploadImage(file: File): void {
  const formData = new FormData();
  formData.append('file', file);

  const entityType = 'Contact';
  const fileName = `Contact_${this.userData.ContactId}.PNG`;

  this.authService.uploadImage(formData, 'Images', fileName).subscribe({
    next: (response: any) => {

    },
    error: (error: any) => {
      console.error('Error uploading image:', error);
    }
  });
}
isResumeModalOpen = false;

openResumeModal() {
  this.isResumeModalOpen = true;
  this.gettextfile();
  this.setZoom();
    window.addEventListener('resize', () => this.setZoom());
}

closeResumeModal() {
  this.isResumeModalOpen = false;
}

pdfUrl?: SafeResourceUrl;
pdfSrc!: string;


gettextfile(): void {
  const fileName = `Resume_${this.userData.ContactId}.pdf`;
  this.authService.getresumepdf(fileName).subscribe(
    (blob) => {

      // this.pdfSrc = blob;
      this.pdfSrc = URL.createObjectURL(blob);
      const url = URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    },
    (error) => {
      console.error('Error fetch resume:', error);
    }
  );
}
onPdfSelect(event: any) {
  const file = event.target.files[0];

  if (file && file.type === 'application/pdf') {
    const formData = new FormData();
    formData.append('file', file);
    const entityType = 'Resume';
  const fileName = `Resume_${this.userData.ContactId}.pdf`;
  this.authService.uploadpdf(formData, 'files', fileName).subscribe({
    next: (response: any) => {
      // this.gettextfile();
      this.closeResumeModal();
      // this.showNotification('Uploaded Successfully', 'success');
      this.toast.showSuccess('Uploaded Successfully \ud83c\udf89');

    },
    error: (error: any) => {
      this.toast.showError('Failed to upload pdf \u274c');
      console.error('Error uploading image:', error);
    }
  });

  }
}
 deletepdf(){
  const fileName = `Resume_${this.userData.ContactId}.pdf`;
  this.authService.deletepdf(fileName).subscribe(
    (response) => {
      this.closeResumeModal();
      // this.showNotification('Deleted Successfully', 'success');
      this.toast.showError(' Deleted Successfully \u274c');
      this.pdfSrc='';
      // this.gettextfile();
    },
    (error) => {
      this.toast.showError('Failed to delete pdf \u274c');
      console.error('Error deleting pdf:', error);
    }
  );
}

setZoom() {
  const width = window.innerWidth;

  if (width <= 768) {
    // 📱 Mobile
    this.zoom = 0.8;
  } else if (width <= 1024) {
    // 📱 Tablet
    this.zoom =  0.8;
  } else {
    // 🖥️ Desktop
    this.zoom = 0.9;
  }
}

 }


