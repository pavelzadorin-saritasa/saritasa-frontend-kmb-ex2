import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator';
import { ReplaySubject } from 'rxjs';

import { UserService } from '../services/user.service';

import { AuthorizedGuard } from './authorized.guard';

@Component({})
class FakeComponent {}

@Component({})
class SecondFakeComponent {}

describe('AuthorizedGuard', () => {
  const ROUTE_FOR_UNAUTHORIZED = 'route-for-unauthorized';
  let isUserAuthorizedSubject: ReplaySubject<boolean>;
  let spectator: SpectatorRouting<FakeComponent>;
  const createSpectator = createRoutingFactory({
    component: FakeComponent,
    stubsEnabled: false,
    routes: [
      {
        path: '',
        pathMatch: 'full',
        component: FakeComponent,
      },
      {
        path: ROUTE_FOR_UNAUTHORIZED,
        canActivate: [AuthorizedGuard],
        component: SecondFakeComponent,
      },
    ],
  });

  beforeEach(() => {
    isUserAuthorizedSubject = new ReplaySubject(1);
    spectator = createSpectator({
      providers: [
        mockProvider(UserService, {
          isAuthorized$: isUserAuthorizedSubject,
        }),
      ],
    });
  });

  describe('when user is unauthorized', () => {
    beforeEach(() => {
      isUserAuthorizedSubject.next(false);
    });

    it('allows to proceed to a route', async() => {
      await spectator.router.navigate([`/${ROUTE_FOR_UNAUTHORIZED}`]);

      expect(spectator.inject(Location).path()).toBe(`/${ROUTE_FOR_UNAUTHORIZED}`);
    });
  });

  describe('when a user is authorized', () => {
    beforeEach(() => {
      isUserAuthorizedSubject.next(true);
    });

    it('does not allow proceeding to a route', async() => {
      await spectator.router.navigate([`/${ROUTE_FOR_UNAUTHORIZED}`]);

      expect(spectator.inject(Location).path()).toBe('/');
    });
  });
});
