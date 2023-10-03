import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  FormGroup,
} from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, AlertController, IonList } from "@ionic/angular";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

// Custom Datepicker
import { Plugins } from "@capacitor/core";

import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

// Modal Pages - Start
import { PopupNotificationViewPage } from "src/app/supervisor-module/popup-notification-view/popup-notification-view.page";
// Modal Pages - End

@Component({
  selector: "app-abnormal-report-screen",
  templateUrl: "./abnormal-report-screen.page.html",
  styleUrls: ["./abnormal-report-screen.page.scss"],
})
export class AbnormalReportScreenPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  millcode = this.userlist.millcode;

  notificationReportForm;

  designationid = this.userlist.desigId;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  //fromdate = moment(new Date().toISOString()).format("DD-MM-YYYY");
  //todate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  fromdate = "";
  todate = "";
  partdefect = "(1).CYCLO DRIVE GEARBOX 3.77 RATIO\r\n(2).1.5KW 3PASE MOTOR";

  notificationlistArr = [];
  stationArr = [];
  stationid = 0;
  stationname = "";
  enableflag = false;
  public stationOptions: any = {
    header: this.translate.instant("REPORTCORRECTIVEMAINTENANCE.station"),
    cssClass: "multiselect",
  };
  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private router: Router,
    private screenOrientation: ScreenOrientation,
    private fb: FormBuilder,
    private service: SupervisorService
  ) {
    this.notificationReportForm = this.fb.group({
      from_date: new FormControl(""),
      to_date: new FormControl(""),
      station_name: new FormControl("", Validators.required),
    });

    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getNotification();
    this.getStation();
  }

  ngOnDestroy() {
    this.screenOrientation.unlock();
    this.screenOrientation.lock(
      this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
    );
  }

  openFromDateTimePicker() {
    DatePicker.present({
      mode: "date",
      format: "dd-MM-yyyy",
      date: this.fromdate,
      max: this.currentdate,
      theme: "dark",
      doneText: this.translate.instant("GENERALBUTTON.done"),
      cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
    }).then(
      (val) => {
        if (val.value) {
          this.fromdate = val.value;
          this.notificationReportForm.controls.from_date.setValue(
            this.fromdate
          );
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  openToDateTimePicker() {
    DatePicker.present({
      mode: "date",
      format: "dd-MM-yyyy",
      date: this.todate,
      max: this.currentdate,
      theme: "dark",
      doneText: this.translate.instant("GENERALBUTTON.done"),
      cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
    }).then(
      (val) => {
        if (val.value) {
          this.todate = val.value;
          this.notificationReportForm.controls.to_date.setValue(this.todate);
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  getStation() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.service.getStationList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.stationArr = resultdata.data;
      } else {
        this.stationArr = [];
      }
    });
  }

  stationtypehandleChange(e) {
    let value = e.detail.value;

    console.log(value);

    if (value.length > 0) {
      this.stationid = JSON.parse(value).station_id;
      this.stationname = JSON.parse(value).station_name;
      this.getNotification();
    } else {
      this.stationid = 0;
      this.stationname = "";

      this.getNotification();
    }
  }

  getNotification() {
    let getfromdate;
    let gettodate;
    //let station_id;

    if (this.fromdate != "" || this.todate != "") {
      getfromdate = moment(this.fromdate, "DD-MM-YYYY").format("YYYY-MM-DD");
      gettodate = moment(this.todate, "DD-MM-YYYY").format("YYYY-MM-DD");
    } else {
      getfromdate = "";
      gettodate = "";
    }

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      fromdate: getfromdate,
      todate: gettodate,
      language: this.languageService.selected,
      stationid: this.stationid,
    };

    console.log(req);

    this.service.getAbnormalReport(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (this.fromdate == "" || this.todate == "") {
        this.fromdate = moment(resultdata.Fromdate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );
        this.notificationReportForm.controls.from_date.setValue(this.fromdate);
        this.todate = moment(resultdata.Todate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );
        this.notificationReportForm.controls.to_date.setValue(this.todate);
      }
      if (resultdata.httpcode == 200) {
        this.notificationlistArr = resultdata.data;
        this.enableflag = false;
      } else {
        this.notificationlistArr = [];
        this.enableflag = true;
      }
    });
  }

  parseString(item) {
    return JSON.stringify(item);
  }
  getStatusTextColor(status) {
    let color;

    if (status == "1") {
      color = "#cb4335";
    }

    if (status == "2") {
      color = "#ff9f0c";
    }

    if (status == "3") {
      color = "#ff9f0c";
    }

    if (status == "4") {
      color = "#9b59b6";
    }

    if (status == "5") {
      color = "#f39c12";
    }

    if (status == "6") {
      color = "#007bb3";
    }

    if (status == "7") {
      color = "#008000";
    }

    if (status == "8") {
      color = "#616161";
    }

    if (status == "9") {
      color = "#e74c3c";
    }

    if (status == "10") {
      color = "#01b800";
    }

    if (status == "12") {
      color = "#f36311";
    }

    return color;
  }
  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
  async callmodalcontroller(value) {
    let module;
    if (value.notification_type == "1") {
      module = "CMVIEW";
    } else {
      if (value.is_running == "0") {
        module = "RoPMVIEW";
      } else {
        module = "RePMVIEW";
      }
    }
    const modal = await this.modalController.create({
      component: PopupNotificationViewPage,
      componentProps: {
        item: JSON.stringify(value),
        module: module,
        screen: "Abnormal",
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ["acknowledgement-modal"],
    });

    modal.onDidDismiss().then((data) => {});

    return await modal.present();
  }
}
