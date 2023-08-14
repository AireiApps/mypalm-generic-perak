import { Component, OnInit, NgZone } from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AIREIService } from "src/app/api/api.service";
import { MaintenanceServiceService } from "../../services/maintenance-serivce/maintenance-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { FormBuilder, FormControl } from "@angular/forms";
import { LanguageService } from "src/app/services/language-service/language.service";

import { Platform } from "@ionic/angular";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

@Component({
  selector: "app-tab-laboilloss-report",
  templateUrl: "./tab-laboilloss-report.page.html",
  styleUrls: ["./tab-laboilloss-report.page.scss"],
})
export class TabLaboillossReportPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  mill_name = this.nl2br(this.userlist.millname);
  count = 0;
  pendingcount = 0;
  pendingcountlength = 0;

  oillossesForm;

  currentdate = new Date().toISOString();

  // Variables
  getDate;
  reportdate = "";
  monthlyaverage = "";
  mtd = "";
  oermtdflag = 0;
  oillossesArr = [];
  retrieveflag = false;
  norecordsflag = false;
  pleasewaitflag = false;

  getplatform: string;

  constructor(
    private platform: Platform,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private languageService: LanguageService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private screenOrientation: ScreenOrientation,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private service: MaintenanceServiceService
  ) {
    this.oillossesForm = this.fb.group({
      pickdate: new FormControl(this.reportdate),
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

      PushNotifications.removeAllDeliveredNotifications();

      this.count = parseInt(localStorage.getItem("badge_count"));
      this.notifi.updateNotification();
      this.updateNotification();
      this.getLiveNotification();

      this.getreport();
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {}

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem("badge_count"));

      this.getMaintenancePendingCount();
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

  getMaintenancePendingCount() {
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

  btn_retrieve() {
    this.retrieveflag = true;

    this.getreport();
  }

  btn_back() {
    this.retrieveflag = false;

    this.getreport();
  }

  getreport() {
    //console.log("Date --->" + this.reportdate);

    if (this.reportdate != "") {
      if (this.retrieveflag) {
        this.oillossesForm.controls.pickdate.setValue(this.reportdate);

        this.getDate = moment(this.oillossesForm.value.pickdate).format(
          "YYYY-MM"
        );
      } else {
        this.getDate = "";
      }
    } else {
      this.getDate = "";
    }

    this.oillossesArr = [];
    this.norecordsflag = false;
    this.pleasewaitflag = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      Fromdate: this.getDate,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getoillossesreport(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      this.reportdate = resultdata.Fromdate;

      if (resultdata.httpcode == 200) {
        this.monthlyaverage = resultdata.monthlyaverage;
        this.mtd = resultdata.mtd;
        this.oermtdflag = resultdata.oermtdflag;
        this.oillossesArr = resultdata.data;

        this.norecordsflag = false;

        this.pleasewaitflag = false;
      } else {
        this.monthlyaverage = "";
        this.mtd = "";
        this.oermtdflag = 0;
        this.oillossesArr = [];
        this.norecordsflag = true;
        this.pleasewaitflag = false;
        //this.commonservice.presentToast("No Record Found!");
      }
    });
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
