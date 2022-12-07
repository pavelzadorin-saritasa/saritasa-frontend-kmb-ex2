/** Authorization data interfaces. */
export namespace PasswordReset {

  /** Data required to restore the password. */
  export interface Data {

    /** Email to sent link for reset password. */
    readonly email: string;
  }

  /** Reset password confirmation data. */
  export interface Confirmation {

    /** Password. */
    readonly password: string;

    /** Password confirmation. */
    readonly passwordConfirmation: string;

    /** Public token for changing the password. */
    readonly key: string;
  }
}
