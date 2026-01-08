import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ApiService } from 'src/app/services/api.service';
interface Notification {
  id: number;
  title: string;
  message: string;

}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isSidebarOpen = false;
  // notifications: Notification[] = [];
  isNotificationPanelOpen = false;
  userData: any = {};
  notifications: Notification[]
  = [
    // { id: 1, title: 'New Message', message: 'You have received a new message from John.' },
    // { id: 2, title: 'Server Update', message: 'Server will be down for maintenance at 10 PM.' },
    // { id: 3, title: 'Reminder', message: 'Don’t forget your meeting at 3 PM today.' },
    // { id: 4, title: 'Promotion', message: 'Check out our new promotions for this week!' },
    // { id: 4, title: 'Alert', message: 'Your password will expire in 3 days.' }
  ];

  @ViewChild('notificationPanel') notificationPanel!: ElementRef
  @ViewChild('notificationButton') notificationButton!: ElementRef;
  constructor(private authService: ApiService) {}
  // Show a new notification
  toggleNotificationPanel() {
    this.isNotificationPanelOpen = !this.isNotificationPanelOpen;
    this.loadnotificationData();

  }
  loadnotificationData( ): void {
    let QueryId='Notification_pm';
    const data:any = localStorage.getItem('userData');
    this.userData = JSON.parse(data);
    this.authService.getdata(this.userData.ContactId,QueryId).subscribe(
      (response) => {
        debugger;
        console.log('notification:', response);
        this.notifications = response[0].data.map((item: any, index: number) => ({
          id: index + 1,
          title: item.activity_type,
          message: item.msg,
          date: item.event_date
        }));

      },
      (error) => {
        console.error('Error fetching Notification:', error);
      }
    );
  }
  closeNotificationPanel() {
    this.isNotificationPanelOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  // Close menus when clicking outside
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Click handler for closing sidebar when clicking outside
  }

  // Close menus when pressing Escape key
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler() {
    this.isSidebarOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!this.notificationPanel || !this.notificationButton) return;

    const clickedInsidePanel = this.notificationPanel.nativeElement.contains(target);
    const clickedButton = this.notificationButton.nativeElement.contains(target);

    if (!clickedInsidePanel && !clickedButton) {
      this.isNotificationPanelOpen = false;
    }
  }
}

