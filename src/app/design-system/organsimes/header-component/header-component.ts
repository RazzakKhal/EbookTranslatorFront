import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/domain/auth-service';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly menuToggleButton = viewChild<ElementRef<HTMLButtonElement>>('menuToggleButton');
  private readonly mobileMenuCloseButton =
    viewChild<ElementRef<HTMLButtonElement>>('mobileMenuCloseButton');

  readonly isMobileMenuOpen = signal(false);
  readonly authenticated = this.authService.authenticated;

  openMobileMenu(): void {
    this.isMobileMenuOpen.set(true);
    setTimeout(() => this.mobileMenuCloseButton()?.nativeElement.focus());
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    setTimeout(() => this.menuToggleButton()?.nativeElement.focus());
  }

  async onAuthAction(): Promise<void> {
    if (this.authenticated()) {
      await this.authService.logout();
      return;
    }

    await this.authService.login();
  }

  async onMobileAuthAction(): Promise<void> {
    this.closeMobileMenu();
    await this.onAuthAction();
  }
}
