import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Login } from '../models/login';
import { PasswordChange } from '../models/password-change';
import { PasswordReset } from '../models/password-reset';
import { UserSecret } from '../models/user-secret';

import { AppUrlsConfig } from './app-urls.config';
import { AppErrorMapper } from './mappers/app-error.mapper';
import { SuccessResponseDto } from './mappers/dto/success-response.dto';
import { UserSecretDto } from './mappers/dto/user-secret.dto';
import { LoginDataMapper } from './mappers/login-data.mapper';
import { PasswordChangeMapper } from './mappers/password-change.mapper';
import { ResetPasswordConfirmationMapper } from './mappers/reset-password-confirmation.mapper';
import { ResetPasswordMapper } from './mappers/reset-password.mapper';
import { UserSecretDataMapper } from './mappers/user-secret-data.mapper';

/**
 * Performs CRUD operations for auth-related information.
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  public constructor(
    private readonly apiUrlsConfig: AppUrlsConfig,
    private readonly httpClient: HttpClient,
    private readonly loginDataMapper: LoginDataMapper,
    private readonly appErrorMapper: AppErrorMapper,
    private readonly userSecretMapper: UserSecretDataMapper,
    private readonly resetPasswordMapper: ResetPasswordMapper,
    private readonly resetPasswordConfirmationMapper: ResetPasswordConfirmationMapper,
    private readonly passwordChangeMapper: PasswordChangeMapper,
  ) { }

  /**
   * Login a user with email and password.
   * @param loginData Login data.
   */
  public login(loginData: Login): Observable<UserSecret> {
    return this.httpClient.post<UserSecret>(
      this.apiUrlsConfig.auth.login,
      this.loginDataMapper.toDto(loginData),
    )
      .pipe(
        map(dto => this.userSecretMapper.fromDto(dto)),
        this.appErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(
          this.loginDataMapper,
        ),
      );
  }

  /**
   * Refresh user's secret.
   * @param secret Secret data.
   */
  public refreshSecret(
    secret: UserSecret,
  ): Observable<UserSecret> {
    return this.httpClient.post<UserSecretDto>(
      this.apiUrlsConfig.auth.refreshSecret,
      this.userSecretMapper.toDto(secret),
    )
      .pipe(
        map(refreshedSecret => this.userSecretMapper.fromDto(refreshedSecret)),
        this.appErrorMapper.catchHttpErrorToAppError(),
      );
  }

  /**
   * Sends request to reset the password.
   * @param data Data for password reset.
   * @returns Success message.
   */
  public resetPassword(data: PasswordReset.Data): Observable<string> {
    return this.httpClient.post<SuccessResponseDto>(
      this.apiUrlsConfig.auth.resetPassword,
      this.resetPasswordMapper.toDto(data),
    )
      .pipe(
        map(result => result.detail),
        this.appErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(
          this.resetPasswordMapper,
        ),
      );
  }

  /**
   * Confirms password reset and applies new passwords to the account.
   * @param data New passwords data.
   * @returns Success message.
   */
  public confirmPasswordReset(
    data: PasswordReset.Confirmation,
  ): Observable<string> {
    return this.httpClient.post<SuccessResponseDto>(
      this.apiUrlsConfig.auth.confirmPasswordReset,
      this.resetPasswordConfirmationMapper.toDto(data),
    )
      .pipe(
        map(result => result.detail),
        this.appErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(
          this.resetPasswordConfirmationMapper,
        ),
      );
  }

  /**
   * Changes password of current user.
   * @param data Data required for password changing.
   */
  public changePassword(data: PasswordChange): Observable<void> {
    return this.httpClient.post<SuccessResponseDto>(
      this.apiUrlsConfig.user.changePassword,
      this.passwordChangeMapper.toDto(data),
    )
      .pipe(
        map(() => undefined),
        this.appErrorMapper.catchHttpErrorToAppErrorWithValidationSupport(
          this.passwordChangeMapper,
        ),
      );
  }
}
