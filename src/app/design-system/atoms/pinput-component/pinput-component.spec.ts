import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PInputComponent } from './pinput-component';

describe('PInputComponent', () => {
  let component: PInputComponent;
  let fixture: ComponentFixture<PInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PInputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
