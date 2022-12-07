import { Injectable } from '@angular/core';

import { EntityValidationErrors } from '../../models/app-error';
import { PasswordReset } from '../../models/password-reset';

import { PasswordResetDto } from './dto/password-reset.dto';
import { ValidationErrorDto } from './dto/validation-error.dto';
import { extractErrorMessage } from './extract-error-message';
import { IMapperToDto, IValidationErrorMapper } from './mappers';

/** Mapper for reset password data. */
@Injectable({ providedIn: 'root' })
export class ResetPasswordConfirmationMapper
implements
    IMapperToDto<PasswordResetDto.Confirmation, PasswordReset.Confirmation>,
    IValidationErrorMapper<PasswordResetDto.Confirmation, PasswordReset.Confirmation> {
  /** @inheritdoc */
  public toDto(
    data: PasswordReset.Confirmation,
  ): PasswordResetDto.Confirmation {
    // the key string contains uid + token which is separated by a special symbol
    // example `Mg-asl85g-2bd2acf70e9a300f8e01a5a5f9edef25`, where `Mg` is uid and `asl85g-2bd2acf70e9a300f8e01a5a5f9edef25` is token
    const UID_SEPARATOR = '-';
    const firstSeparatorIndex = data.key.indexOf(UID_SEPARATOR);
    return {
      password: data.password,
      password_confirm: data.passwordConfirmation,
      uid: data.key.slice(0, firstSeparatorIndex),

      // + 1 is to remove the separator from token
      token: data.key.slice(firstSeparatorIndex + 1),
    };
  }

  /** @inheritdoc */
  public validationErrorFromDto(
    errorDto: ValidationErrorDto<PasswordResetDto.Confirmation>,
  ): EntityValidationErrors<PasswordReset.Confirmation> {
    return {
      password:
        extractErrorMessage(errorDto.password) ??
        extractErrorMessage(errorDto.non_field_errors),
      passwordConfirmation: extractErrorMessage(errorDto.password_confirm),
    };
  }
}
