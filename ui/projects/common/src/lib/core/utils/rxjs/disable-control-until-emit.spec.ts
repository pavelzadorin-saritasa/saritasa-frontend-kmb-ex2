import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { createObserverSpy } from '@eu/common/testing/utils';
import { Observer, switchMap, throwError, timer } from 'rxjs';

import { disableControlUntilEmitOrFailed } from './disable-control-until-emit';

describe('disableControlUntilEmitOrFailed(x)', () => {
  let control: FormControl;
  let observerSpy: jasmine.SpyObj<Observer<unknown>>;

  beforeEach(() => {
    control = new FormControl();
    observerSpy = createObserverSpy();
  });

  describe('value is emitted', () => {
    it('enables control', fakeAsync(() => {
      expect(control.enabled).toBeTrue();

      const REQUEST_TIME_MS = 100;

      timer(REQUEST_TIME_MS).pipe(
        disableControlUntilEmitOrFailed(control),
      )
        .subscribe(observerSpy);

      expect(control.disabled).toBeTrue();

      tick(REQUEST_TIME_MS);

      expect(control.enabled).toBeTrue();
    }));
  });

  describe('stream failed', () => {
    it('enables control', fakeAsync(() => {
      expect(control.enabled).toBeTrue();

      const REQUEST_TIME_MS = 100;

      timer(REQUEST_TIME_MS).pipe(
        switchMap(() => throwError(() => new Error('test'))),
        disableControlUntilEmitOrFailed(control),
      )
        .subscribe(observerSpy);

      expect(control.disabled).toBeTrue();

      tick(REQUEST_TIME_MS);

      expect(control.enabled).toBeTrue();
    }));
  });
});
