import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { createObserverSpy, getHttpStatusData } from 'projects/common/src/testing/utils';

import { Observer, throwError } from 'rxjs';

import { catchHttpErrorResponse } from './catch-http-error-response';

describe('.catchHttpErrorResponse(x)', () => {
  let observer: Observer<unknown>;

  beforeEach(() => {
    observer = createObserverSpy();
  });

  describe('when got HttpErrorResponse', () => {
    it('calls error handler', () => {
      const httpErrorMock = new HttpErrorResponse(getHttpStatusData(HttpStatusCode.BadRequest));
      const errorHandlerSpy = jasmine.createSpy('error handler').and.returnValue(throwError(() => new Error('some error')));

      throwError(() => httpErrorMock).pipe(
        catchHttpErrorResponse(errorHandlerSpy),
      )
        .subscribe(observer);

      expect(errorHandlerSpy).toHaveBeenCalledOnceWith(httpErrorMock);
    });
  });

  describe('when got non-HttpErrorResponse', () => {
    it('passes error through', () => {
      const errorMock = new Error('some error that is not HttpErrorResponse');
      const errorHandlerSpy = jasmine.createSpy('dummy handler');

      throwError(() => errorMock).pipe(
        catchHttpErrorResponse(errorHandlerSpy),
      )
        .subscribe(observer);

      expect(errorHandlerSpy).not.toHaveBeenCalledOnceWith(errorMock);
      expect(observer.error).toHaveBeenCalledOnceWith(errorMock);
    });
  });
});
