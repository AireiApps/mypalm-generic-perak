import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AIREIService } from "src/app/api/api.service";
import {
  AlertController,
  Platform,
  Animation,
  AnimationController,
  ModalController,
  IonSlides,
} from "@ionic/angular";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

import { Market } from "@ionic-native/market/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";

import { WeighbridgeService } from "src/app/services/weighbridge-service/weighbridge.service";
import { WeighbridgeUpdateReportScreenPage } from "../weighbridge-update-report-screen/weighbridge-update-report-screen.page";
import * as moment from "moment";
// Custom Datepicker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

@Component({
  selector: "app-weighbridge-report-screen",
  templateUrl: "./weighbridge-report-screen.page.html",
  styleUrls: ["./weighbridge-report-screen.page.scss"],
})
export class WeighbridgeReportScreenPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;
  mill_name = this.nl2br(this.userlist.millname);

  count = 0;
  pendingcount = 0;
  pendingcountlength = 0;
  getplatform: string;

  pleasewaitflag = false;
  norecordFlag = false;
  fromdate = "";
  todate = "";
  weighbridgeArr = [];

  filterTerm: string;

  gradingReportForm;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");
  reportdate = "";
  getDate;

  newsize;
  newtotalpage;

  constructor(
    private zone: NgZone,
    private translate: TranslateService,
    private languageService: LanguageService,
    private alertController: AlertController,
    private notifi: AuthGuardService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private commonservice: AIREIService,
    private platform: Platform,
    private appVersion: AppVersion,
    private market: Market,
    private screenOrientation: ScreenOrientation,
    private service: WeighbridgeService,
    public modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.gradingReportForm = this.fb.group({
      from_date: new FormControl(this.currentdate),
      to_date: new FormControl(this.currentdate),
    });

    this.activatedroute.params.subscribe((val) => {
      if (this.platform.is("android")) {
        this.getplatform = "android";
      } else if (this.platform.is("ios")) {
        this.getplatform = "ios";
      }

      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );

      this.fromdate = "";
      this.todate = "";

      this.getWeighbridgeReportDetails();
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    //this.forceUpdated();
  }

  ionViewDidEnter() {
    PushNotifications.removeAllDeliveredNotifications();
    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    this.getWeighbridgeReportDetails();
  }

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem("badge_count"));

      this.getPendingCount();
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

  getPendingCount() {
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
          this.gradingReportForm.controls.from_date.setValue(this.fromdate);
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
          this.gradingReportForm.controls.to_date.setValue(this.todate);
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  getWeighbridgeReportDetails() {
    let getfromdate;
    let gettodate;

    if (this.fromdate != "" || this.todate != "") {
      getfromdate = moment(this.fromdate, "DD-MM-YYYY").format("YYYY-MM-DD");
      gettodate = moment(this.todate, "DD-MM-YYYY").format("YYYY-MM-DD");
    } else {
      getfromdate = "";
      gettodate = "";
    }

    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      fromdate: getfromdate,
      todate: gettodate,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getweighbridgereportdetails(req).then((result) => {
      let resultdata: any;
      resultdata = result;

      if (this.fromdate == "" || this.todate == "") {
        this.fromdate = moment(resultdata.Fromdate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );

        this.gradingReportForm.controls.from_date.setValue(this.fromdate);

        this.todate = moment(resultdata.Todate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );

        this.gradingReportForm.controls.to_date.setValue(this.todate);
      }

      if (resultdata.httpcode == 200) {
        this.weighbridgeArr = resultdata.data;
        this.pleasewaitflag = false;
        this.norecordFlag = false;
      } else {
        this.pleasewaitflag = false;
        this.norecordFlag = true;
      }
    });
  }
  async btn_Edit(value) {
    const rampeditmodal = await this.modalController.create({
      component: WeighbridgeUpdateReportScreenPage,
      componentProps: {
        item: JSON.stringify(value),
        module: "REPORT SCREEN",
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ["weighbridgepopup-modal"],
    });

    rampeditmodal.onDidDismiss().then((modeldata) => {
      let getdata = modeldata["data"]["item"];

      if (getdata != "") {
        this.getWeighbridgeReportDetails();
      }
    });

    return await rampeditmodal.present();
  }
  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
