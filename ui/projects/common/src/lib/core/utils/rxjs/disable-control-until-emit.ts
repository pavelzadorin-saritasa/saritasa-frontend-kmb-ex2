import { AbstractControl } from '@angular/forms';
import { defer, MonoTypeOperatorFunction } from 'rxjs';

import { onMessageOrFailed } from './on-message-or-failed';

/**
 * Disables a control until stream is emitted.
 * @param control Control to disable.
 */
export function disableControlUntilEmitOrFailed<T>(
  control: AbstractControl,
): MonoTypeOperatorFunction<T> {
  return source$ =>
    defer(() => {
      control.disable({ emitEvent: false });
      return source$;
    }).pipe(onMessageOrFailed(() => control.enable({ emitEvent: false })));
}
