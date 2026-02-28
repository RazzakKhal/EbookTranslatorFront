import { effect, inject, Injectable, signal } from '@angular/core';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs,
} from 'keycloak-angular';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakEventSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  readonly authenticated = signal<boolean>(this.keycloak.authenticated ?? false);

  constructor() {
    effect(() => {
      const event = this.keycloakEventSignal();

      if (event.type === KeycloakEventType.Ready) {
        this.authenticated.set(typeEventArgs<ReadyArgs>(event.args));
        return;
      }

      if (event.type === KeycloakEventType.AuthSuccess) {
        this.authenticated.set(true);
        return;
      }

      if (event.type === KeycloakEventType.AuthLogout) {
        this.authenticated.set(false);
      }
    });
  }

  async login(redirectUri = window.location.href): Promise<void> {
    await this.keycloak.login({ redirectUri });
  }

  async logout(redirectUri = window.location.origin): Promise<void> {
    await this.keycloak.logout({ redirectUri });
    this.authenticated.set(false);
  }
}
