import { CanActivateFn } from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  _: Parameters<CanActivateFn>[0],
  state: Parameters<CanActivateFn>[1],
  authData: AuthGuardData,
): Promise<boolean> => {
  if (authData.authenticated) {
    return true;
  }

  await authData.keycloak.login({
    redirectUri: `${window.location.origin}${state.url}`,
  });

  return false;
};

export const canActivateAuth = createAuthGuard<CanActivateFn>(isAccessAllowed);
