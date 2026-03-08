import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  private readonly menuToggleButton = viewChild<ElementRef<HTMLButtonElement>>('menuToggleButton');
  private readonly mobileMenuCloseButton =
    viewChild<ElementRef<HTMLButtonElement>>('mobileMenuCloseButton');

  readonly isMobileMenuOpen = signal(false);

  openMobileMenu(): void {
    this.isMobileMenuOpen.set(true);
    setTimeout(() => this.mobileMenuCloseButton()?.nativeElement.focus());
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    setTimeout(() => this.menuToggleButton()?.nativeElement.focus());
  }
}
