import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { UpdateExtendedrunninghoursPageRoutingModule } from "./update-extendedrunninghours-routing.module";

import { UpdateExtendedrunninghoursPage } from "./update-extendedrunninghours.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    UpdateExtendedrunninghoursPageRoutingModule,
  ],
  declarations: [UpdateExtendedrunninghoursPage],
})
export class UpdateExtendedrunninghoursPageModule {}
