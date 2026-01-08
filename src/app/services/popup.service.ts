import { Component, EventEmitter, Output } from '@angular/core';
import { PopupserviceComponent } from '../pages/popupservice/popupservice.component';
@Component({
  selector: 'app-confirm-popup',
  templateUrl: './popup.service.ts',
  styleUrls: ['./popup.service.ts']
})
export class ConfirmPopupComponent {

  show = false;
  message = '';

  @Output() confirm = new EventEmitter<boolean>();

  constructor(private popupService: PopupserviceComponent) {
    this.popupService.popup$.subscribe(state => {
      this.show = state.show;
      this.message = state.message;
    });
  }

  onYes() {
    this.confirm.emit(true);
    this.popupService.close();
  }

  onNo() {
    this.confirm.emit(false);
    this.popupService.close();
  }
}
// export { PopupService };

