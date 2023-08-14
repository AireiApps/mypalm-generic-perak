import { Component, OnInit, NgZone } from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AIREIService } from "src/app/api/api.service";
import { SupervisorService } from "../../services/supervisor-service/supervisor.service";
import { Platform, ModalController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { FormBuilder, FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

import { PressingsterilizerstationImageSliderPage } from "src/app/supervisor-module/pressingsterilizerstation-image-slider/pressingsterilizerstation-image-slider.page";

// Custom Datepicker
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;
import { LanguageService } from "src/app/services/language-service/language.service";

@Component({
  selector: "app-tab-pressstation-report",
  templateUrl: "./tab-pressstation-report.page.html",
  styleUrls: ["./tab-pressstation-report.page.scss"],
})
export class TabPressstationReportPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  mill_name = this.nl2br(this.userlist.millname);

  count = 0;
  pendingcount = 0;
  pendingcountlength = 0;

  pressstationreportForm;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  getDate;

  reportdate = "";

  norecordsflag = false;
  pleasewaitflag = false;

  pressstationhourlyperformanceArr = [];

  getplatform: string;

  constructor(
    private platform: Platform,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private screenOrientation: ScreenOrientation,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private service: SupervisorService
  ) {
    this.pressstationreportForm = this.fb.group({
      pickdate: new FormControl(""),
    });

    this.activatedroute.params.subscribe((val) => {
      if (this.platform.is("android")) {
        this.getplatform = "android";
      } else if (this.platform.is("ios")) {
        this.getplatform = "ios";
      }

      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );

      this.reportdate = "";

      this.getreport();
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    //this.getreport();
  }

  ionViewDidEnter() {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();
  }

  ngOnDestroy() {
    this.screenOrientation.unlock();
    this.screenOrientation.lock(
      this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
    );
  }

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem("badge_count"));
    });
  }

  getLiveNotification() {
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        this.updateNotification();
      }
    );
  }

  btn_notification() {
    localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);
  }

  getProductionPendingCount() {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    console.log(req);

    this.commonservice.getmaintenancependingcount(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.pendingcount = resultdata.count;
        this.pendingcountlength = this.pendingcount.toString().length;
      } else {
        this.pendingcount = 0;
        this.pendingcountlength = this.pendingcount.toString().length;
      }
    });
  }

  openDateTimePicker() {
    DatePicker.present({
      mode: "date",
      format: "dd-MM-yyyy",
      date: this.reportdate,
      max: this.currentdate,
      theme: "dark",
      doneText: this.translate.instant("GENERALBUTTON.done"),
      cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
    }).then(
      (val) => {
        if (val.value) {
          this.reportdate = val.value;
          this.pressstationreportForm.controls.pickdate.setValue(
            this.reportdate
          );
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  async btn_ViewImages(
    temperatureimages,
    motorimages,
    levelimages,
    digestorimages,
    pressmotorimages,
    fibreflowimages,
    hydraulicpressureimages
  ) {
    if (
      temperatureimages != "" ||
      motorimages != "" ||
      levelimages != "" ||
      digestorimages != "" ||
      pressmotorimages != "" ||
      fibreflowimages != "" ||
      hydraulicpressureimages != ""
    ) {
      /*this.screenOrientation.unlock();
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );*/

      const modal = await this.modalController.create({
        component: PressingsterilizerstationImageSliderPage,
        componentProps: {
          from: "Press",
          temperatureitem: temperatureimages,
          motoritem: motorimages,
          levelitem: levelimages,
          digestoritem: digestorimages,
          pressmotoritem: pressmotorimages,
          fibreflowitem: fibreflowimages,
          hydraulicpressureitem: hydraulicpressureimages,
        },
      });

      modal.onDidDismiss().then((data) => {
        /*this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.LANDSCAPE
        );*/
      });

      return await modal.present();
    }
  }

  getreport() {
    if (this.reportdate != "") {
      this.getDate = moment(this.reportdate, "DD-MM-YYYY").format("YYYY-MM-DD");
    } else {
      this.getDate = "";
    }

    this.pressstationhourlyperformanceArr = [];
    this.norecordsflag = false;
    this.pleasewaitflag = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      Fromdate: this.getDate,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.getPressStationvalues(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (this.getDate == "") {
        this.reportdate = moment(resultdata.Fromdate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );

        this.pressstationreportForm.controls.pickdate.setValue(this.reportdate);
      }

      if (resultdata.httpcode == 200) {
        this.pressstationhourlyperformanceArr = resultdata.data;

        this.norecordsflag = false;

        this.pleasewaitflag = false;
      } else {
        this.pressstationhourlyperformanceArr = [];

        this.norecordsflag = true;

        this.pleasewaitflag = false;
      }
    });
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
