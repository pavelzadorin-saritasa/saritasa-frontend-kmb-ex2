export namespace PasswordResetDto {

  /** Data required to restore the password. */
  export interface Data {

    /** Email to sent link for reset password. */
    readonly email: string;
  }

  /** Reset password confirmation dto. */
  export interface Confirmation {

    /** Password. */
    readonly password: string;

    /** Password confirmation. */
    readonly password_confirm: string;

    /** Unique user id. */
    readonly uid: string;

    /** Public token for changing the password. */
    readonly token: string;
  }

}
