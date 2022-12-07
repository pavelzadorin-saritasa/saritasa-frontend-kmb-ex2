import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonSharedModule } from '@eu/common/shared/common-shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

/** Dashboard module. */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CommonSharedModule,
  ],
})
export class DashboardModule {}
