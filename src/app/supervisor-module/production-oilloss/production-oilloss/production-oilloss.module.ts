import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ProductionOillossPageRoutingModule } from "./production-oilloss-routing.module";

import { ProductionOillossPage } from "./production-oilloss.page";

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    ProductionOillossPageRoutingModule,
  ],
  declarations: [ProductionOillossPage],
})
export class ProductionOillossPageModule {}
