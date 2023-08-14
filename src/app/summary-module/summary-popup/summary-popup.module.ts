import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SummaryPopupPageRoutingModule } from "./summary-popup-routing.module";

import { SummaryPopupPage } from "./summary-popup.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    SummaryPopupPageRoutingModule,
  ],
  declarations: [SummaryPopupPage],
})
export class SummaryPopupPageModule {}
