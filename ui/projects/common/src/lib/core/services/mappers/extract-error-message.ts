import { ValidationErrorDto } from './dto/validation-error.dto';

/**
 * Extract errors message from error data.
 * @param errorData Error data.
 * @returns The first item if error data is a array of error messages.
 * Error message from non_field_errors if it presented.
 * Error message of the first key if error data is error for composite object like City: { id, name }.
 */
export function extractErrorMessage<T>(errorData?: ValidationErrorDto<T> | string[]): string | undefined {
  // TODO (template preparation): Add current API-specific way to extract validation data.

  if (errorData == null) {
    return undefined;
  }

  if (Array.isArray(errorData)) {
    return extractErrorMessageFromArray(errorData);
  }

  if (errorData.non_field_errors != null) {
    return extractErrorMessageFromArray(errorData.non_field_errors);
  }

  // Otherwise extract an error from first property.
  const firstValidationErrorData = Object.values(errorData)[0];

  return extractErrorMessage(firstValidationErrorData);
}

/**
 * Extracts a string error from an array of errors.
 * @param errors Errors array.
 * @returns Extracted error string.
 */
function extractErrorMessageFromArray(errors: readonly string[]): string {
  if (typeof errors[0] !== 'string') {
    throw new Error('Got invalid error data, unable to map it');
  }

  return errors[0];
}
