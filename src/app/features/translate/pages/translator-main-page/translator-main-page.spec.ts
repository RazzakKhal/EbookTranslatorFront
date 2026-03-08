import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { TranslatorMainPage } from './translator-main-page';
import { TranslateService } from '../../../../shared/services/api/translate-service';

describe('TranslatorMainPage', () => {
  let component: TranslatorMainPage;
  let fixture: ComponentFixture<TranslatorMainPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatorMainPage],
      providers: [
        provideRouter([]),
        {
          provide: TranslateService,
          useValue: {
            translateEbook: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TranslatorMainPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
