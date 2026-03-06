import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadhaarComponent } from './aadhaar';

describe('AadhaarComponent', () => {
  let component: AadhaarComponent;
  let fixture: ComponentFixture<AadhaarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AadhaarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AadhaarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
