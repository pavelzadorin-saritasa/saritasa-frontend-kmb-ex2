import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { createHttpFactory, HttpMethod, mockProvider, SpectatorHttp } from '@ngneat/spectator';
import { ReplaySubject } from 'rxjs';

import { UserSecret } from '../models/user-secret';
import { AppConfig } from '../services/app.config';
import { UserSecretStorageService } from '../services/user-secret-storage.service';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let userSecretSubject: ReplaySubject<UserSecret | null>;
  let spectator: SpectatorHttp<HttpClient>;

  const createSpectator = createHttpFactory({
    service: HttpClient,
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  });

  beforeEach(() => {
    userSecretSubject = new ReplaySubject(1);
    spectator = createSpectator({
      providers: [
        mockProvider(
          UserSecretStorageService,
          {
            currentSecret$: userSecretSubject,
          },
        ),
      ],
    });
  });

  function expectAuthHeaderForUrl(
    url: string,
    expectedHeaderValue: jasmine.Expected<string | null>,
  ): void {
    spectator.service.get(url).subscribe();

    const testRequest = spectator.expectOne(url, HttpMethod.GET);

    expect(testRequest.request.headers.get('Authorization')).toEqual(expectedHeaderValue);
  }

  describe('when a client calls an application-scoped route', () => {
    let applicationScopedUrl: string;

    beforeEach(() => {
      applicationScopedUrl = new URL('any-api-url', spectator.inject(AppConfig).apiUrl).toString();
    });

    describe('with user secret', () => {
      beforeEach(() => {
        userSecretSubject.next({ token: 'any-token' });
      });

      it('appends authorization token', () => {
        expectAuthHeaderForUrl(applicationScopedUrl, jasmine.any(String));
      });
    });

    describe('without user secret', () => {
      beforeEach(() => {
        userSecretSubject.next(null);
      });

      it('does not append authorization token', () => {
        expectAuthHeaderForUrl(applicationScopedUrl, null);
      });
    });
  });

  describe('when client calls external endpoint', () => {
    const externalUrl = 'https://some.external.testing.url.com/undefined-endpoint/';

    it('does not append authorization header', () => {
      expectAuthHeaderForUrl(externalUrl, null);
    });
  });
});
