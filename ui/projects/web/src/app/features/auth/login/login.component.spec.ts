import { fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { byTestId, createComponentFactory, Spectator, SpyObject } from '@ngneat/spectator';
import { UserService } from '@eu/common/core/services/user.service';
import { CommonSharedModule } from '@eu/common/shared/common-shared.module';
import { delay, of } from 'rxjs';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let spectator: Spectator<LoginComponent>;
  let userServiceSpy: SpyObject<UserService>;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let submitButton: HTMLButtonElement;

  const createSpectator = createComponentFactory({
    component: LoginComponent,
    imports: [CommonSharedModule, ReactiveFormsModule],
    mocks: [UserService],
  });

  beforeEach(() => {
    spectator = createSpectator();
    userServiceSpy = spectator.inject(UserService);
    userServiceSpy.login.and.returnValue(of(undefined));
    emailInput = spectator.query(byTestId('login-email-input')) as HTMLInputElement;
    passwordInput = spectator.query(byTestId('login-password-input')) as HTMLInputElement;
    submitButton = spectator.query(byTestId('login-submit-button')) as HTMLButtonElement;
  });

  describe('inputs', () => {
    it('have placeholders', () => {
      expect(emailInput.placeholder).not.toBe('');
      expect(passwordInput.placeholder).not.toBe('');
    });

    it('have autocomplete attributes', () => {
      expect(emailInput.getAttribute('autocomplete')).toBe('email');
      expect(passwordInput.getAttribute('autocomplete')).toBe('current-password');
    });
  });

  describe('form', () => {
    describe('when submitted with valid data', () => {
      const dummyEmail = 'some-dummy-email@mail.com';
      const dummyPassword = 'some-dummy-password';

      beforeEach(() => {
        spectator.typeInElement(dummyEmail, emailInput);
        spectator.typeInElement(dummyPassword, passwordInput);
      });

      it('calls UserService.login(x) once', () => {
        spectator.click(submitButton);

        expect(userServiceSpy.login).toHaveBeenCalledWith({ email: dummyEmail, password: dummyPassword });
        expect(userServiceSpy.login).toHaveBeenCalledTimes(1);
      });

      it('toggles loading on the submit button', fakeAsync(() => {
        const loadingClass = jasmine.stringContaining('loading');
        const delayMs = 100;
        userServiceSpy.login.and.returnValue(of(undefined).pipe(delay(delayMs)));

        expect(submitButton.classList).not.toContain(loadingClass);
        spectator.click(submitButton);
        expect(submitButton.classList).toContain(loadingClass);
        tick(delayMs);
        spectator.detectChanges();
        expect(submitButton.classList).not.toContain(loadingClass);
      }));
    });

    describe('when submitted with invalid', () => {
      describe('password', () => {
        const invalidPasswordValue = '';

        it('does not call UserService.login(x)', () => {
          spectator.typeInElement(invalidPasswordValue, byTestId('login-password-input'));
          spectator.click(byTestId('login-submit-button'));

          expect(userServiceSpy.login).not.toHaveBeenCalled();
        });
      });

      describe('email', () => {
        const invalidEmailValue = 'invalid-email';

        it('does not call UserService.login(x)', () => {
          spectator.typeInElement(invalidEmailValue, byTestId('login-email-input'));
          spectator.click(byTestId('login-submit-button'));

          expect(userServiceSpy.login).not.toHaveBeenCalled();
        });
      });
    });
  });
});
