import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DooropenlaterUpdateModalPageRoutingModule } from "./dooropenlater-update-modal-routing.module";

import { DooropenlaterUpdateModalPage } from "./dooropenlater-update-modal.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    DooropenlaterUpdateModalPageRoutingModule,
  ],
  declarations: [DooropenlaterUpdateModalPage],
})
export class DooropenlaterUpdateModalPageModule {}
