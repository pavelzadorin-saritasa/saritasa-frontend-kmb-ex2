import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { createObserverSpy, getHttpStatusData } from '@eu/common/testing/utils';
import { Observer, throwError } from 'rxjs';

import { AppError } from '../../models/app-error';

import { AppErrorMapper } from './app-error.mapper';

describe('AppErrorMapper', () => {
  let spectator: SpectatorService<AppErrorMapper>;
  let observerSpy: Observer<unknown>;
  const createService = createServiceFactory(AppErrorMapper);

  beforeEach(() => {
    observerSpy = createObserverSpy();
    spectator = createService();
  });

  describe('.catchHttpErrorToAppError(x)', () => {

    describe('when HttpErrorResponse is thrown', () => {
      const httpError$ = throwError(() => new HttpErrorResponse(getHttpStatusData(HttpStatusCode.Unauthorized)));

      it('returns AppError', () => {
        httpError$.pipe(
          spectator.service.catchHttpErrorToAppError(),
        )
          .subscribe(observerSpy);

        expect(observerSpy.next).not.toHaveBeenCalled();
        expect(observerSpy.error).toHaveBeenCalledWith(jasmine.any(AppError));
      });
    });

    describe('when non-http error is thrown', () => {
      const error$ = throwError(() => new Error('Some other error'));

      it('passes the error', () => {
        error$.pipe(
          spectator.service.catchHttpErrorToAppError(),
        )
          .subscribe(observerSpy);

        expect(observerSpy.next).not.toHaveBeenCalled();
        expect(observerSpy.error).toHaveBeenCalledWith(jasmine.any(Error));
        expect(observerSpy.error).not.toHaveBeenCalledWith(jasmine.any(AppError));
      });
    });
  });

  describe('.catchHttpErrorToAppErrorWithValidationSupport(x)', () => {
    describe('when HttpErrorResponse is thrown', () => {
      const error$ = throwError(() => new HttpErrorResponse(getHttpStatusData(HttpStatusCode.BadRequest)));

      it('throws AppError', () => {
        const mapperSpy = jasmine.createSpy('mapper');

        error$.pipe(
          spectator.service.catchHttpErrorToAppErrorWithValidationSupport(mapperSpy),
        ).subscribe(observerSpy);

        expect(observerSpy.next).not.toHaveBeenCalled();
        expect(observerSpy.error).toHaveBeenCalledOnceWith(jasmine.any(AppError));
      });
    });

    describe('when non-http error is thrown', () => {
      const error$ = throwError(() => new Error('any other error'));

      it('passes the error', () => {
        const mapperSpy = jasmine.createSpy('mapper');

        error$.pipe(
          spectator.service.catchHttpErrorToAppErrorWithValidationSupport(mapperSpy),
        ).subscribe(observerSpy);

        expect(observerSpy.next).not.toHaveBeenCalled();
        expect(observerSpy.error).toHaveBeenCalledWith(jasmine.any(Error));
        expect(observerSpy.error).not.toHaveBeenCalledWith(jasmine.any(AppError));
      });
    });
  });
});
