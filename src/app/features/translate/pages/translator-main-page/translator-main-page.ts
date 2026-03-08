import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { finalize } from 'rxjs';
import { TranslateService } from '../../../../shared/services/api/translate-service';

@Component({
  selector: 'app-translator-main-page',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './translator-main-page.html',
  styleUrl: './translator-main-page.css',
})
export class TranslatorMainPage {
  private readonly translateService = inject(TranslateService);

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  readonly file = signal<File | null>(null);
  readonly isDragActive = signal(false);
  readonly isSubmitting = signal(false);
  readonly requestMessage = signal<string | null>(null);
  readonly requestError = signal<string | null>(null);
  readonly epubType = 'application/epub+zip';

  readonly validationMessage = computed(() => {
    const file = this.file();

    if (!file) {
      return null;
    }

    const isEpubMimeType = file.type === '' || file.type === this.epubType;
    const hasEpubExtension = file.name.toLowerCase().endsWith('.epub');

    if (isEpubMimeType && hasEpubExtension) {
      return null;
    }

    return 'Seuls les fichiers EPUB sont acceptes pour la traduction.';
  });

  readonly hasValidFile = computed(() => !!this.file() && !this.validationMessage());

  readonly fileSizeLabel = computed(() => {
    const file = this.file();
    return file ? this.formatBytes(file.size) : null;
  });

  readonly ctaLabel = computed(() => {
    if (this.isSubmitting()) {
      return 'Traduction en cours...';
    }

    return this.file() ? 'Remplacer le fichier' : 'Choisir un fichier EPUB';
  });

  openFilePicker() {
    this.fileInput().nativeElement.click();
  }

  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.setSelectedFile(input.files?.[0] ?? null);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragActive.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragActive.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragActive.set(false);

    const droppedFile = event.dataTransfer?.files?.item(0) ?? null;
    this.setSelectedFile(droppedFile);
  }

  clearFile() {
    this.file.set(null);
    this.requestMessage.set(null);
    this.requestError.set(null);
    this.fileInput().nativeElement.value = '';
  }

  onSubmit() {
    const file = this.file();

    if (!file || this.validationMessage()) {
      return;
    }

    const formData = new FormData();
    formData.append('ebook', file);

    this.isSubmitting.set(true);
    this.requestMessage.set(null);
    this.requestError.set(null);

    this.translateService
      .translateEbook(formData)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.requestMessage.set(
            'Votre fichier a ete envoye. La traduction a ete lancee.',
          );
        },
        error: () => {
          this.requestError.set(
            "L'envoi a echoue. Verifiez le fichier et reessayez.",
          );
        },
      });
  }

  private setSelectedFile(file: File | null) {
    this.file.set(file);
    this.requestMessage.set(null);
    this.requestError.set(null);
  }

  private formatBytes(bytes: number) {
    if (bytes === 0) {
      return '0 octet';
    }

    const units = ['octets', 'Ko', 'Mo', 'Go'];
    const unitIndex = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    );
    const value = bytes / 1024 ** unitIndex;

    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }
}
