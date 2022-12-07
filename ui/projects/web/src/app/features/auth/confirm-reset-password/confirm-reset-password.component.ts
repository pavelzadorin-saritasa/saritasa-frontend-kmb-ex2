import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PasswordReset } from '@eu/common/core/models/password-reset';
import { UserService } from '@eu/common/core/services/user.service';
import { assertNonNull } from '@eu/common/core/utils/assert-non-null';
import { catchValidationData } from '@eu/common/core/utils/rxjs/catch-validation-error';
import { toggleExecutionState } from '@eu/common/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@eu/common/core/utils/types/controls-of';
import { AppValidators } from '@eu/common/core/utils/validators';
import { BehaviorSubject } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

export const RESET_CONFIRMATION_TOKEN_QUERY_KEY = 'token';
type ConfirmResetPasswordFormData = FlatControlsOf<Omit<
PasswordReset.Confirmation,
'key'
>>;

/**
 * This page is used for confirming a password reset after it is initiated by the `ResetPasswordComponent`.
 * It is usually opened by user via link that is sent to them via email.
 * Accepts a secret token as a query parameter, and uses it to confirm the password reset.
 * @see ResetPasswordComponent.
 *
 *
 * The URL to this page is usually discussed with the BE team since they are the ones who are responsible for sending the link to a user.
 * Recommended to use this URL `/confirm-password?token=<secret-token>`.
 */
@UntilDestroy()
@Component({
  selector: 'euw-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['../auth.css', 'confirm-reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmResetPasswordComponent {
  /** Whether the form is being submitted. */
  protected readonly isLoading$ = new BehaviorSubject<boolean>(false);

  /** Login form. */
  protected readonly form: FormGroup<ConfirmResetPasswordFormData>;

  public constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.form = this.initLoginForm();
  }

  /** Handles the form submission. */
  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const key$ = this.activatedRoute.queryParamMap.pipe(
      first(),
      map(paramMap => {
        const key = paramMap.get(RESET_CONFIRMATION_TOKEN_QUERY_KEY);
        assertNonNull(key);

        return key;
      }),
    );

    key$.pipe(
      switchMap(key =>
        this.userService.confirmPasswordReset({
          ...this.form.getRawValue(),
          key,
        })),
      toggleExecutionState(this.isLoading$),
      catchValidationData(this.form),
      untilDestroyed(this),
    )
      .subscribe({
        complete: () => this.router.navigateByUrl('/auth/login'),
      });
  }

  private initLoginForm(): FormGroup<ConfirmResetPasswordFormData> {
    return this.fb.group<ConfirmResetPasswordFormData>({
      password: this.fb.control('', Validators.required),
      passwordConfirmation: this.fb.control('', [Validators.required, AppValidators.matchControl('password')]),
    });
  }
}
