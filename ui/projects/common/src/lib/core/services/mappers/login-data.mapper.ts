import { Injectable } from '@angular/core';

import { EntityValidationErrors } from '../../models/app-error';
import { Login } from '../../models/login';

import { LoginDto } from './dto/login.dto';
import { ValidationErrorDto } from './dto/validation-error.dto';
import { extractErrorMessage } from './extract-error-message';
import { IMapperToDto, IValidationErrorMapper } from './mappers';

/** Login data mapper. */
@Injectable({
  providedIn: 'root',
})
export class LoginDataMapper
implements
    IMapperToDto<LoginDto, Login>,
    IValidationErrorMapper<LoginDto, Login> {
  /** @inheritdoc */
  public validationErrorFromDto(
    errorDto: ValidationErrorDto<LoginDto> | null | undefined,
  ): EntityValidationErrors<Login> {
    return {
      email: extractErrorMessage(errorDto?.email),
      password:
        extractErrorMessage(errorDto?.password) ??
        extractErrorMessage(errorDto?.non_field_errors),
    };
  }

  /** @inheritdoc */
  public toDto(data: Login): LoginDto {
    return data;
  }
}
