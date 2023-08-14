import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AIREIService } from "src/app/api/api.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import {
  AlertController,
  Platform,
  Animation,
  AnimationController,
  ModalController,
} from "@ionic/angular";
import * as moment from "moment";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

// Modal Pages - Start
import { SchedulePage } from "src/app/maintenance-module/schedule/schedule.page";
import { MaintenanceNotificationModalPage } from "src/app/maintenance-module/maintenance-notification-modal/maintenance-notification-modal.page";
import { MaintenanceEngineerNotificationModalPage } from "src/app/maintenance-module/maintenance-engineer-notification-modal/maintenance-engineer-notification-modal.page";
import { SummaryPopupPage } from "src/app/summary-module/summary-popup/summary-popup.page";
// Modal Pages - End

import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

import { Market } from "@ionic-native/market/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";

@Component({
  selector: "app-maintenance-dashboard",
  templateUrl: "./maintenance-dashboard.page.html",
  styleUrls: ["./maintenance-dashboard.page.scss"],
})
export class MaintenanceDashboardPage implements OnInit {
  @ViewChild("myElementRef", { static: false }) myElementRef: ElementRef;

  filterForm;
  dashboardForm;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  usermillcode = this.userlist.millcode;
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;
  mill_name = this.nl2br(this.userlist.millname);

  count = 0;

  pendingcount = 0;
  pendingcountlength = 0;

  productionflag = "0";
  breakdownflag = 0;

  uienable = false;
  pleasewaitflag = false;
  nomachinesfound = false;

  stationlistArr = [];
  filterstationsArr = [];
  stationsArr = [];
  txt_millproductionstatus = "";
  txt_millstartstop = "";
  millstartdatetime = "";
  millstopdatetime = "";

  breakdownreason = "";

  // FFB Cages
  ffbcageenableflag = 0;
  ffbtotal = "";
  ffbinuse = "";
  ffbnotinuse = "";
  ffbunderrepair = "";

  filterTerm: string;
  getplatform: string;

  searchedstationid = "";

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    public modalController: ModalController,
    private alertController: AlertController,
    private zone: NgZone,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notifi: AuthGuardService,
    private commonservice: AIREIService,
    private platform: Platform,
    private appVersion: AppVersion,
    private market: Market,
    private service: SupervisorService,
    private animationCtrl: AnimationController,
    private screenOrientation: ScreenOrientation
  ) {
    this.dashboardForm = this.fb.group({
      select_station: new FormControl(""),
      //txt_millproductionstatus: new FormControl("", Validators.required),
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

      if (
        this.userdesignation == 2 ||
        this.userdesignation == 4 ||
        this.userdesignation == 6
      ) {
        this.getMaintenancePendingCount();
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    const animation: Animation = this.animationCtrl
      .create()
      .addElement(this.myElementRef.nativeElement)
      .duration(2000)
      .fromTo("transform", "translateX(600px)", "translateX(0px)")
      .fromTo("opacity", "0", "1");

    animation.play();

    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();
  }

  ionViewDidEnter() {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    this.forceUpdated();

    //this.dashboardForm.controls.select_station.setValue("");

    if (this.userdesignation == 2) {
      this.getSummaryPopUpFlag();
    }

    this.getStation();
  }

  forceUpdated() {
    var app_version;

    this.appVersion.getVersionNumber().then(
      (versionNumber) => {
        app_version = versionNumber;

        console.log(app_version);

        let req = {
          user_id: this.userlist.userId,
          millcode: this.userlist.millcode,
          dept_id: this.userlist.dept_id,
          language: this.languageService.selected,
        };

        this.commonservice.getSettings(req).then((result) => {
          var resultdata: any;
          resultdata = result;
          let updateVersion = resultdata.appVersion;
          let logout = resultdata.islogOut;

          if (typeof logout !== "undefined" && logout !== null) {
            if (logout == 1) {
              this.notifi.logoutupdateNotification();
              localStorage.clear();
              this.router.navigate(["/login"], { replaceUrl: true });
            } else {
              if (updateVersion > app_version) {
                this.alertForce(updateVersion);
              }
            }
          } else {
            if (updateVersion > app_version) {
              this.alertForce(updateVersion);
            }
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async alertForce(app_version) {
    let alert = await this.alertController.create({
      header: this.translate.instant("FORCEUPDATE.header"),
      backdropDismiss: false,
      message: this.translate.instant("FORCEUPDATE.message") + app_version,
      buttons: [
        {
          text: this.translate.instant("GENERALBUTTON.updatebutton"),
          handler: () => {
            let appId;

            if (this.platform.is("android")) {
              appId = "com.airei.milltracking";
            } else {
              appId = "id1534533301";
            }

            this.market
              .open(appId)
              .then((response) => {
                /*this.notifi.logoutupdateNotification();
                localStorage.clear();
                this.router.navigate(["/login"], { replaceUrl: true });*/
              })
              .catch((error) => {
                console.warn(error);
              });
          },
        },
      ],
    });
    alert.present();
  }

  btn_notification() {
    if (this.userdesignation != 4 && this.userdesignation != 6) {
      localStorage.setItem("badge_count", "0");
      this.router.navigate(["/segregatenotification"]);
    }

    /*localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);*/
  }

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem("badge_count"));
    });
  }

  btn_reportnotification() {
    this.router.navigate(["/notification-report"]);
  }

  getLiveNotification() {
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        // alert('Push received: ' + JSON.stringify(notification));
        this.updateNotification();

        if (
          this.userdesignation == 2 ||
          this.userdesignation == 4 ||
          this.userdesignation == 6
        ) {
          this.getMaintenancePendingCount();

          setTimeout(() => {
            this.getStation();
          }, 2000);
        }
      }
    );
  }

  getProductionStatusBackGroundColor(status) {
    let color;

    if (status == "1") {
      //color = "#4cbb17";
      color = "#008000";
    } else if (status == "0") {
      color = "#CB4335";
    } else {
      color = "#F4F4F4";
    }

    return color;
  }

  getBackGroundColor(machinestatus, breakdownstatus) {
    let color;

    /*if (status == "0") {
      color = "#CB4335";
      //color ="linear-gradient(to right top, #ea2c2c, #ef4444, #f3585a, #f56b6f, #f67d83, #f68086, #f5838a, #f5868d, #f57c81, #f57175, #f46769, #f35c5c)";
    } else if (status == "1") {
      color = "#008000";
      //color ="linear-gradient(to right top, #74d217, #8bd847, #a0dd69, #b4e388, #c6e8a5, #c8e8a8, #cae9ac, #cce9af, #bfe599, #b1e183, #a2dd6c, #93d954)";
    } else if (status == "2") {
      color = "#ff9f0c";
    } else {
      color = "#4d4d4d";
    }*/

    if (machinestatus == "0") {
      if (breakdownstatus == "0") {
        color = "#4d4d4d";
      } else {
        color = "#CB4335";
      }
      //color ="linear-gradient(to right top, #ea2c2c, #ef4444, #f3585a, #f56b6f, #f67d83, #f68086, #f5838a, #f5868d, #f57c81, #f57175, #f46769, #f35c5c)";
    } else if (machinestatus == "1") {
      color = "#008000";
      //color ="linear-gradient(to right top, #74d217, #8bd847, #a0dd69, #b4e388, #c6e8a5, #c8e8a8, #cae9ac, #cce9af, #bfe599, #b1e183, #a2dd6c, #93d954)";
    } else if (machinestatus == "2") {
      color = "#ff9f0c";
    } else {
      color = "#4d4d4d";
    }

    return color;
  }

  getStatusTextColor(status) {
    let color;

    if (status == "1") {
      color = "#ffffff";
    } else if (status == "0") {
      color = "#ffffff";
    } else {
      color = "#000000";
    }

    return color;
  }

  refreshRecords() {
    //this.dashboardForm.controls.select_station.setValue("");

    this.getProductionStatus();
  }

  onChangeStation() {
    this.searchedstationid = this.dashboardForm.value.select_station;

    var item = this.filterstationsArr.filter(
      (item) => item.stationid === parseInt(this.searchedstationid)
    );

    if (this.searchedstationid == "") {
      this.stationsArr = this.filterstationsArr;
    } else {
      this.stationsArr = item;
    }
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

  getSummaryPopUpFlag() {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    console.log(req);

    this.commonservice.getsummarypopupflag(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        if (resultdata.popup == "1") {
          //console.log(localStorage.getItem("scheduledpopup"));

          if (localStorage.getItem("scheduledpopup") == "") {
            localStorage.setItem(
              "scheduledpopup",
              moment(new Date().toISOString()).format("YYYY-MM-DD HH:00:00")
            );

            this.callmodalcontroller("SUMMARY");
          } else {
            let startdate = new Date(localStorage.getItem("scheduledpopup"));
            let enddate = new Date();

            if (
              this.diff_hours(enddate, startdate) >= resultdata.popupduration
            ) {
              localStorage.setItem(
                "scheduledpopup",
                moment(new Date().toISOString()).format("YYYY-MM-DD HH:00:00")
              );

              this.callmodalcontroller("SUMMARY");
            }
          }
        }
      }
    });
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
        this.stationlistArr = resultdata.data;

        this.nomachinesfound = false;

        this.getProductionStatus();
      } else {
        this.stationlistArr = [];

        this.nomachinesfound = true;

        this.getProductionStatus();
      }
    });
  }

  getProductionStatus() {
    this.pleasewaitflag = true;

    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    this.service.getProductionStartStopStatus(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.productionflag = resultdata.data[0].status;
        this.breakdownflag = resultdata.data[0].breakdownflag;

        this.millstartdatetime = resultdata.data[0].mill_start_date;
        this.millstopdatetime = resultdata.data[0].mill_stop_date;
        this.breakdownreason = resultdata.data[0].breakdownreason;

        this.ffbcageenableflag = resultdata.data[0].ffbcageenableflag;
        this.ffbtotal = resultdata.data[0].ffbcagestotal;
        this.ffbinuse = resultdata.data[0].ffbcagesinuse;
        this.ffbnotinuse = resultdata.data[0].ffbcagesnotinuse;
        this.ffbunderrepair = resultdata.data[0].ffbcagesunderrepair;

        if (this.productionflag == "1") {
          this.txt_millproductionstatus = this.translate.instant(
            "MAINTENANCEDASHBOARD.inoperation"
          );

          this.txt_millstartstop = this.translate.instant(
            "MAINTENANCEDASHBOARD.millstartdatetime"
          );
        } else if (this.productionflag == "0") {
          if (this.breakdownflag == 1) {
            this.txt_millproductionstatus = this.translate.instant(
              "MAINTENANCEDASHBOARD.stoppedoperation"
            );

            this.txt_millstartstop = this.translate.instant(
              "MAINTENANCEDASHBOARD.stoppedbreakdownoperation"
            );
          } else {
            this.txt_millproductionstatus = this.translate.instant(
              "MAINTENANCEDASHBOARD.stoppedoperation"
            );

            this.txt_millstartstop = this.translate.instant(
              "MAINTENANCEDASHBOARD.millstopdatetime"
            );
          }
        }

        this.getStations();
      } else {
        this.productionflag = "0";

        this.millstartdatetime = "";
        this.millstopdatetime = "";

        this.getStations();
      }
    });
  }

  getStations() {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    this.service.getProductionStaions(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.stationsArr = resultdata.data;

        this.filterstationsArr = this.stationsArr;

        // Search Process
        var item = this.filterstationsArr.filter(
          (item) => item.stationid === parseInt(this.searchedstationid)
        );

        if (this.searchedstationid == "") {
          this.stationsArr = this.filterstationsArr;
        } else {
          this.stationsArr = item;
        }
        // End

        if (this.productionflag == "1") {
          this.uienable = true;
        } else {
          this.uienable = true;
        }

        this.pleasewaitflag = false;
      } else {
        this.stationsArr = [];

        this.filterstationsArr = this.stationsArr;

        this.uienable = false;

        this.pleasewaitflag = false;
      }
    });
  }

  btn_QRcodescanner() {
    this.router.navigate(["/qrcodescanner"]);
  }

  btn_Action(value) {
    this.router.navigate([
      "/maintenance-dashboard-correctivemaintenance",
      { item: JSON.stringify(value) },
    ]);
  }

  async callmodalcontroller(value) {
    if (value == "SCHEDULING") {
      const modal = await this.modalController.create({
        component: SchedulePage,
      });

      modal.onDidDismiss().then((data) => {
        this.ionViewDidEnter();
      });

      return await modal.present();
    } else if (value == "SUMMARY") {
      const modal = await this.modalController.create({
        component: SummaryPopupPage,
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ["acknowledgement-modal"],
      });

      modal.onDidDismiss().then((data) => {
        //this.ionViewDidEnter();
      });

      return await modal.present();
    } else {
      if (value.breakdownstatus == 0) {
        if (this.userdesignation == 2) {
          const modal = await this.modalController.create({
            component: MaintenanceEngineerNotificationModalPage,
            componentProps: {
              item: JSON.stringify(value),
              module: "MAINTENANCE",
            },
            showBackdrop: true,
            backdropDismiss: false,
            cssClass: ["acknowledgement-modal"],
          });

          modal.onDidDismiss().then((modaldata) => {
            //this.dashboardForm.controls.select_station.setValue("");

            let getdata = modaldata["data"]["item"];

            if (getdata != "") {
              this.ionViewDidEnter();
            }
          });

          return await modal.present();
        } else if (this.userdesignation != 2) {
          const modal = await this.modalController.create({
            component: MaintenanceNotificationModalPage,
            componentProps: {
              item: JSON.stringify(value),
              module: "MAINTENANCE",
            },
            showBackdrop: true,
            backdropDismiss: false,
            cssClass: ["acknowledgement-modal"],
          });

          modal.onDidDismiss().then((modaldata) => {
            let getdata = modaldata["data"]["item"];

            if (getdata != "") {
              this.ionViewDidEnter();
            }
          });

          return await modal.present();
        }
      } else {
        this.commonservice.presentToast(
          this.translate.instant("SUPERVISORDASHBOARD.machineisunderbreakdown")
        );
      }
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;

    return Math.floor(diff);
  }
}
