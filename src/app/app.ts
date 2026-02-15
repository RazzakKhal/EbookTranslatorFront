import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './design-system/organsimes/loader-component/loader-component';
import { LoaderService } from './shared/services/domain/loader-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('EbookTranslator');

  private readonly loaderService = inject(LoaderService);

  readonly loading = this.loaderService.getLoading();
}
