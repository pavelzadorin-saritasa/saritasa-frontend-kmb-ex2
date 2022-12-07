import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

import { AppUrlsConfig } from '../services/app-urls.config';
import { UserService } from '../services/user.service';
import { catchHttpErrorResponse } from '../utils/rxjs/catch-http-error-response';

/** Catches requests with outdated tokens and attempts to refresh it and then retry the request. */
@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  /** Active request for token refresh. */
  private refreshSecretRequest$: Observable<void> | null = null;

  public constructor(
    private readonly userService: UserService,
    private readonly apiUrlsConfig: AppUrlsConfig,
  ) {}

  /** @inheritdoc */
  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!this.shouldRefreshTokenForUrl(req.url)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchHttpErrorResponse(error => {
        if (this.shouldHttpErrorBeIgnored(error)) {
          return throwError(() => error);
        }

        this.refreshSecretRequest$ ??= this.userService.refreshSecret().pipe(
          shareReplay({ refCount: true, bufferSize: 1 }),
        );

        return this.refreshSecretRequest$.pipe(
          tap(() => {
            this.refreshSecretRequest$ = null;
          }),
          switchMap(() => next.handle(req)),
        );
      }),
    );
  }

  private shouldHttpErrorBeIgnored(error: HttpErrorResponse): boolean {
    return error.status !== HttpStatusCode.Unauthorized;
  }

  private shouldRefreshTokenForUrl(url: string): boolean {
    return this.apiUrlsConfig.isApplicationUrl(url) &&
      !this.apiUrlsConfig.isAuthUrl(url);
  }
}
