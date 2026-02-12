import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly isLoading = computed(() => this.pendingCount() > 0);
  private readonly pendingCount = signal<number>(0);

  getLoading() {
    return this.isLoading();
  }

  addPending() {
    this.pendingCount.set(this.pendingCount() + 1);
  }

  removePending() {
    this.pendingCount.set(this.pendingCount() - 1);
  }
}
