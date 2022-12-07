import { Injectable } from '@angular/core';
import { AppConfig } from '@eu/common/core/services/app.config';

/** Represents a global app config for testing environment. */
@Injectable()
export class TestAppConfig extends AppConfig {
  /** @inheritdoc */
  public readonly apiUrl = 'https://some.invalid.route.for.testing.example.com';

  /** @inheritdoc */
  public readonly version = 'test-version-0.0.1';
}
