import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SignUpForm } from '../../../models/signUpForm.model';
import { take } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private readonly http = inject(HttpClient);
  private readonly mainUrl = `${environment.apiUrl}/sign-up`;

  postSignUpForm(signUpForm: SignUpForm) {
    return this.http.post(this.mainUrl, signUpForm).pipe(take(1));
  }
}
