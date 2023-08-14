import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { RepmMultipartSavePageRoutingModule } from "./repm-multipart-save-routing.module";

import { RepmMultipartSavePage } from "./repm-multipart-save.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    RepmMultipartSavePageRoutingModule,
  ],
  declarations: [RepmMultipartSavePage],
})
export class RepmMultipartSavePageModule {}
