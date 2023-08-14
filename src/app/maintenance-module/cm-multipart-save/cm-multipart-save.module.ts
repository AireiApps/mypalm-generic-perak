import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CmMultipartSavePageRoutingModule } from "./cm-multipart-save-routing.module";

import { CmMultipartSavePage } from "./cm-multipart-save.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    CmMultipartSavePageRoutingModule,
  ],
  declarations: [CmMultipartSavePage],
})
export class CmMultipartSavePageModule {}
