/** Password change data. */
export interface PasswordChange {

  /** Current password. */
  readonly password: string;

  /** New password. */
  readonly newPassword: string;

  /** New password confirmation. */
  readonly newPasswordConfirmation: string;
}
