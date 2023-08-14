import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OwnerStatisticsPageRoutingModule } from './owner-statistics-routing.module';

import { OwnerStatisticsPage } from './owner-statistics.page';

import { TranslateModule } from "@ngx-translate/core";

import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    NgApexchartsModule,
    OwnerStatisticsPageRoutingModule
  ],
  declarations: [OwnerStatisticsPage]
})
export class OwnerStatisticsPageModule {}
