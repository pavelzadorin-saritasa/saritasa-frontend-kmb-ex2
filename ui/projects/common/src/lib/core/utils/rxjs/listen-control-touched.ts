import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * Allows to listen the touched state change.
 * The util is needed until Angular allows to listen for such events.
 * Https://github.com/angular/angular/issues/10887.
 * @param control Control to listen for.
 */
export function listenControlTouched(
  control: AbstractControl,
): Observable<boolean> {
  return new Observable<boolean>(observer => {
    const originalMarkAsTouched = control.markAsTouched;
    const originalReset = control.reset;

    control.reset = (...args) => {
      originalReset.call(control, ...args);
      observer.next(false);
    };

    control.markAsTouched = (...args) => {
      originalMarkAsTouched.call(control, ...args);
      observer.next(true);
    };

    observer.next(control.touched);

    return () => {
      control.markAsTouched = originalMarkAsTouched;
      control.reset = originalReset;
    };
  });
}
