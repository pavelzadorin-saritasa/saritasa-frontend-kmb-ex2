import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { User } from '@eu/common/core/models/user';
import { createObserverSpy } from '@eu/common/testing/utils';
import { BehaviorSubject, Observer, of } from 'rxjs';

import { AppError } from '../models/app-error';
import { Login } from '../models/login';
import { UserSecret } from '../models/user-secret';

import { AuthApiService } from './auth-api.service';
import { UserMapper } from './mappers/user.mapper';
import { UserApiService } from './user-api.service';
import { UserSecretStorageService } from './user-secret-storage.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let spectator: SpectatorService<UserService>;
  let authServiceSpy: SpyObject<AuthApiService>;
  let userSecretStorageSpy: SpyObject<UserSecretStorageService>;
  let userSecretSubject: BehaviorSubject<UserSecret | null>;
  let observer: jasmine.SpyObj<Observer<unknown>>;

  const createService = createServiceFactory({
    service: UserService,
    mocks: [
      AuthApiService,
      UserMapper,
      UserApiService,
    ],
  });

  beforeEach(() => {
    observer = createObserverSpy();
    userSecretSubject = new BehaviorSubject<UserSecret | null>(null);
    spectator = createService({
      providers: [
        mockProvider(UserSecretStorageService, {
          currentSecret$: userSecretSubject,
        }),
      ],
    });
    authServiceSpy = spectator.inject(AuthApiService);
    userSecretStorageSpy = spectator.inject(UserSecretStorageService);
  });

  describe('.login(x)', () => {
    const loginDummyData: Login = {
      email: 'test@test.com',
      password: '12341234',
    };

    beforeEach(() => {
      const userDummy: User = { firstName: 'first-name', id: 1, lastName: 'last-name' };
      authServiceSpy.login.and.returnValue(of(undefined));
      userSecretStorageSpy.saveSecret.and.returnValue(of(undefined));
      spectator.inject(UserApiService).getCurrentUser.and.returnValue(of(userDummy));

      spectator.service.login(loginDummyData).subscribe(observer);
      userSecretSubject.next({ token: '123123' });
    });

    it('emits and completes', () => {
      expect(observer.next).toHaveBeenCalled();
      expect(observer.complete).toHaveBeenCalled();
    });

    it('saves user secret', () => {
      expect(userSecretStorageSpy.saveSecret).toHaveBeenCalled();
    });
  });

  describe('.logout(x)', () => {
    it('removes the secret from storage', () => {
      userSecretStorageSpy.removeSecret.and.returnValue(of(undefined));

      spectator.service.logout().subscribe(observer);

      expect(observer.next).toHaveBeenCalledOnceWith(undefined);
      expect(observer.complete).toHaveBeenCalledOnceWith();
      expect(userSecretStorageSpy.removeSecret).toHaveBeenCalled();
    });
  });

  describe('.refreshSecret(x)', () => {
    describe('without initial user secret', () => {
      it('calls .logout(x)', () => {
        spectator.service.logout = jasmine.createSpy('logout').and.returnValue(of(undefined));

        spectator.service.refreshSecret().subscribe(observer);

        expect(spectator.service.logout).toHaveBeenCalled();
        expect(observer.error).toHaveBeenCalledOnceWith(jasmine.any(AppError));
      });
    });

    describe('with initial user secret', () => {
      beforeEach(() => {
        const userSecretDummy: UserSecret = { token: 'testing-123' };
        userSecretSubject.next({ token: 'dummy-initial-secret-token' });
        authServiceSpy.refreshSecret.and.returnValue(of(userSecretDummy));
        userSecretStorageSpy.saveSecret.and.returnValue(of(undefined));

        spectator.service.refreshSecret().subscribe(observer);
      });

      it('emits and completes', () => {
        expect(observer.next).toHaveBeenCalledOnceWith(undefined);
        expect(observer.complete).toHaveBeenCalledOnceWith();
      });

      it('refreshes the secret', () => {
        expect(authServiceSpy.refreshSecret).toHaveBeenCalled();
      });

      it('saves refreshed secret to storage', () => {
        expect(userSecretStorageSpy.saveSecret).toHaveBeenCalled();
      });
    });
  });

  describe('.resetPassword(x)', () => {
    it('resets password', () => {
      authServiceSpy.resetPassword.and.returnValue(of(undefined));

      spectator.service.resetPassword({ email: 'test@test.com ' }).subscribe(observer);

      expect(observer.next).toHaveBeenCalledOnceWith(undefined);
      expect(observer.complete).toHaveBeenCalled();
    });
  });

  describe('.confirmPasswordReset(x)', () => {
    it('completes', () => {
      authServiceSpy.confirmPasswordReset.and.returnValue(of(undefined));

      spectator.service.confirmPasswordReset({
        key: '123123 123 123',
        password: '123123123',
        passwordConfirmation: '123123123',
      }).subscribe(observer);

      expect(observer.next).toHaveBeenCalledOnceWith(undefined);
      expect(observer.complete).toHaveBeenCalled();
    });
  });
});
