import { query } from "../core/repository.service";

/** Application user representation. */
export class User {

  /** Uniq user ID. */
  id: number;

  /** User email. */
  email: string;

  /** Password for auth to app. */
  password: string;

  /** First name. */
  firstName: string;

  /** Last name. */
  lastName: string;

  /** @constructor */
  public constructor(data: User) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }

  /**
   * Map DB instance to model entity.
   */
  static mapDbToModel(dbItem: any) {
    return {
      id: dbItem.id,
      email: dbItem.email,
      password: dbItem.password,
      firstName: dbItem.first_name,
      lastName: dbItem.last_name
    } as User;
  }
  
  /**
   * Find User instance by email.
   * @param email User email.
   * @returns User instance.
   */
  static async findByEmail(email: string) {
    const res = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (res.length > 0) {
      return new User(User.mapDbToModel(res[0]));
    }

    return null;
  }
}
