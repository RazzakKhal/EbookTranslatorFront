import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpMainPage } from './sign-up-main-page';

describe('SignUpMainPage', () => {
  let component: SignUpMainPage;
  let fixture: ComponentFixture<SignUpMainPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpMainPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpMainPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
