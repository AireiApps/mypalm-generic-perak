import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProductionFfbcagePageRoutingModule } from "./production-ffbcage-routing.module";

import { ProductionFfbcagePage } from "./production-ffbcage.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    ProductionFfbcagePageRoutingModule,
  ],
  declarations: [ProductionFfbcagePage],
})
export class ProductionFfbcagePageModule {}
