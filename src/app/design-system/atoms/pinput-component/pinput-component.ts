import { ChangeDetectionStrategy, Component, input, Input, output } from '@angular/core';

@Component({
  selector: 'p-input',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pinput-component.html',
  styleUrl: './pinput-component.css',
})
export class PInputComponent {
  readonly type = input.required<string>();
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly accept = input.required<string>();

  readonly fileSelected = output<File | null>();

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.fileSelected.emit(file);
  }
}
