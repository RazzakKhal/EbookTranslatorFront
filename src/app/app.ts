import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './design-system/organsimes/loader-component/loader-component';
import { LoaderService } from './shared/services/domain/loader-service';
import { AuthService } from './shared/services/domain/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('EbookTranslator');

  private readonly loaderService = inject(LoaderService);
  private readonly authService = inject(AuthService);

  readonly loading = this.loaderService.getLoading();
  readonly authenticated = this.authService.authenticated;

  async onLogin(): Promise<void> {
    await this.authService.login();
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }
}
