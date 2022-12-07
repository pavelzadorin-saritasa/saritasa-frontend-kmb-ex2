import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { listenControlChanges } from './listen-control-changes';

describe('listenControlChanges(x)', () => {
  let subscriptions: Subscription[] = [];

  beforeEach(() => {
    subscriptions = [];
  });

  afterEach(() => {
    subscriptions.forEach(subscription => subscription.unsubscribe());
  });

  it('emits initial value', fakeAsync(() => {
    const initControlValue = 'Hello world!';
    const testControl = new FormControl<string>(initControlValue);

    const values: string[] = [];
    const DEBOUNCE_MS = 300;
    subscriptions.push(
      listenControlChanges<string>(testControl, undefined, DEBOUNCE_MS).subscribe(val => {
        values.push(val);
      }),
    );

    tick(DEBOUNCE_MS);

    expect(values).toContain(initControlValue);
  }));

  it('emits new value', fakeAsync(() => {
    const initControlValue = 'Hello world!';
    const newValue = 'New value';
    const testControl = new FormControl<string>(initControlValue);

    const values: string[] = [];
    const DEBOUNCE_MS = 300;
    subscriptions.push(
      listenControlChanges<string>(testControl, undefined, DEBOUNCE_MS).subscribe(val => {
        values.push(val);
      }),
    );
    tick(DEBOUNCE_MS);
    testControl.setValue(newValue);
    tick(DEBOUNCE_MS);

    expect(values).toContain(initControlValue);
    expect(values).toContain(newValue);
  }));
});
