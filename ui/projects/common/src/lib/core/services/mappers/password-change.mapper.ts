import { Injectable } from '@angular/core';

import { EntityValidationErrors } from '../../models/app-error';
import { PasswordChange } from '../../models/password-change';

import { PasswordChangeDto } from './dto/password-change.dto';
import { ValidationErrorDto } from './dto/validation-error.dto';
import { extractErrorMessage } from './extract-error-message';
import { IMapperToDto, IValidationErrorMapper } from './mappers';

/**
 * Mapper for change password process.
 */
@Injectable({ providedIn: 'root' })
export class PasswordChangeMapper
implements
    IMapperToDto<PasswordChangeDto, PasswordChange>,
    IValidationErrorMapper<PasswordChangeDto, PasswordChange> {
  /** @inheritdoc */
  public validationErrorFromDto(
    errorDto: ValidationErrorDto<PasswordChangeDto>,
  ): EntityValidationErrors<PasswordChange> {
    return {
      password: extractErrorMessage(errorDto.old_password),
      newPassword: extractErrorMessage(errorDto.new_password),
      newPasswordConfirmation: extractErrorMessage(
        errorDto.new_password_confirm,
      ),
    };
  }

  /** @inheritdoc */
  public toDto(data: PasswordChange): PasswordChangeDto {
    return {
      old_password: data.password,
      new_password: data.newPassword,
      new_password_confirm: data.newPasswordConfirmation,
    };
  }
}
