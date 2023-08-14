import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OillossRecomandationModalPageRoutingModule } from './oilloss-recomandation-modal-routing.module';

import { OillossRecomandationModalPage } from './oilloss-recomandation-modal.page';

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    OillossRecomandationModalPageRoutingModule
  ],
  declarations: [OillossRecomandationModalPage]
})
export class OillossRecomandationModalPageModule {}
