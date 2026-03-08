import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './design-system/organsimes/footer-component/footer-component';
import { HeaderComponent } from './design-system/organsimes/header-component/header-component';
import { LoaderComponent } from './design-system/organsimes/loader-component/loader-component';
import { LoaderService } from './shared/services/domain/loader-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly loaderService = inject(LoaderService);

  readonly loading = this.loaderService.getLoading();
}
