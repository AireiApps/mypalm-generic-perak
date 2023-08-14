import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { Platform } from "@ionic/angular";
import { AIREIService } from "src/app/api/api.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { ActivatedRoute, Router } from "@angular/router";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.page.html",
  styleUrls: ["./schedule.page.scss"],
})
export class SchedulePage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  mill_name = this.nl2br(this.userlist.millname);
  user_id = this.userlist.userId;
  departmentid = this.userlist.dept_id;
  designationid = this.userlist.desigId;
  language = this.userlist.language;
  baseurl = this.userlist.report_url;

  count = 0;

  pendingcount = 0;
  pendingcountlength = 0;

  weburl;

  getplatform: string;

  constructor(
    private platform: Platform,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private commonservice: AIREIService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private screenOrientation: ScreenOrientation
  ) {
    this.activatedroute.params.subscribe((val) => {
      if (this.platform.is("android")) {
        this.getplatform = "android";
      } else if (this.platform.is("ios")) {
        this.getplatform = "ios";
      }

      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    //this.getUrl();
  }

  ionViewWillEnter() {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    this.getUrl();
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

      if (
        this.designationid == 2 ||
        this.designationid == 4 ||
        this.designationid == 6
      ) {
        this.getMaintenancePendingCount();
      }
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
    if (this.designationid != 4 && this.designationid != 6) {
      localStorage.setItem("badge_count", "0");
      this.router.navigate(["/segregatenotification"]);
    }

    /*localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);*/
  }

  getMaintenancePendingCount() {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.language,
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

  getUrl() {
    /*let formatedurl =
      this.baseurl +
      "/Maintenance_planning/schedule?mobile=1&user_id=" +
      this.user_id +
      "&language=" +
      this.language;*/

    let formatedurl =
      this.baseurl +
      "/Maintenance_planning/schedule_new?mobile=1&user_id=" +
      this.user_id +
      "&language=" +
      this.language;

    //console.log(formatedurl);

    this.weburl = formatedurl;
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
