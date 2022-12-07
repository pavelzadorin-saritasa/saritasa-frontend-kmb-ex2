import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PasswordReset } from '@eu/common/core/models/password-reset';
import { UserService } from '@eu/common/core/services/user.service';
import { catchValidationData } from '@eu/common/core/utils/rxjs/catch-validation-error';
import { toggleExecutionState } from '@eu/common/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@eu/common/core/utils/types/controls-of';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

type ResetPasswordFormData = FlatControlsOf<PasswordReset.Data>;

/** Page for requesting password reset. */
@UntilDestroy()
@Component({
  selector: 'euw-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../auth.css', './reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  /** Reset link result. */
  protected readonly resetResult$ = new ReplaySubject<string>(1);

  /** Whether the form is loading. */
  protected readonly isLoading$ = new BehaviorSubject<boolean>(false);

  /** Form with data required to reset the password. */
  protected readonly form: FormGroup<ResetPasswordFormData>;

  public constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly userService: UserService,
  ) {
    this.form = this.initResetPasswordForm();
  }

  /** Handles form submission. */
  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.userService
      .resetPassword(this.form.getRawValue())
      .pipe(
        toggleExecutionState(this.isLoading$),
        catchValidationData(this.form),
        untilDestroyed(this),
      )
      .subscribe(this.resetResult$);
  }

  private initResetPasswordForm(): FormGroup<ResetPasswordFormData> {
    return this.fb.group<ResetPasswordFormData>({
      email: this.fb.control('', [Validators.required, Validators.email]),
    });
  }
}
