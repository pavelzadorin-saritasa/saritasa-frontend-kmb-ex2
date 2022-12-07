import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Login } from '@eu/common/core/models/login';
import { UserService } from '@eu/common/core/services/user.service';
import { catchValidationData } from '@eu/common/core/utils/rxjs/catch-validation-error';
import { toggleExecutionState } from '@eu/common/core/utils/rxjs/toggle-execution-state';
import { FlatControlsOf } from '@eu/common/core/utils/types/controls-of';
import { BehaviorSubject } from 'rxjs';

type LoginFormData = FlatControlsOf<Login>;

/** Login page. */
@UntilDestroy()
@Component({
  selector: 'euw-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.css', './login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  /** Is app loading. */
  protected readonly isLoading$ = new BehaviorSubject<boolean>(false);

  /** Login form. */
  protected readonly loginForm: FormGroup<LoginFormData>;

  public constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly userService: UserService,
  ) {
    this.loginForm = this.initLoginForm();
  }

  /**
   * Handle 'submit' of the login form.
   */
  protected onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    const loginData = this.loginForm.getRawValue();
    this.userService.login(loginData).pipe(
      toggleExecutionState(this.isLoading$),
      catchValidationData(this.loginForm),
      untilDestroyed(this),
    )
      .subscribe();
  }

  private initLoginForm(): FormGroup<LoginFormData> {
    return this.fb.group<LoginFormData>({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required),
    });
  }
}
