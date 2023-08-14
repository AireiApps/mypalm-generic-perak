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
import * as moment from "moment";
// Custom Date Picker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { Plugins, KeyboardInfo } from "@capacitor/core";
const { Keyboard } = Plugins;
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";

@Component({
  selector: "app-dooropenlater-update-modal",
  templateUrl: "./dooropenlater-update-modal.page.html",
  styleUrls: ["./dooropenlater-update-modal.page.scss"],
})
export class DooropenlaterUpdateModalPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  dooropenlaterForm;

  // Variables
  params;
  isDisabled = false;

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private alertController: AlertController,
    public modalController: ModalController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private commonservice: AIREIService,
    private supervisorservice: SupervisorService
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

    this.dooropenlaterForm = this.fb.group({
      txt_dooropentime: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {}

  save() {
    if (this.dooropenlaterForm.value.txt_dooropentime == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "HOURLYSTERILIZATIONSTATIONSAVE.dooropentimemandatory"
        )
      );
      return;
    }

    let startdate = new Date(
      moment(this.params.door_shut_time, "DD-MM-YYYY HH:mm").format(
        "YYYY-MM-DD HH:mm"
      )
    );

    let endate = new Date(
      moment(this.dooropenlaterForm.value.txt_dooropentime).format(
        "YYYY-MM-DD HH:mm"
      )
    );

    if (+endate <= +startdate) {
      this.commonservice.presentToast(
        this.translate.instant(
          "HOURLYSTERILIZATIONSTATIONSAVE.doorshutandopentimevalidation"
        )
      );
      return;
    }

    var dooropentime = moment(
      this.dooropenlaterForm.value.txt_dooropentime
    ).format("YYYY-MM-DD HH:mm:00");

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      id: this.params.id,
      door_open_time: dooropentime,
    };

    console.log(req);

    this.supervisorservice.saveDoorOpenTimeLater(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.dooropenlaterForm.reset();

        this.isDisabled = false;

        this.commonservice.presentToast(
          this.translate.instant("HOURLYSTERILIZATIONSTATIONSAVE.success")
        );

        this.modalController.dismiss({
          dismissed: true,
          item: "SAVED",
        });
      } else {
        this.isDisabled = false;

        this.commonservice.presentToast(
          this.translate.instant("HOURLYSTERILIZATIONSTATIONSAVE.failed")
        );
      }
    });
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }
}
