import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-popupservice',
  templateUrl: './popupservice.component.html',
  styleUrls: ['./popupservice.component.css']
})
export class PopupserviceComponent {
  private popupState = new BehaviorSubject<{
    show: boolean;
    message: string;
  }>({ show: false, message: '' });

  popup$ = this.popupState.asObservable();

  open(message: string) {
    this.popupState.next({ show: true, message });
  }

  close() {
    this.popupState.next({ show: false, message: '' });
  }

}
