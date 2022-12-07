import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit } from '@angular/core';
import { FormControlDirective, NgControl, NgModel, ValidationErrors } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { listenControlTouched } from '@eu/common/core/utils/rxjs/listen-control-touched';
import { AppValidators } from '@eu/common/core/utils/validators';
import { EMPTY, merge, Observable, ReplaySubject, tap } from 'rxjs';
import { distinct, mapTo, switchMap, filter } from 'rxjs/operators';

/**
 * Label component. Displays error and label for the input component.
 */
@UntilDestroy()
@Component({
  selector: 'euc-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent implements OnInit {
  /**
   * Error text.
   */
  @Input()
  public set errorText(text: string | null) {
    if (text != null) {
      this.errors$.next(AppValidators.buildAppError(text));
    }
  }

  /**
   * Text of control's label.
   */
  @Input()
  public labelText: string | null = null;

  /** Catch inner input by form control directive. */
  @ContentChild(NgControl)
  public set input(i: NgModel | FormControlDirective) {
    if (i) {
      this.input$.next(i);
    }
  }

  /** Errors stream. */
  protected readonly errors$ = new ReplaySubject<ValidationErrors | null>(1);

  private readonly input$ = new ReplaySubject<NgModel | FormControlDirective>(1);

  /** @inheritDoc */
  public ngOnInit(): void {
    this.initErrorStreamSideEffect().pipe(
      untilDestroyed(this),
    )
      .subscribe();
  }

  private initErrorStreamSideEffect(): Observable<ValidationErrors | null> {
    return this.input$.pipe(
      distinct(),
      switchMap(input =>
        merge(
          input.statusChanges ?? EMPTY,
          listenControlTouched(input.control).pipe(filter(touched => touched)),
        ).pipe(mapTo(input))),
      tap(input => this.errors$.next(input.errors)),
    );
  }
}
