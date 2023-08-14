import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OillossReportsPageRoutingModule } from './oilloss-reports-routing.module';

import { OillossReportsPage } from './oilloss-reports.page';

import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    OillossReportsPageRoutingModule
  ],
  declarations: [OillossReportsPage]
})
export class OillossReportsPageModule {}
