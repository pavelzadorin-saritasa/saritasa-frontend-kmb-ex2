// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { defineGlobalsInjections } from '@ngneat/spectator';
import { AppConfig } from '@eu/common/core/services/app.config';
import { TestAppConfig } from '@eu/common/testing/test-app-config';

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    <T>(id: string): T;
    keys(): string[];
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);

defineGlobalsInjections({
  providers: [{ provide: AppConfig, useClass: TestAppConfig }],
});

// And load the modules.
context.keys().map(context);
