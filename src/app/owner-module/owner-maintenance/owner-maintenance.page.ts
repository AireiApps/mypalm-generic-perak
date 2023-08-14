import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { App, AppState } from "@capacitor/core";
import { ActivatedRoute, Router } from "@angular/router";
import { appsettings } from "src/app/appsettings";
import {
  ModalController,
  AlertController,
  Platform,
  Animation,
  AnimationController,
} from "@ionic/angular";
import * as moment from "moment";
import { OwnerserviceService } from "src/app/services/owner-service/ownerservice.service";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

import { Market } from "@ionic-native/market/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

@Component({
  selector: "app-owner-maintenance",
  templateUrl: "./owner-maintenance.page.html",
  styleUrls: ["./owner-maintenance.page.scss"],
})
export class OwnerMaintenancePage implements OnInit {
  @ViewChild("myElementRef", { static: false }) myElementRef: ElementRef;
  ownermaintenanceForm;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  usermillcode = this.userlist.millcode;
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;
  mill_name = this.nl2br(this.userlist.millname);

  count = 0;
  productioncount = 0;
  productioncountlength = 0;

  maintenancecount = 0;
  maintenancecountlength = 0;

  tabs_segment = "";
  secondtabs_segment = "";

  getplatform: string;

  correctivemaintenanceArr = [
    /*{
      title: "Created",
      position: "1",
      value: "10",
    },

    {
      title: "InProgress",
      position: "2",
      value: "4",
    },

    {
      title: "Completed",
      position: "3",
      value: "6",
    },*/
  ];

  routinepreventivemaintenanceArr = [];
  replacementpreventivemaintenanceArr = [];

  pleasewaitflag = false;

  getscreenorientation = "landscape";

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private zone: NgZone,
    public modalController: ModalController,
    private alertController: AlertController,
    private notifi: AuthGuardService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private commonservice: AIREIService,
    private fb: FormBuilder,
    private service: OwnerserviceService,
    private platform: Platform,
    private appVersion: AppVersion,
    private market: Market,
    private animationCtrl: AnimationController,
    private screenOrientation: ScreenOrientation
  ) {
    this.getscreenorientation = this.screenOrientation.type;

    this.tabs_segment = "CorrectiveMaintenance";
    this.secondtabs_segment = "Routine";

    this.activatedroute.params.subscribe((val) => {
      if (this.platform.is("android")) {
        this.getplatform = "android";
      } else if (this.platform.is("ios")) {
        this.getplatform = "ios";
      }

      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );

      this.getNotificationCount();
    });
  }

  ngOnInit() {
    App.addListener("appStateChange", (state: AppState) => {
      if (state.isActive == true) {
        if (this.router.url == "/tabs/tabmaintenance") {
          this.getNotificationCount();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    /*const animation: Animation = this.animationCtrl
      .create()
      .addElement(this.myElementRef.nativeElement)
      .duration(2000)
      .fromTo("transform", "translateX(600px)", "translateX(0px)")
      .fromTo("opacity", "0", "1");

    animation.play();*/
  }

  ionViewDidEnter() {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    //this.getNotificationCount();
  }

  ionViewDidLeave() {
    /*if (
      this.screenOrientation.type == "landscape" ||
      this.screenOrientation.type == "landscape-primary" ||
      this.screenOrientation.type == "landscape-secondary"
    ) {
      this.screenOrientation.unlock();
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );
    }*/
  }

  ngOnDestroy() {}

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

        this.getNotificationCount();
      }
    );
  }

  btn_notification(value) {
    localStorage.setItem("badge_count", "0");
    //this.router.navigate(["/segregatenotification"]);

    if (value == "Production") {
      this.router.navigate(["/tabs/tabproduction"]);
    } else {
      this.router.navigate(["/tabs/tabmaintenance"]);
    }
  }

  getNotificationCount() {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    this.commonservice.getmaintenancependingcount(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.productioncount = resultdata.productioncount;
        this.productioncountlength = this.productioncount.toString().length;

        this.maintenancecount = resultdata.maintenancecount;
        this.maintenancecountlength = this.maintenancecount.toString().length;

        this.getMaintenanceCount();
      } else {
        this.productioncount = 0;
        this.productioncountlength = this.productioncount.toString().length;

        this.maintenancecount = 0;
        this.maintenancecountlength = this.maintenancecount.toString().length;

        this.getMaintenanceCount();
      }
    });
  }

  getMaintenanceSummaryBackGroundColor(position) {
    let color;

    if (position == "1") {
      color = "linear-gradient(315deg, #f47b7b 0%, #ffffff 74%)";
    } else if (position == "2") {
      color = "linear-gradient(315deg, #ffd166 0%, #fffcf9 74%)";
    } else {
      color = "linear-gradient(315deg, #82bc23 0%, #ffffff 74%)";
    }

    color = "#1d2730";

    return color;
  }

  getBackGroundColor(status) {
    let color;

    if (status == "1") {
      color = "#008000";
      //color ="linear-gradient(to right top, #74d217, #8bd847, #a0dd69, #b4e388, #c6e8a5, #c8e8a8, #cae9ac, #cce9af, #bfe599, #b1e183, #a2dd6c, #93d954)";
    } else if (status == "0") {
      color = "#CB4335";
      //color ="linear-gradient(to right top, #ea2c2c, #ef4444, #f3585a, #f56b6f, #f67d83, #f68086, #f5838a, #f5868d, #f57c81, #f57175, #f46769, #f35c5c)";
    } else {
      color = "#ff9f0c";
    }

    return color;
  }

  geBorderColor(position) {
    let color;

    /*if (position == "1") {
      color = "#00a4e4";
    } else if (position == "2") {
      color = "#ffd166";
    } else {
      color = "#82bc23";
    }*/

    color = "#ffffff";

    return color;
  }

  geTextColor(position) {
    let color;

    if (position == "1") {
      color = "#cb4335";
    } else if (position == "2") {
      color = "#ff9f0c";
    } else {
      color = "#008000";
    }

    return color;
  }

  getMaintenanceCount() {
    this.pleasewaitflag = true;

    const req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      language: this.languageService.selected,
    };

    this.service.getMaintenanceData(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.correctivemaintenanceArr = resultdata.data.cm;
        this.routinepreventivemaintenanceArr = resultdata.data.ropm;
        this.replacementpreventivemaintenanceArr = resultdata.data.repm;

        this.pleasewaitflag = false;
      } else {
        //this.getProductionStatus();
        this.correctivemaintenanceArr = [
          {
            title: "Created",
            position: "1",
            value: "-",
          },

          {
            title: "InProgress",
            position: "2",
            value: "-",
          },

          {
            title: "Completed",
            position: "3",
            value: "-",
          },
        ];
        this.routinepreventivemaintenanceArr = [
          {
            title: "Created",
            position: "1",
            value: "-",
          },

          {
            title: "InProgress",
            position: "2",
            value: "-",
          },

          {
            title: "Completed",
            position: "3",
            value: "-",
          },
        ];
        this.replacementpreventivemaintenanceArr = [
          {
            title: "Created",
            position: "1",
            value: "-",
          },

          {
            title: "InProgress",
            position: "2",
            value: "-",
          },

          {
            title: "Completed",
            position: "3",
            value: "-",
          },
        ];

        this.pleasewaitflag = false;
      }
    });
  }

  segmentChanged(ev: any) {
    if (ev.detail.value == "CorrectiveMaintenance") {
    } else {
    }
  }

  secondsegmentChanged(ev: any) {}

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  navigate() {
    this.router.navigate(["/owner-statistics"]);
  }
}
