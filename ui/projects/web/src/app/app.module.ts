import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from '@eu/common/core/interceptors/auth.interceptor';
import { RefreshTokenInterceptor } from '@eu/common/core/interceptors/refresh-token.interceptor';
import { AppConfig } from '@eu/common/core/services/app.config';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebAppConfig } from './features/shared/web-app.config';

const httpInterceptorProviders = [
  // The refresh interceptor should be before the auth interceptor, otherwise refreshed bearer would not be updated
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RefreshTokenInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];

/** Root module. */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    ...httpInterceptorProviders,
    { provide: AppConfig, useClass: WebAppConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
