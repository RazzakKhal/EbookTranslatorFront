import { Component, signal } from '@angular/core';
import { PInputComponent } from '../../../../design-system/atoms/pinput-component/pinput-component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-translator-main-page',
  imports: [PInputComponent, SlicePipe],
  templateUrl: './translator-main-page.html',
  styleUrl: './translator-main-page.css',
})
export class TranslatorMainPage {
  readonly file = signal<File | null>(null);

  onFileSelected(file: File | null) {
    this.file.set(file);
  }
}
