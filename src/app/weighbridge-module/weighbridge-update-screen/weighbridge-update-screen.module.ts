import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeighbridgeUpdateScreenPageRoutingModule } from './weighbridge-update-screen-routing.module';

import { WeighbridgeUpdateScreenPage } from './weighbridge-update-screen.page';

import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    WeighbridgeUpdateScreenPageRoutingModule
  ],
  declarations: [WeighbridgeUpdateScreenPage]
})
export class WeighbridgeUpdateScreenPageModule {}
