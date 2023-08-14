import { Component, OnInit, ViewChild } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
} from "@ionic/angular";
import { MaintenanceServiceService } from "src/app/services/maintenance-serivce/maintenance-service.service";
import * as moment from "moment";

// Custom Date Picker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { Plugins } from "@capacitor/core";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-popup-replacement-extendedhours-update",
  templateUrl: "./popup-replacement-extendedhours-update.page.html",
  styleUrls: ["./popup-replacement-extendedhours-update.page.scss"],
})
export class PopupReplacementExtendedhoursUpdatePage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  assignForm;

  params;

  // Variables
  title = "";
  getstationname = "";
  getmachinename = "";
  getpartname = "";
  getlifetimerunninghours = "";
  getcurrentrunninghours = "";
  getextendedmaximumrunninghours = "";
  confirmDisable = false;

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private router: Router,
    private alertController: AlertController,
    public modalController: ModalController,
    public activitymodalController: ModalController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private commonservice: AIREIService,
    private maintenanceservice: MaintenanceServiceService
  ) {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.modalController.getTop().then((modal) => {
        if (modal != null) {
          return;
        } // Don't go back if there's a modal opened
      });
    });

    let viewform = navParams.get("item");
    this.params = JSON.parse(viewform);

    this.title = "ID: " + navParams.get("id");
    this.getstationname = navParams.get("station");
    this.getmachinename = navParams.get("machine");
    this.getpartname = this.params.partname;
    this.getlifetimerunninghours = this.params.maximumrunninghours;
    this.getcurrentrunninghours = this.params.currentrunninghours;
    this.getextendedmaximumrunninghours =
      this.params.extendedmaximumrunninghours;

    if (
      this.getextendedmaximumrunninghours == "" ||
      typeof this.getextendedmaximumrunninghours == "undefined" ||
      this.getextendedmaximumrunninghours == null
    ) {
      this.getextendedmaximumrunninghours = "";
    }

    //console.log(this.params);

    this.assignForm = this.fb.group({
      txt_extendlifetimehours: new FormControl(
        this.getextendedmaximumrunninghours
      ),
    });
  }

  ngOnInit() {}

  btn_save() {
    if (
      this.assignForm.value.txt_extendlifetimehours == 0 ||
      this.assignForm.value.txt_extendlifetimehours == "" ||
      typeof this.assignForm.value.txt_extendlifetimehours == "undefined" ||
      this.assignForm.value.txt_extendlifetimehours == null
    ) {
      this.commonservice.presentToast(
        this.translate.instant(
          "PREVENTIVEMAINTENANCEASSIGN.extendhoursmandatory"
        )
      );
      return;
    }

    this.modalController.dismiss({
      dismissed: true,
      extendedrunninghours: this.assignForm.value.txt_extendlifetimehours,
    });
  }

  numberFilter(event: any) {
    const reg = /^[1-9][0-9]{0,5}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  parseString(item) {
    return JSON.stringify(item);
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      extendedrunninghours: "",
    });
  }
}
