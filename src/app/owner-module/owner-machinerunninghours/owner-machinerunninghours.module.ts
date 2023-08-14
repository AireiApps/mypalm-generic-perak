import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OwnerMachinerunninghoursPageRoutingModule } from "./owner-machinerunninghours-routing.module";

import { OwnerMachinerunninghoursPage } from "./owner-machinerunninghours.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    OwnerMachinerunninghoursPageRoutingModule,
  ],
  declarations: [OwnerMachinerunninghoursPage],
})
export class OwnerMachinerunninghoursPageModule {}
