import { query } from "../core/repository.service";

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  public constructor(data: User) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }

  static mapDbToModel(dbItem: any) {
    return {
      id: dbItem.id,
      email: dbItem.email,
      password: dbItem.password,
      firstName: dbItem.first_name,
      lastName: dbItem.last_name
    } as User;
  }
  
  static async find(id: number) {
    const res = await query('SELECT * FROM users WHERE id = $1', [id.toString()]);
    if (res.length > 0) {
      return new User(User.mapDbToModel(res[0]));
    }

    return null;
  }
}
