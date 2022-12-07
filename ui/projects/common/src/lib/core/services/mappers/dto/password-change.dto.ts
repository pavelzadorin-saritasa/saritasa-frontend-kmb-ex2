/** Change password dto. */
export interface PasswordChangeDto {

  /** Old password. */
  readonly old_password: string;

  /** New password. */
  readonly new_password: string;

  /** Password that should duplicate new password. */
  readonly new_password_confirm: string;
}
