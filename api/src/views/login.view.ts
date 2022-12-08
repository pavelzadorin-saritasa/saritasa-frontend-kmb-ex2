import { AuthDTO } from '../dto/auth.dto';
import { UserSecretDto } from '../dto/user-secret.dto';
import { User } from '../models/user';
import { ViewDef } from '../utils/types/view-def';

export const LoginView: ViewDef = async (reqBody) => {
  if (!reqBody) {
    return null;
  }

  const authDto = JSON.parse(reqBody) as AuthDTO;

  const user = await User.findByEmail(authDto.email);
  if (user && user.password === authDto.password) {
    const secret: UserSecretDto = {
      token: 'TOP-SECRET-STRING',
    }
    return JSON.stringify(secret);
  }

  return null;
}
