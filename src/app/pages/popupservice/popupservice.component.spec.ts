import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupserviceComponent } from './popupservice.component';

describe('PopupserviceComponent', () => {
  let component: PopupserviceComponent;
  let fixture: ComponentFixture<PopupserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupserviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
