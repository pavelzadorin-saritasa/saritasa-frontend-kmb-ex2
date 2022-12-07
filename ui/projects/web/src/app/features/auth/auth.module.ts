import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CommonSharedModule } from '@eu/common/shared/common-shared.module';

import { ConfirmResetPasswordComponent } from './confirm-reset-password/confirm-reset-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'confirm-password', component: ConfirmResetPasswordComponent },
];

/** Authorization module. */
@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    ConfirmResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonSharedModule,
    RouterModule.forChild(routes),
  ],
})
export class AuthModule {}
