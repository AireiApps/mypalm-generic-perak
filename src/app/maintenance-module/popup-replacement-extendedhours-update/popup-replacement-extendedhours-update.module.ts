import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PopupReplacementExtendedhoursUpdatePageRoutingModule } from "./popup-replacement-extendedhours-update-routing.module";

import { PopupReplacementExtendedhoursUpdatePage } from "./popup-replacement-extendedhours-update.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    PopupReplacementExtendedhoursUpdatePageRoutingModule,
  ],
  declarations: [PopupReplacementExtendedhoursUpdatePage],
})
export class PopupReplacementExtendedhoursUpdatePageModule {}
