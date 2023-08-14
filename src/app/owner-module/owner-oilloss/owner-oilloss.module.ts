import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OwnerOillossPageRoutingModule } from "./owner-oilloss-routing.module";

import { OwnerOillossPage } from "./owner-oilloss.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    OwnerOillossPageRoutingModule,
  ],
  declarations: [OwnerOillossPage],
})
export class OwnerOillossPageModule {}
