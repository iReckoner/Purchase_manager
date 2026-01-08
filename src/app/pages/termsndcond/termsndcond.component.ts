import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { PdfService } from './pdf.service';

@Component({
  selector: 'app-termsndcond',
  templateUrl: './termsndcond.component.html',
  styleUrls: ['./termsndcond.component.css']
})
// @NgModule({
//   imports: [PdfViewerModule]
// })


export class TermsndcondComponent {
  apiUrl: string = '';
  textContent = '';
  pdfUrl?: SafeResourceUrl;
  pdfSrc!: string;
  pdfData?: Blob;
  zoom = 1;
  constructor(private authService: ApiService,
    private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    this.setZoom();
    window.addEventListener('resize', () => this.setZoom());
    this.apiUrl = this.authService.getApiUrl();
    this.gettextfile();
  }
  gettextfile(): void {
    this.authService.gettextfile().subscribe(

      (blob) => {

        this.pdfSrc = URL.createObjectURL(blob);
        const url = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        // const arrayBuffer =  blob.arrayBuffer();
        // this.pdfData = new Uint8Array(arrayBuffer);
        // window.open(url, '_blank');

      },
      (error) => {
        console.error('Error fetching points data:', error);
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
      this.zoom = 1;
    } else {
      // 🖥️ Desktop
      this.zoom = 0.8;
    }
  }

}
