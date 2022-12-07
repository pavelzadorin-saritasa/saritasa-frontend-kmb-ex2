import { Location } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { createRoutingFactory, mockProvider, SpectatorRouting } from '@ngneat/spectator';
import { ReplaySubject } from 'rxjs';

import { UserService } from '../services/user.service';

import { UnauthorizedGuard } from './unauthorized.guard';

@Component({})
class FirstDummyComponent {}

@Component({})
class SecondDummyComponent {}

@Component({})
class ThirdDummyComponent {}

@NgModule({
  declarations: [ThirdDummyComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: ThirdDummyComponent,
      },
    ]),
  ],
})
class LazyDummyModule {}

const EMPTY_ROUTE = '';
const SIMPLE_ROUTE = 'route-for-authorized';
const LAZY_ROUTE = 'lazy-route-for-authorized';
const ROOT_ROUTE = '/';

const routes: Routes = [
  {
    path: EMPTY_ROUTE,
    pathMatch: 'full',
    component: FirstDummyComponent,
  },
  {
    path: SIMPLE_ROUTE,
    canActivate: [UnauthorizedGuard],
    component: SecondDummyComponent,
  },
  {
    path: LAZY_ROUTE,
    canLoad: [UnauthorizedGuard],
    loadChildren: () => LazyDummyModule,
  },
];

describe('UnauthorizedGuard', () => {
  let isUserAuthorizedSubject: ReplaySubject<boolean>;
  let location: Location;
  let spectator: SpectatorRouting<FirstDummyComponent>;

  const createSpectator = createRoutingFactory({
    component: FirstDummyComponent,
    declarations: [FirstDummyComponent, SecondDummyComponent],
    stubsEnabled: false,
    routes,
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
    location = spectator.inject(Location);
  });

  describe('when a user is authorized', () => {
    beforeEach(() => {
      isUserAuthorizedSubject.next(true);
    });

    it('allows to proceed to a lazy route', async() => {
      await spectator.router.navigateByUrl(LAZY_ROUTE);

      expect(location.path()).toContain(LAZY_ROUTE);
    });

    it('allows to proceed to a simple route', async() => {
      await spectator.router.navigateByUrl(SIMPLE_ROUTE);

      expect(location.path()).toContain(SIMPLE_ROUTE);
    });
  });

  describe('when a user is not authorized', () => {
    beforeEach(() => {
      isUserAuthorizedSubject.next(false);
    });

    it('does not allow to proceed to a lazy route', async() => {
      await spectator.router.navigateByUrl(LAZY_ROUTE);

      expect(location.path()).toBe(ROOT_ROUTE);
    });

    it('does not allow to proceed to a simple route', async() => {
      await spectator.router.navigateByUrl(SIMPLE_ROUTE);

      expect(location.path()).toBe(ROOT_ROUTE);
    });
  });

});
