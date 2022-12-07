import { Injectable } from '@angular/core';
import { AppConfig } from '@eu/common/core/services/app.config';
import { environment } from 'projects/web/src/environments/environment';

/** App-specific implementation of app config. */
@Injectable()
export class WebAppConfig extends AppConfig {
  /** @inheritdoc */
  public readonly apiUrl: string = environment.apiUrl;

  /** @inheritdoc */
  public readonly version: string = environment.version;
}
