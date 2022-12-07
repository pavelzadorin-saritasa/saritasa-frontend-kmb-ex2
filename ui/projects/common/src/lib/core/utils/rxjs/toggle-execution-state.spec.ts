import { fakeAsync, flush, tick } from '@angular/core/testing';
import { BehaviorSubject, timer } from 'rxjs';

import { toggleExecutionState } from './toggle-execution-state';

describe('toggleExecutionState(x)', () => {
  it('pushes `true` at start and `false` at finish', fakeAsync(() => {
    const REQUEST_TIME_MS = 100;
    const subject$ = new BehaviorSubject<boolean>(false);

    expect(subject$.getValue()).toBeFalse();
    timer(REQUEST_TIME_MS).pipe(
      toggleExecutionState(subject$),
    )
      .subscribe();

    flush();
    expect(subject$.getValue()).toBeTrue();
    tick(REQUEST_TIME_MS);
    expect(subject$.getValue()).toBeFalse();

    subject$.complete();
  }));
});
