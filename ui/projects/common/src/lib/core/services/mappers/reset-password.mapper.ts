import { Injectable } from '@angular/core';

import { EntityValidationErrors } from '../../models/app-error';
import { PasswordReset } from '../../models/password-reset';

import { PasswordResetDto } from './dto/password-reset.dto';
import { ValidationErrorDto } from './dto/validation-error.dto';
import { extractErrorMessage } from './extract-error-message';
import { IMapperToDto, IValidationErrorMapper } from './mappers';

/** Mapper for reset password data. */
@Injectable({ providedIn: 'root' })
export class ResetPasswordMapper
implements
    IMapperToDto<PasswordReset.Data, PasswordResetDto.Data>,
    IValidationErrorMapper<PasswordReset.Data, PasswordResetDto.Data> {
  /** @inheritdoc */
  public toDto(data: PasswordResetDto.Data): PasswordReset.Data {
    return {
      email: data.email,
    };
  }

  /** @inheritdoc */
  public validationErrorFromDto(
    errorDto: ValidationErrorDto<PasswordReset.Data>,
  ): EntityValidationErrors<PasswordResetDto.Data> {
    return {
      email:
        extractErrorMessage(errorDto.email) ??
        extractErrorMessage(errorDto.non_field_errors),
    };
  }
}
