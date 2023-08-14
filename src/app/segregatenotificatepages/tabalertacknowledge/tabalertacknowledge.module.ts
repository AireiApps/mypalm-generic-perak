import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TabalertacknowledgePageRoutingModule } from "./tabalertacknowledge-routing.module";

import { TabalertacknowledgePage } from "./tabalertacknowledge.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    TabalertacknowledgePageRoutingModule,
  ],
  declarations: [TabalertacknowledgePage],
})
export class TabalertacknowledgePageModule {}
