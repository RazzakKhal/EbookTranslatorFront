import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PInputComponent } from '../../../../design-system/atoms/pinput-component/pinput-component';
import { SlicePipe } from '@angular/common';
import { TranslateService } from '../../../../shared/services/api/translate-service';

@Component({
  selector: 'app-translator-main-page',
  imports: [PInputComponent, SlicePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './translator-main-page.html',
  styleUrl: './translator-main-page.css',
})
export class TranslatorMainPage {
  private readonly translateService = inject(TranslateService);

  readonly file = signal<File | null>(null);
  readonly epubType = 'application/epub+zip';

  onFileSelected(file: File | null) {
    this.file.set(file);
  }

  onSubmit() {
    if (this.file() && this.file()?.type === this.epubType) {
      const formData = new FormData();
      formData.append('ebook', this.file() as Blob);
      this.translateService.translateEbook(formData).subscribe();
    }
  }
}
