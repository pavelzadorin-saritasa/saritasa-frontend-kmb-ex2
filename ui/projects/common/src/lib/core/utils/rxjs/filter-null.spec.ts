import { cold, getTestScheduler, initTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { filterNull } from './filter-null';

describe('filterNull(x)', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    initTestScheduler();
    testScheduler = getTestScheduler();
  });

  it('filters only values that are non-nullable', () => {
    const subscriptionMarbles = '^------------!';
    const stream = '             -n-a-x-b--c-n-';
    const expected = '           ---a---b--c---';
    const values = {
      n: null,
      x: undefined,
      a: 1,
      b: { test: 1 },
      c: '123',
    };

    const stream$ = cold(stream, values).pipe(filterNull());

    testScheduler.expectObservable(
      stream$,
      subscriptionMarbles,
    ).toBe(
      expected,
      values,
    );
  });
});
