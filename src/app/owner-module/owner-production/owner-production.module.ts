import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OwnerProductionPageRoutingModule } from "./owner-production-routing.module";

import { OwnerProductionPage } from "./owner-production.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    OwnerProductionPageRoutingModule,
  ],
  declarations: [OwnerProductionPage],
})
export class OwnerProductionPageModule {}
