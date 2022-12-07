import { ReactiveFormsModule } from '@angular/forms';
import { Spectator, SpyObject, createComponentFactory, byTestId } from '@ngneat/spectator';
import { PasswordReset } from '@eu/common/core/models/password-reset';
import { UserService } from '@eu/common/core/services/user.service';
import { CommonSharedModule } from '@eu/common/shared/common-shared.module';
import { of } from 'rxjs';

import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let spectator: Spectator<ResetPasswordComponent>;
  let userServiceSpy: SpyObject<UserService>;
  let emailInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  const createSpectator = createComponentFactory({
    component: ResetPasswordComponent,
    imports: [CommonSharedModule, ReactiveFormsModule],
    mocks: [UserService],
  });

  beforeEach(() => {
    spectator = createSpectator();
    userServiceSpy = spectator.inject(UserService);
    emailInput = spectator.query(byTestId('reset-password-email-input')) as HTMLInputElement;
    submitButton = spectator.query(byTestId('reset-password-submit-button')) as HTMLButtonElement;
  });

  describe('input', () => {
    it('has autocomplete attribute', () => {
      expect(emailInput.getAttribute('autocomplete')).not.toBe('');
    });

    it('has placeholder', () => {
      expect(emailInput.placeholder).not.toBe('');
    });
  });

  describe('form', () => {
    describe('when submitted with valid data', () => {
      const dummyEmail = 'some-dummy-email@mail.com';

      it('calls UserService.resetPassword(x)', () => {
        userServiceSpy.resetPassword.and.returnValue(of(undefined));
        spectator.typeInElement(dummyEmail, emailInput);
        spectator.click(submitButton);

        expect(userServiceSpy.resetPassword).toHaveBeenCalledOnceWith({ email: dummyEmail } as PasswordReset.Data);
      });
    });

    describe('when submitted with invalid data', () => {
      const dummyInvalidEmail = 'some-dummy-email';

      it('shouldn\'t call UserService.resetPassword(x)', () => {
        spectator.typeInElement(dummyInvalidEmail, emailInput);
        spectator.click(submitButton);

        expect(userServiceSpy.resetPassword).not.toHaveBeenCalled();
      });
    });
  });
});
