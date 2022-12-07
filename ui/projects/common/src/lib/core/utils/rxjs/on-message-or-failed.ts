import { MonoTypeOperatorFunction, pipe, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Operator emits passed callback on every stream message or error.
 * @param callback Callback.
 * @example observable$.pipe(onMessageOrFailed(() => ...));
 */
export function onMessageOrFailed<T>(callback: () => void): MonoTypeOperatorFunction<T> {
  return pipe(
    tap(() => callback()),
    catchError((e: unknown) => {
      callback();
      return throwError(() => e);
    }),
  );
}
