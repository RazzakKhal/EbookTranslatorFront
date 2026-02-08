import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private readonly http = inject(HttpClient);

  public translateEbook(form: FormData) {
    return this.http.post(`${environment.apiUrl}/translate-service/translate`, form);
  }
}
