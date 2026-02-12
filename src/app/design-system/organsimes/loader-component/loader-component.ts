import { Component } from '@angular/core';

@Component({
  selector: 'p-loader',
  imports: [],
  templateUrl: './loader-component.html',
  styleUrl: './loader-component.css',
})
export class LoaderComponent {
  readonly loaderMessage = 'Chargement...';
}
