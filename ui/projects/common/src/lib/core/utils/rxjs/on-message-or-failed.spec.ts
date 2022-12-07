import { fakeAsync, flush } from '@angular/core/testing';
import { createObserverSpy } from '@eu/common/testing/utils';
import { Observer, of, throwError } from 'rxjs';

import { onMessageOrFailed } from './on-message-or-failed';

describe('onMessageOrFailed(x)', () => {
  let observerSpy: jasmine.SpyObj<Observer<unknown>>;

  beforeEach(() => {
    observerSpy = createObserverSpy();
  });

  describe('error observable', () => {
    it('calls error listener', fakeAsync(() => {
      const dummyError = new Error('test');
      const errorHandlerSpy = jasmine.createSpy('errorHandlerSpy');

      throwError(() => dummyError).pipe(
        onMessageOrFailed(errorHandlerSpy),
      )
        .subscribe(observerSpy);
      flush();

      expect(observerSpy.error).toHaveBeenCalledOnceWith(dummyError);
      expect(errorHandlerSpy).toHaveBeenCalledWith();
    }));

  });

  describe('normal observable', () => {
    it('executes emit listener', () => {
      const dummyValue = 'test';
      const emitHandlerSpy = jasmine.createSpy('emitHandlerSpy');

      of(dummyValue).pipe(
        onMessageOrFailed(emitHandlerSpy),
      )
        .subscribe(observerSpy);

      expect(observerSpy.next).toHaveBeenCalledOnceWith(dummyValue);
      expect(emitHandlerSpy).toHaveBeenCalledWith();
    });
  });
});
