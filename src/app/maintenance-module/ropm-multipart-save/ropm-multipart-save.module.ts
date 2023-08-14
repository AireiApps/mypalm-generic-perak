import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { RopmMultipartSavePageRoutingModule } from "./ropm-multipart-save-routing.module";

import { RopmMultipartSavePage } from "./ropm-multipart-save.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    RopmMultipartSavePageRoutingModule,
  ],
  declarations: [RopmMultipartSavePage],
})
export class RopmMultipartSavePageModule {}
