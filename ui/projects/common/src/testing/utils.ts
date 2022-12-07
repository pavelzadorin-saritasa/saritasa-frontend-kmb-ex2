import { HttpStatusCode } from '@angular/common/http';
import { getTestScheduler, time } from 'jasmine-marbles';
import { defer, EMPTY, Observable, Observer, switchMap, timer } from 'rxjs';

/** Request status data. */
export interface HttpStatusData {

  /** Http status. */
  readonly status: number;

  /** Status represented by a human-readable string. */
  readonly statusText: string;
}

/**
 * Returns status data by provided status code.
 * @param statusCode Status code.
 */
export function getHttpStatusData(statusCode: HttpStatusCode): HttpStatusData {
  return {
    status: statusCode,
    statusText: 'Dummy reason phrase',
  };
}

/** Creates observer spy object. */
export function createObserverSpy<T>(): jasmine.SpyObj<Observer<T>> {
  return jasmine.createSpyObj('observer', ['next', 'error', 'complete']);
}

/**
 * Utils for reducing the boilerplate related to setting up asynchronous manipulations when testing observables.
 * Could only be used when a global test scheduler is initialized (via `initTestScheduler()`).
 */
export namespace TestSchedulerUtils {

  /**
   * Delays observable within the context of a current test scheduler.
   * @param timeMarbles Time marbles (e.g.: `-----|`).
   * @param observable$ Observable that should be delayed.
   */
  export function delayed<T>(timeMarbles: string, observable$: Observable<T>): Observable<T> {
    return timer(time(timeMarbles), getTestScheduler()).pipe(
      switchMap(() => observable$),
    );
  }

  /**
   * Delays a side effect callback within a context of a current test scheduler.
   * @param timeMarbles Represents time (in marble syntax) for which the side effect should be delayed.
   * @param callback The side effect callback. Will be called when the scheduled time is passed.
   */
  export function delayedSideEffect(timeMarbles: string, callback: () => void): Observable<never> {
    return delayed(timeMarbles, defer(() => {
      callback();
      return EMPTY;
    }));
  }
}
