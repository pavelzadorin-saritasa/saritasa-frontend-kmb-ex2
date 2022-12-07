import { HttpClient, HttpErrorResponse, HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { createHttpFactory, HttpMethod, SpectatorHttp, SpyObject } from '@ngneat/spectator';
import { getHttpStatusData, TestSchedulerUtils } from '@eu/common/testing/utils';
import { cold, getTestScheduler, initTestScheduler } from 'jasmine-marbles';
import { merge } from 'rxjs';

import { AppUrlsConfig } from '../services/app-urls.config';
import { UserService } from '../services/user.service';

import { RefreshTokenInterceptor } from './refresh-token.interceptor';

describe('RefreshTokenInterceptor', () => {
  let spectator: SpectatorHttp<HttpClient>;
  let userServiceSpy: SpyObject<UserService>;
  let errorObserverSpy: jasmine.Spy;
  let apiUrlsConfig: AppUrlsConfig;
  const createSpectator = createHttpFactory({
    service: HttpClient,
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true }],
    mocks: [UserService],
  });

  beforeEach(() => {
    errorObserverSpy = jasmine.createSpy('Error observer spy');
    spectator = createSpectator();
    userServiceSpy = spectator.inject(UserService);
    apiUrlsConfig = spectator.inject(AppUrlsConfig);
  });

  function expectErrorToBePassed(url: string) {
    spectator.service.get(url).subscribe({ error: errorObserverSpy });
    const testRequest = spectator.expectOne(url, HttpMethod.GET);
    testRequest.flush({}, getHttpStatusData(HttpStatusCode.Unauthorized));

    expect(errorObserverSpy).toHaveBeenCalledOnceWith(jasmine.any(HttpErrorResponse));
    expect(userServiceSpy.refreshSecret).not.toHaveBeenCalled();
  }

  describe('when client calls application-scoped url that is not auth-related', () => {
    describe('and the request fails with "Unauthorized"', () => {
      const unauthorizedStatusData = getHttpStatusData(HttpStatusCode.Unauthorized);

      describe('with no requests in parallel', () => {
        let url: string;

        beforeEach(() => {
          url = apiUrlsConfig.user.currentProfile;
        });

        function testStandaloneRefresh() {
          // Initializing the test scheduler to isolate the async context
          initTestScheduler();
          const testScheduler = getTestScheduler();

          const marbles = {
            subscription: '                       ^----------------!',
            firstErrorResponse: '                 --|               ',
            refreshSecret: '                        ---(x|)         ',
            secondSuccessResponse: '              ------------|     ',
            expected: '                           ------------(n|)  ',
          } as const;
          const values = { x: undefined, n: null };

          userServiceSpy.refreshSecret.and.returnValue(cold(marbles.refreshSecret));

          const firstResponse$ = TestSchedulerUtils.delayedSideEffect(
            marbles.firstErrorResponse,
            () => spectator.expectOne(url, HttpMethod.GET).flush({}, unauthorizedStatusData),
          );

          const secondResponse$ = TestSchedulerUtils.delayedSideEffect(
            marbles.secondSuccessResponse,
            () => spectator.expectOne(url, HttpMethod.GET).flush(null),
          );

          testScheduler.expectObservable(
            merge(
              spectator.service.get(url),
              firstResponse$,
              secondResponse$,
            ),
            marbles.subscription,
          ).toBe(marbles.expected, values);
          testScheduler.flush();
        }

        it('refreshes the secret', () => {
          const TEST_TIMES_AMOUNT = 5;

          // Test it several times since the interceptor is a stateful singleton,
          // need to make sure it works correctly even if it was already called before
          for (let i = 0; i < TEST_TIMES_AMOUNT; i++) {
            testStandaloneRefresh();
          }

          expect(userServiceSpy.refreshSecret).toHaveBeenCalledTimes(TEST_TIMES_AMOUNT);
        });
      });

      describe('with several requests in parallel', () => {
        it('waits for the first refresh request to complete', () => {
          initTestScheduler();
          const testScheduler = getTestScheduler();
          const firstUrl = apiUrlsConfig.user.changePassword;
          const secondUrl = apiUrlsConfig.user.currentProfile;

          /**
           * 1. Make a request
           * 2. Make a second request in parallel
           * 3. Fail the first request with 401
           *      The interceptor starts refreshing the secret, since the first request is failed
           *      and schedules a retry after the token is refreshed
           * 4. Fail the second request with 401, while the token is being refreshed
           *      The interceptor schedules a retry of a second request
           * 5. Assure there is no second refresh called, since we're already refreshing it at the time (after first fail)
           * 6. Make sure both requests are retried.
           */
          const marbles = {
            subscription: '               ^---------------!',
            firstRequest: '               -|               ',
            firstRequestErrorResponse: '   ---|            ',
            refreshSecret: '                 ----(x|)      ',
            firstRequestRetryResponse: '  -----------|     ',
            secondRequest: '              --|              ',
            secondRequestErrorResponse: ' -----|           ',
            secondRequestRetryResponse: ' -------------|   ',
            expected: '                   -----------n-(n|)',
          };
          const values = { n: null, x: undefined };

          const refreshToken$ = cold(marbles.refreshSecret, values);
          userServiceSpy.refreshSecret.and.returnValue(refreshToken$);

          const firstRequest$ = TestSchedulerUtils.delayed(marbles.firstRequest, spectator.service.get(firstUrl));
          const secondRequest$ = TestSchedulerUtils.delayed(marbles.secondRequest, spectator.service.get(secondUrl));

          const firstRequestResponse$ = TestSchedulerUtils.delayedSideEffect(
            marbles.firstRequestErrorResponse,
            () => spectator.controller.match(firstUrl)[0]
              .flush({}, unauthorizedStatusData),
          );

          const secondRequestResponse$ = TestSchedulerUtils.delayedSideEffect(
            marbles.secondRequestErrorResponse,
            () => spectator.controller.match(secondUrl)[0]
              .flush({}, unauthorizedStatusData),
          );

          const firstRequestRetryResponse$ = TestSchedulerUtils.delayedSideEffect(
            marbles.firstRequestRetryResponse,
            () => spectator.controller.match(firstUrl)[0]
              .flush(null),
          );

          const secondRequestRetryResponse$ = TestSchedulerUtils.delayedSideEffect(
            marbles.secondRequestRetryResponse,
            () => spectator.controller.match(secondUrl)[0]
              .flush(null),
          );

          testScheduler.expectObservable(
            merge(
              firstRequest$,
              secondRequest$,
              firstRequestResponse$,
              secondRequestResponse$,
              firstRequestRetryResponse$,
              secondRequestRetryResponse$,
            ),
            marbles.subscription,
          ).toBe(marbles.expected, values);
          testScheduler.flush();

          expect(userServiceSpy.refreshSecret).toHaveBeenCalledTimes(1);
          expect(refreshToken$.getSubscriptions().length).toBe(1);
        });
      });
    });

    describe('and the request fails with an error that is not "Unauthorized"', () => {
      it('passes the error', () => {
        const url = apiUrlsConfig.user.changePassword;

        spectator.service.get(url).subscribe({ error: errorObserverSpy });
        spectator.controller.expectOne(url, HttpMethod.GET)
          .flush({}, getHttpStatusData(HttpStatusCode.BadRequest));

        expect(userServiceSpy.refreshSecret).not.toHaveBeenCalled();
        expect(errorObserverSpy).toHaveBeenCalledOnceWith(jasmine.any(HttpErrorResponse));
      });
    });
  });

  describe('when client calls auth-related url', () => {
    it('passes the error', () => {
      const authUrl = apiUrlsConfig.auth.login;
      expect(apiUrlsConfig.isAuthUrl(authUrl)).toBe(true);

      expectErrorToBePassed(authUrl);
    });
  });

  describe('when client calls url outside of the application scope', () => {
    it('ignores the error', () => {
      const externalUrl = 'example.com/test/';
      expect(apiUrlsConfig.isApplicationUrl(externalUrl)).toBe(false);
      expect(apiUrlsConfig.isAuthUrl(externalUrl)).toBe(false);

      expectErrorToBePassed(externalUrl);
    });
  });
});
