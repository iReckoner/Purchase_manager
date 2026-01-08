import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface superchamp {
  id: number;
  title: string;
  image: string;
  name: string;
  active:boolean;
}

@Component({
  selector: 'app-superchamp',
  templateUrl: './superchamp.component.html',
  styleUrls: ['./superchamp.component.css']
})
export class SuperchampComponent implements OnInit, OnDestroy {
  currentIndex: number = 0;
  private autoSlideInterval: any;
  champs: any[] = [];
  apiUrl: string = '';
  superchampData: any;
  superchamp: any[] = [];
  imagesLoaded = 0;


  constructor(private authService: ApiService) {}

  ngOnInit(): void {

    this.apiUrl = this.authService.getApiUrl();
    // this.champs = [
    //   {
    //     id: 1,
    //     image: `https://ascomp.salesxceed.com:5000/api/images/viewImage/Contact_1.PNG`,
    //     // image: `${this.apiUrl}/images/getImages/manger.png`,
    //     title: 'CHAMPURCHASER',
    //     name: 'Pawan Kumar',
    //     active: true
    //   },
    //   {
    //     id: 2,
    //     image: `https://ascomp.salesxceed.com:5000/api/images/viewImage/Contact_3.PNG`,
    //     title: 'GROWTH HACKER',
    //     name: 'Deep Banerjee',
    //     active: false
    //   },
    //   {
    //     id: 3,
    //     image: `${this.apiUrl}/images/getImages/manager3.png`,
    //     title: 'SKU ROCKSTAR',
    //     name: 'Lalit Malhan',
    //     active: false
    //   },
    //   {
    //     id: 4,
    //     image: `${this.apiUrl}/images/getImages/manager4.png`,
    //     title: 'KING PAYMASTER',
    //     name: 'Siraj Khan',
    //     active: false
    //   }
    // ]
     this.loadsuperchampdata();
  }
  loadsuperchampdata(): void {
    this.authService.geteventsdata('SuperChamp').subscribe(
      (response) => {
        console.log('superchamp:', response);
        this.superchampData = response[0].data;
         this.champs=[];// Reset

        for (let i = 0; i < this.superchampData.length; i++) {
          const chunk :superchamp={
            // id: this.superchampData[i].Id,
            id:i+1,
            // image: `${this.apiUrl}/images/getImages/manager3.png`,

            image: `${this.apiUrl}/images/viewImage/Contact_${this.superchampData[i].ContactId}.PNG`,
            // image: `https://ascomp.salesxceed.com:5000/api/images/viewImage/${this.superchampData[i].tab}_${this.superchampData[i].tabId}.PNG`,
            name: this.superchampData[i].ContactName,
            title: this.superchampData[i].Hall_of_fame_name,
            active: i === 0
          }
          this.champs.push(chunk);
        }
         console.log(this.champs);
         setTimeout(() => {
          this.startAutoSlide();
        }, 300);
        // this.carouselSections.push({
        //     currentIndex: 0,
        //     items:this.allevents
        //   });
      },
      (error) => {
        console.error('Error fetching points data:', error);
      }
    );
    this.startAutoSlide();
  }
  handleImgError(event: any) {
    if (!event.target.dataset.hasError) {
      event.target.dataset.hasError = "true"; // only once
      event.target.src = 'assets/default.PNG';
    }
  }



onImageLoad() {
  this.imagesLoaded++;

  if (this.imagesLoaded === this.champs.length) {
    // All images have loaded → now initialize carousel positions
    setTimeout(() => {
      this.initializeCarousel();
    }, 50);
  }
}
initializeCarousel() {
  this.currentIndex = 0;
  this.champs = this.champs.map((c, i) => ({
    ...c,
    active: i === 0
  }));
}
  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(intervalMs: number = 10000): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, intervalMs);
    // Ensure we're at the first slide when starting
    if (this.currentIndex >= this.champs.length) {
      this.goToSlide(0);
    }
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  nextSlide(): void {
    // Deactivate current card
    this.champs[this.currentIndex].active = false;

    // Move to next card or loop back to first
    if (this.currentIndex >= this.champs.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }

    // Activate new card
    this.champs[this.currentIndex].active = true;

    // Force change detection
    this.champs = [...this.champs];
  }

  prevSlide(): void {
    // Deactivate current card
    this.champs[this.currentIndex].active = false;

    // Move to previous card or loop to last
    this.currentIndex = (this.currentIndex - 1 + this.champs.length) % this.champs.length;

    // Activate new card
    this.champs[this.currentIndex].active = true;
  }

  goToSlide(index: number): void {
    // Validate index
    if (index < 0 || index >= this.champs.length) {
      return;
    }

    // Deactivate current card if exists
    if (this.champs[this.currentIndex]) {
      this.champs[this.currentIndex].active = false;
    }

    // Set new index and activate that card
    this.currentIndex = index;
    this.champs[this.currentIndex].active = true;

    // Force change detection
    this.champs = [...this.champs];
  }
  // private startX = 0;
  // private startY = 0;
  // private threshold = 40; // minimum distance in px for swipe

  // onPointerDown(event: PointerEvent) {
  //   this.startX = event.clientX;
  //   this.startY = event.clientY;
  // }

  // onPointerUp(event: PointerEvent) {
  //   const deltaX = event.clientX - this.startX;
  //   const deltaY = Math.abs(event.clientY - this.startY);

  //   // Ignore mostly vertical movement
  //   if (deltaY > 50) return;

  //   if (deltaX > this.threshold) {
  //     this.onSwipeRight();
  //   } else if (deltaX < -this.threshold) {
  //     this.onSwipeLeft();
  //   }
  //   const target = event.target as HTMLElement;
  // if (target.hasPointerCapture(event.pointerId)) {
  //   target.releasePointerCapture(event.pointerId);
  // }
  // // this.isDragging = false;
  // }

  private startX = 0;
private startY = 0;
private threshold = 40;
private isDragging = false;
private isScrolling = false;

onPointerDown(event: PointerEvent) {
  this.startX = event.clientX;
  this.startY = event.clientY;
  this.isDragging = true;
  this.isScrolling = false;

  (event.target as HTMLElement).setPointerCapture(event.pointerId);
}

onPointerMove(event: PointerEvent) {
  if (!this.isDragging) return;

  const deltaX = Math.abs(event.clientX - this.startX);
  const deltaY = Math.abs(event.clientY - this.startY);

  // ✅ Detect vertical scroll EARLY
  if (deltaY > deltaX && deltaY > 10) {
    this.isScrolling = true;
  }
}

onPointerUp(event: PointerEvent) {
  if (!this.isDragging) return;

  // ✅ Cancel swipe if scrolling occurred
  if (this.isScrolling) {
    this.cleanup(event);
    return;
  }

  const deltaX = event.clientX - this.startX;

  // ✅ Ignore taps & double-taps
  if (Math.abs(deltaX) < this.threshold) {
    this.cleanup(event);
    return;
  }

  if (deltaX > 0) {
    this.onSwipeRight();
  } else {
    this.onSwipeLeft();
  }

  this.cleanup(event);
}

private cleanup(event: PointerEvent) {
  const el = event.target as HTMLElement;
  if (el.hasPointerCapture(event.pointerId)) {
    el.releasePointerCapture(event.pointerId);
  }
  this.isDragging = false;
  this.isScrolling = false;
}


  onSwipeLeft() {
   this.nextSlide();
  }

  onSwipeRight() {
   this.prevSlide();
  }
  // trackById(index: number, item: superchamp) {
  //   return item.id;
  // }
}
