/** Error returned by API. */
export interface ApiError<TDto = unknown> {

  // TODO (template preparation): Check that API sends you an error with the same field (detail, data, etc.) and change it if it's needed.
  /** Validation data. May not be present in case the error is not related to provided data. */
  readonly data?: ValidationErrorDto<TDto>;

  /** Human-readable description of an error. */
  readonly detail: string;
}

/**
 * Validation error DTO.
 * If a property has primitive type (number, string), then errors - is an array of strings.
 * If a property is an object, then errors is an array of strings if property is null but required e.g.
 * Or is nested ValidationErrorDto<T> object.
 * If a property is an array, then errors is an object where key is name of property
 * and value is array of errors (index in this array corresponds to index of item in the original array).
 */
export type ValidationErrorDto<T> = {
  [P in keyof T]?: T[P] extends readonly (infer K)[]
    ? ValidationErrorDto<K>
    : T[P] extends Record<string, unknown>
      ? ValidationErrorDto<T[P]> | string[]
      : string[];
} & {

  /**
   * Non field errors.
   */
  // TODO: make this `readonly` after refactoring the validation system
  // eslint-disable-next-line no-restricted-syntax
  readonly non_field_errors?: string[];
};
