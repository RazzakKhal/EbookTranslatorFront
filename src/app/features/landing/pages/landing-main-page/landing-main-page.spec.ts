import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingMainPage } from './landing-main-page';

describe('LandingMainPage', () => {
  let component: LandingMainPage;
  let fixture: ComponentFixture<LandingMainPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingMainPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingMainPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
