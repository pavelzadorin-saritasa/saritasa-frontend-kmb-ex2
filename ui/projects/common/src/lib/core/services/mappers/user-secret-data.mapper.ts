import { Injectable } from '@angular/core';

import { UserSecret } from '../../models/user-secret';

import { UserSecretDto } from './dto/user-secret.dto';
import { IMapper } from './mappers';

/** User secret mapper. */
@Injectable({
  providedIn: 'root',
})
export class UserSecretDataMapper
implements IMapper<UserSecretDto, UserSecret> {
  /** @inheritdoc */
  public toDto(data: UserSecret): UserSecretDto {
    return {
      token: data.token,
    };
  }

  /** @inheritdoc */
  public fromDto(dto: UserSecretDto): UserSecret {
    return {
      token: dto.token,
    };
  }
}
