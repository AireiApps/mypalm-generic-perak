import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeighbridgeHomeScreenPageRoutingModule } from './weighbridge-home-screen-routing.module';

import { WeighbridgeHomeScreenPage } from './weighbridge-home-screen.page';

import { Ng2SearchPipeModule } from "ng2-search-filter";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    TranslateModule,
    ReactiveFormsModule,
    WeighbridgeHomeScreenPageRoutingModule
  ],
  declarations: [WeighbridgeHomeScreenPage]
})
export class WeighbridgeHomeScreenPageModule {}
