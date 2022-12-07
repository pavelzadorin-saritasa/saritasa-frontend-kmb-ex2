import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { UserSecret } from '../models/user-secret';

import { StorageService } from './storage.service';

const USER_SECRET_STORAGE_KEY = 'user';

/** User secret storage. */
@Injectable({ providedIn: 'root' })
export class UserSecretStorageService {
  /** Token info for current user. */
  public readonly currentSecret$: Observable<UserSecret | null>;

  public constructor(
    private readonly storageService: StorageService,
  ) {
    this.currentSecret$ = this.storageService.get<UserSecret | null>(USER_SECRET_STORAGE_KEY);
  }

  /**
   * Saves a secret.
   * @param secret Secret to save.
   */
  public saveSecret(
    secret: UserSecret,
  ): Observable<UserSecret> {
    return this.storageService.save(USER_SECRET_STORAGE_KEY, secret).pipe(map(() => secret));
  }

  /** Removes current secret. */
  public removeSecret(): Observable<void> {
    return this.storageService.remove(USER_SECRET_STORAGE_KEY);
  }
}
