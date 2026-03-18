import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ApiService } from '../../services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  EmpName: string = '';
  CompanyId: string = '';
  EmployeeId: string = '';
  DocNo: string = '';
  DocSlNO: string = '';
  Buttontxt: string = 'Check in';
  alldetails: any[] = [];
  upcomingholiday: any[] = [];
  locationMessage: string = "Location not fetched";
  _latitude: string = '';
  _longitude: string = '';
  recentattendance: any[] = [];
  activeTab = 'Attendance';
  isLoadingRecent: boolean = true;
  recentError: string = '';

  presentDates: Date[] = [];
  absentDates: Date[] = [];
  LateDates: Date[] = [];
  UnapproveLeave: Date[] = [];
  UpcomingHoliday: Date[] = [];

  constructor(private apiService: ApiService, private toast: ToastService, private router: Router) { }

  ngOnInit(): void {
    this.getInfo();
    this.Lateattendancedata();
  }

  getInfo(): void {
    const data: any = localStorage.getItem('userData');
    if (data) {
      const userData = JSON.parse(data);
      this.EmpName = userData.ContactName || userData.EmpName;
      this.EmployeeId = userData.ContactId || userData.Empid;
      this.CompanyId = userData.CompanyId || '00000093'; // Fallback
    }
  }

  Lateattendancedata(): void {
    this.isLoadingRecent = true;
    const queryName = "mobile/getattendancelatedata";
    this.apiService.getdata(this.EmployeeId, queryName).subscribe(
      (response: any) => {
        if (response && response[0] && response[0].data && response[0].data.length > 0) {
          this.recentattendance = response[0].data;
        } else {
          const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
          this.recentattendance = [{
            CurrentMonthYear: currentMonthYear,
            PunchDate: '2026-01-01T00:00:00.000Z',
            LateByMinutes: 0,
            LateByFormatted: '0 mins'
          }];
        }
        this.isLoadingRecent = false;
      },
      (error) => {
        this.recentError = error.message;
        this.isLoadingRecent = false;
      }
    );
  }

  async _getCurrentLocation() {
    try {
      const permissions = await Geolocation.checkPermissions();
      if (permissions.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          this.locationMessage = "Location permission denied.";
          return;
        }
      }

      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      this.locationMessage = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
      this._latitude = position.coords.latitude.toString();
      this._longitude = position.coords.longitude.toString();
    } catch (e) {
      this.locationMessage = "Error getting location";
      console.error(e);
    }
  }

  fetchAttendanceData(start: Date, end: Date): void {
    const queryName = 'mobile/getAttendanceData';
    // This payload needs to match what your ApiService expects
    const payload = {
      EmployeeId: this.EmployeeId,
      CompanyId: this.CompanyId,
      start: start,
      end: end
    };

    // Using payload as per review feedback
    // Simulating call for now, adapt to actual API
    this.apiService.getdata(this.EmployeeId, queryName).subscribe(
      (response: any) => {
        if (response && response[0] && response[0].data && response[0].data.length > 0) {
          this.alldetails = response[0].data;
          this.upcomingholiday = response[1]?.data || [];

          this.presentDates = this.alldetails.filter(item => item.Nature === 'Present').map(item => new Date(item.SelectedDocDate));
          this.absentDates = this.alldetails.filter(item => item.Nature === 'Absent').map(item => new Date(item.SelectedDocDate));
          this.LateDates = this.alldetails.filter(item => item.Nature === 'Late').map(item => new Date(item.SelectedDocDate));
          this.UnapproveLeave = this.alldetails.filter(item => item.Nature === 'UnApproveleave').map(item => new Date(item.SelectedDocDate));
          this.UpcomingHoliday = this.upcomingholiday.map(item => new Date(item.Date));
        }
      },
      (error) => {
        console.error('Error fetching attendance data:', error);
      }
    );
  }

  async _saveattendance(type: string) {
    await this._getCurrentLocation();

    if (!this._latitude || !this._longitude) {
      this.toast.showError("Please Enable Your Location");
      return;
    }

    const now = new Date();
    const curdate = now.toISOString().split('T')[0];
    const formattedTime = now.toTimeString().split(' ')[0];

    // Simulate getting device ID, you might need a plugin for this in Capacitor
    const deviceid = 'capacitor-device';

    const payload = {
      datasetSave: {
        header: [{
          companyId: this.CompanyId,
          employeeId: this.EmployeeId,
          punchTime: `${curdate} ${formattedTime}`,
          deviceId: deviceid,
          in_out: type,
          devicetype: 'Mobile',
          longitude: this._longitude,
          latitude: this._latitude
        }]
      }
    };

    const queryName = 'mobile/employeepost';
    // Note: Use appropriate post method from ApiService
    this.apiService.UpdateMaster(payload, this.EmployeeId).subscribe(
      (response: any) => {
        this.toast.showSuccess(response.message || "Attendance saved");
      },
      (error: any) => {
        this.toast.showError(error.message || "Error saving attendance");
      }
    );
  }

  getFirstSaturdayOfMonth(year: number, month: number): Date {
    const date = new Date(year, month, 1);
    while (date.getDay() !== 6) { // 6 = Saturday
      date.setDate(date.getDate() + 1);
    }
    return date;
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  onViewChanged(args: any) {
    const start = args.startDate;
    const end = args.endDate;
    this.fetchAttendanceData(start, end);
  }

  navigateToReport() {
    this.router.navigate(['/app/attendancereport']);
  }

  customDates(args: any) {
    const date = args.date;
    const isPresent = this.presentDates.some(d => this.isSameDate(d, date));
    const isAbsent = this.absentDates.some(d => this.isSameDate(d, date));
    const isLate = this.LateDates.some(d => this.isSameDate(d, date));
    const isUnapprove = this.UnapproveLeave.some(d => this.isSameDate(d, date));
    const isUpcoming = this.UpcomingHoliday.some(d => this.isSameDate(d, date));
    const today = new Date();
    const isToday = this.isSameDate(date, today);

    let bgColor = '';

    if (isPresent) bgColor = '#dcfce7'; // bg-green-100
    else if (isAbsent) bgColor = '#fee2e2'; // bg-red-100
    else if (isLate || isUnapprove) bgColor = '#fee2e2'; // bg-red-100
    else if (isUpcoming) bgColor = '#f3e8ff'; // bg-purple-100

    if (bgColor) {
      args.element.style.backgroundColor = bgColor;
      args.element.style.borderRadius = '50%';
    }
  }
}
