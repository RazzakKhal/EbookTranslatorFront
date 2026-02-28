# Sign-in avec Keycloak (PKCE) - Explication detaillee

Ce document explique chaque bout de code ajoute pour la feature d'authentification.

## 1) Configuration globale dans `src/app/app.config.ts`

### a) Imports Keycloak

```ts
import {
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  provideKeycloak,
} from 'keycloak-angular';
```

- `provideKeycloak` : enregistre Keycloak dans l'injection de dependances Angular.
- `includeBearerTokenInterceptor` : lit le token d'acces Keycloak et ajoute `Authorization: Bearer <token>` sur les requetes qui matchent.
- `INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG` : token DI Angular qui contient les regles de matching URL.
- `createInterceptorCondition` + `IncludeBearerTokenCondition` : helper/type pour declarer ces regles proprement.

### b) A quoi sert exactement `provideKeycloak`

`provideKeycloak({...})` fait plusieurs choses importantes :

- cree l'instance `Keycloak` (keycloak-js) avec `url`, `realm`, `clientId`.
- l'expose via le systeme DI Angular (injectable partout).
- si `initOptions` est fourni, lance automatiquement `keycloak.init(initOptions)` au demarrage de l'app.
- rend disponible l'event signal Keycloak (utile pour suivre login/logout/refresh).

Donc ce provider est le point central qui "branche" Keycloak dans l'app Angular.

### c) Fonction utilitaire regex

```ts
const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
```

Pourquoi : `environment.apiUrl` peut contenir des caracteres speciaux (`.` par exemple). Sans echappement, la regex peut matcher des URLs non voulues.

### d) `createInterceptorCondition` : ce que fait la fonction

```ts
const apiUrlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: new RegExp(`^${escapeRegex(environment.apiUrl)}(\\/.*)?$`, 'i'),
});
```

- `createInterceptorCondition(...)` fabrique une condition typee pour l'interceptor Bearer.
- Dans ton cas, la condition dit : "n'ajoute le token que si l'URL commence par `environment.apiUrl`".
- C'est une protection de securite : evite d'envoyer le token a un service tiers par erreur.

Exemple :

- `environment.apiUrl = http://localhost:3000`
- `http://localhost:3000/translate-service/translate` -> token ajoute.
- `https://api.externe.com/data` -> token non ajoute.

### e) Initialisation Keycloak + PKCE

```ts
provideKeycloak({
  config: {
    url: environment.keycloakUrl,
    realm: environment.realm,
    clientId: environment.clientId,
  },
  initOptions: {
    onLoad: 'check-sso',
    flow: 'standard',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  },
}),
```

- `flow: 'standard'` : Authorization Code Flow.
- `pkceMethod: 'S256'` : active PKCE (code verifier/challenge), recommande pour SPA.
- `onLoad: 'check-sso'` : essaye de recuperer une session SSO existante sans forcer le login UI.
- `silentCheckSsoRedirectUri` : URL de la page HTML utilisee en iframe pour verifier la session en silence.

### f) `window.location.origin` : exemples concrets

`window.location.origin` = protocole + domaine + port courant (sans path/query).

Exemples :

- si l'app tourne sur `http://localhost:4200/translate`, alors `window.location.origin` vaut `http://localhost:4200`.
- en prod sur `https://app.monsite.com/dashboard`, `window.location.origin` vaut `https://app.monsite.com`.

Donc :

```ts
window.location.origin + '/silent-check-sso.html';
```

produit par exemple :

- `http://localhost:4200/silent-check-sso.html`

### g) Provider `INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG` : "a quoi sert le token dans provide"

```ts
{
  provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  useValue: [apiUrlCondition],
},
```

Important : ici, on ne "set" pas le token d'acces lui-meme.

- `provide` enregistre une configuration Angular DI.
- `useValue` donne la liste des regles (`apiUrlCondition`).
- ensuite `includeBearerTokenInterceptor` lit cette config, verifie la requete, puis recupere le vrai access token depuis l'instance Keycloak et ajoute le header `Authorization`.

## 2) Guard de route dans `src/app/shared/guards/keycloak-auth.guard.ts`

```ts
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
```

### `state.url` : a quoi ca correspond

`state.url` est l'URL routee que l'utilisateur voulait atteindre.

Exemples :

- user ouvre `/translate` -> `state.url === '/translate'`
- user ouvre `/translate?source=en&target=fr` -> `state.url === '/translate?source=en&target=fr'`

Avec :

```ts
redirectUri: `${window.location.origin}${state.url}`;
```

le retour apres login pointe vers la page initialement demandee.

Exemple final :

- origin `http://localhost:4200`
- `state.url` `/translate?source=en&target=fr`
- redirectUri = `http://localhost:4200/translate?source=en&target=fr`

## 3) Routing dans `src/app/app.routes.ts`

- Passage en `loadComponent` pour lazy loading des pages.
- Route `/translate` protegee avec `canActivate: [canActivateAuth]`.

Resultat :

- non connecte -> redirection Keycloak.
- connecte -> acces direct a la page translate.

## 4) `public/silent-check-sso.html` et `postMessage`

```html
<html>
  <body>
    <script>
      parent.postMessage(location.href, location.origin);
    </script>
  </body>
</html>
```

### Comment `postMessage` fonctionne ici

- cette page est chargee dans une iframe cachee.
- `parent` designe la fenetre principale de l'application Angular.
- `postMessage(message, targetOrigin)` envoie un message de l'iframe vers la fenetre parente.

Dans ce code :

- `message = location.href`
- `targetOrigin = location.origin`

### `location.href` vs `location.origin`

- `location.href` = URL complete actuelle (protocole + host + path + query + hash).
- `location.origin` = seulement protocole + host + port.

Exemple possible dans l'iframe :

- `location.href` = `http://localhost:4200/silent-check-sso.html#state=abc&session_state=...`
- `location.origin` = `http://localhost:4200`

### Pourquoi utiliser `targetOrigin`

Donner `location.origin` comme cible limite la reception au meme origin. C'est une mesure de securite pour eviter d'envoyer ces infos a une fenetre d'un autre domaine.

## 5) Variables prod dans `src/environments/environment.prod.ts`

```ts
export const environment = {
  production: true,
  apiUrl: 'https://api.monsite.com',
  keycloakUrl: 'https://auth.monsite.com',
  clientId: 'ebook-angular',
  realm: 'ebookTranslator',
};
```

Ces valeurs alimentent `provideKeycloak` en production. Sans elles, l'init Keycloak ne peut pas se faire correctement.

## 6) Resume du flux complet

1. L'app demarre et `provideKeycloak` initialise Keycloak (check-sso + PKCE).
2. L'utilisateur va sur `/translate`.
3. Le guard verifie `authData.authenticated`.
4. Si non authentifie : `keycloak.login({ redirectUri: origin + state.url })`.
5. Retour dans l'app apres login.
6. Les appels vers `environment.apiUrl` recoivent automatiquement `Authorization: Bearer <access_token>` via l'interceptor.

## 7) Gestion de la deconnexion (logout)

### a) Service ajoute : `src/app/shared/services/domain/auth-service.ts`

Ce service centralise `login`, `logout` et l'etat d'authentification.

```ts
readonly authenticated = signal<boolean>(this.keycloak.authenticated ?? false);
```

- Signal local qui represente l'etat connecte/deconnecte.
- Initialise avec la valeur courante de Keycloak.

```ts
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
```

- Synchronise le signal avec les evenements Keycloak.
- `Ready` : applique l'etat initial calcule par l'init Keycloak.
- `AuthSuccess` : utilisateur connecte.
- `AuthLogout` : utilisateur deconnecte.

```ts
async logout(redirectUri = window.location.origin): Promise<void> {
  await this.keycloak.logout({ redirectUri });
  this.authenticated.set(false);
}
```

- Appelle l'endpoint de deconnexion Keycloak.
- Invalide la session SSO cote serveur.
- Redirige ensuite vers `redirectUri` (par defaut la racine de l'app, ex: `http://localhost:4200`).
- Le `set(false)` garde l'UI coherente immediatement.

### b) Integration UI dans `src/app/app.ts` et `src/app/app.html`

Dans `app.ts` :

```ts
readonly authenticated = this.authService.authenticated;

async onLogout(): Promise<void> {
  await this.authService.logout();
}
```

- Le composant lit directement le signal `authenticated`.
- Le clic bouton appelle `logout()`.

Dans `app.html` :

```html
@if (authenticated()) {
  <button type="button" class="auth-action" (click)="onLogout()">Se deconnecter</button>
} @else {
  <button type="button" class="auth-action" (click)="onLogin()">Se connecter</button>
}
```

- Si connecte : affiche `Se deconnecter`.
- Sinon : affiche `Se connecter`.

### c) Ce qui se passe concretement lors du logout

1. L'utilisateur clique sur `Se deconnecter`.
2. `AuthService.logout()` appelle `keycloak.logout(...)`.
3. Keycloak termine la session (et nettoie la session SSO).
4. Le navigateur revient sur `redirectUri`.
5. Le guard de route protegee (`/translate`) redemandera login si on y retourne.
