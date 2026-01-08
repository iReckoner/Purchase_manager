import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appSwipe]',
  standalone: true
})
export class SwipeDirective {

  @Output() swipeLeft = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();

  private startX = 0;
  private threshold = 40;

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    this.startX = event.clientX;
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent) {
    const deltaX = event.clientX - this.startX;

    if (deltaX > this.threshold) {
      this.swipeRight.emit();
    } else if (deltaX < -this.threshold) {
      this.swipeLeft.emit();
    }
  }
}
