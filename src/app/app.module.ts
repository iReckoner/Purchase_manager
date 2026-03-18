import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SuperchampComponent } from './pages/superchamp/superchamp.component';
import { EventsComponent } from './pages/events/events.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { NewHotComponent } from './pages/new-hot/new-hot.component';
import { ToastComponent } from './pages/toast/toast.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HashLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TermsndcondComponent } from './pages/termsndcond/termsndcond.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PopupserviceComponent } from './pages/popupservice/popupservice.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { CalendarModule } from '@syncfusion/ej2-angular-calendars';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ToastrModule } from 'ngx-toastr';
// import { EventsComponent } from './pages/events/events.component';
// import { AppShellComponent } from './layouts/app-shell/app-shell.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SuperchampComponent,
    LayoutComponent,
    NewHotComponent,
    ToastComponent,
    NotFoundComponent,
    HomeComponent,
    ProfileComponent,
    TermsndcondComponent,
    ContactUsComponent,
    PopupserviceComponent,
    AttendanceComponent

  ],
  imports: [
    PdfViewerModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    CommonModule,
    CalendarModule
    // Swiper modules are now registered globally
    // Add SwiperModule to imports array
    // SwiperModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
 // Add this line to support custom elements like swiper
})
export class AppModule { }
