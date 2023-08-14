import { Component, OnInit, ViewChild } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
  IonContent,
} from "@ionic/angular";

// Custom Date Picker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { Plugins, KeyboardInfo } from "@capacitor/core";
const { Keyboard } = Plugins;
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";

import { MaintenanceMaterialsearchPage } from "src/app/maintenance-module/maintenance-materialsearch/maintenance-materialsearch.page";

@Component({
  selector: "app-oilloss-recomandation-modal",
  templateUrl: "./oilloss-recomandation-modal.page.html",
  styleUrls: ["./oilloss-recomandation-modal.page.scss"],
})
export class OillossRecomandationModalPage implements OnInit {
  @ViewChild("pageBottom") pageBottom: IonContent;
  @ViewChild("breakdowncausesSelect", { static: false })
  breakdowncausesRef: IonSelect;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  breakdownForm;

  params;
  module = "";
  title = "";
  time = "";
  predicteddata = "";
  recommendationArr = [];
  reasonArr = [];
  generalArr = [];
  reasonflag = false;
  type = "";

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private alertController: AlertController,
    public modalController: ModalController,
    public partmodalController: ModalController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private commonservice: AIREIService,
    private supervisorservice: SupervisorService
  ) {
    let viewform = navParams.get("item");
    this.params = JSON.parse(viewform);
    this.type = navParams.get("type");

    console.log(this.params.reasons);
    if (this.type == "reason") {
      this.reasonflag = true;
      this.reasonArr = this.params.reasons;
    } else {
      this.reasonflag = false;
      this.recommendationArr = this.params.actions;
    }
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    //this.getBreakdown();
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  parseString(item) {
    return JSON.stringify(item);
  }
}
