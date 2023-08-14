import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AlertacknowledgePageRoutingModule } from "./alertacknowledge-routing.module";

import { AlertacknowledgePage } from "./alertacknowledge.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    AlertacknowledgePageRoutingModule,
  ],
  declarations: [AlertacknowledgePage],
})
export class AlertacknowledgePageModule {}
