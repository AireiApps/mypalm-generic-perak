import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OillossesNewPageRoutingModule } from './oillosses-new-routing.module';

import { OillossesNewPage } from './oillosses-new.page';

import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    OillossesNewPageRoutingModule
  ],
  declarations: [OillossesNewPage]
})
export class OillossesNewPageModule {}
