import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorMainPage } from './translator-main-page';

describe('TranslatorMainPage', () => {
  let component: TranslatorMainPage;
  let fixture: ComponentFixture<TranslatorMainPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatorMainPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslatorMainPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
