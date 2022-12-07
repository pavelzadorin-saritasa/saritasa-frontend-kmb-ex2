import { createRoutingFactory, Spectator } from '@ngneat/spectator';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;

  const createSpectator = createRoutingFactory({
    component: AppComponent,
  });

  beforeEach(() => {
    spectator = createSpectator();
  });

  it('should create the app', () => {
    const app = spectator.component;
    expect(app).toBeTruthy();
  });
});
