import { Directive, ElementRef, Input } from '@angular/core';

/**
 * Loading state directive. Applies loading state on element. Color and size are customizable via `--spinner-color` and `--spinner-size`.
 * @example
 * ```html
 * <button [eucLoading]="isLoading$ | async" (click)="isLoading$.next(true)">Submit</button>
 * ```
 *
 */
@Directive({
  selector: '[eucLoading]',
})
export class LoadingDirective {
  /** Loading beacon. */
  @Input()
  public set eucLoading(loading: boolean | null) {
    if (loading) {
      this.elementRef.nativeElement.classList.add('euc-loading');
      this.disable();
    } else {
      this.elementRef.nativeElement.classList.remove('euc-loading');
      this.enable();
    }
  }

  /**
   * @param elementRef Element ref.
   */
  public constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  /** Enable element. */
  private disable(): void {
    this.elementRef.nativeElement.setAttribute('disabled', 'true');
  }

  /** Disable element. */
  private enable(): void {
    this.elementRef.nativeElement.removeAttribute('disabled');
  }
}
