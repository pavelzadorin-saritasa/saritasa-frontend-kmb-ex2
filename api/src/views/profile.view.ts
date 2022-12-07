import { User } from '../models/user';
import { ViewDef } from '../utils/types/view-def';

export const ProfileView: ViewDef = async () => {
  const user = await User.find(1);
  if (!user) {
    return null;
  }

  return JSON.stringify(user);
}
