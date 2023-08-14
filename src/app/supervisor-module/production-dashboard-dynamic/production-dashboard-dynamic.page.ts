import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import {
  ModalController,
  AlertController,
  Platform,
  Animation,
  AnimationController,
} from "@ionic/angular";
import * as moment from "moment";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";

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

import { ProductionMachineshutdownalertModalPage } from "src/app/supervisor-module/production-machineshutdownalert-modal/production-machineshutdownalert-modal.page";
import { SchedulePage } from "src/app/maintenance-module/schedule/schedule.page";
import { SummaryPopupPage } from "src/app/summary-module/summary-popup/summary-popup.page";
import { ProductionFfbcagePage } from "src/app/supervisor-module/production-ffbcage/production-ffbcage.page";

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-production-dashboard-dynamic",
  templateUrl: "./production-dashboard-dynamic.page.html",
  styleUrls: ["./production-dashboard-dynamic.page.scss"],
})
export class ProductionDashboardDynamicPage implements OnInit {
  @ViewChild("myElementRef", { static: false }) myElementRef: ElementRef;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  mill_name = this.nl2br(this.userlist.millname);

  dashboardForm;

  count = 0;
  pendingcount = 0;
  pendingcountlength = 0;

  breakdownflag = 0;
  productioncount = 0;

  currentdatetime = moment(new Date().toISOString()).format("DD-MM-YYYY HH:mm");

  transactionid = "";
  txt_millproductionstatus = "";
  txt_millstartstop = "";
  mill_startdatetime = "";
  mill_stopdatetime = "";
  millstartdatetime = "";
  millstopdatetime = "";
  productionalerttitle = "";
  startalertmessage = "";
  stopalertmessage = "";
  breakdownalerttitle = "";
  breakdownalertmessage = "";
  breakdownreason = "";
  reasonplaceholder = "";
  balancecropplaceholder = "";
  reasonalerttitle = "";
  reasonalertmessage = "";
  reasonalertplaceholder = "";

  // FFB Cages
  ffbcageenableflag = 0;
  ffbtotal = "";
  ffbinuse = "";
  ffbnotinuse = "";
  ffbunderrepair = "";

  welcomemessage = "";
  productionflag = "0";

  isDisabled = false;
  uienable = false;
  previoushistoryuienable = false;
  nomachinesfound = false;
  pleasewaitflag = false;

  stationlistArr = [];
  filterstationsArr = [];
  stationsArr = [];
  previoushistoryArr = [];

  selectedlanguage = "";
  getplatform: string;

  searchedstationid = "";

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private zone: NgZone,
    public modalController: ModalController,
    private alertController: AlertController,
    private notifi: AuthGuardService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private commonservice: AIREIService,
    private fb: FormBuilder,
    private service: SupervisorService,
    private platform: Platform,
    private appVersion: AppVersion,
    private market: Market,
    private animationCtrl: AnimationController,
    private screenOrientation: ScreenOrientation
  ) {
    this.selectedlanguage = this.languageService.selected;
    //console.log("Translate:", translate.currentLang);
    this.activatedroute.params.subscribe((val) => {
      if (this.platform.is("android")) {
        this.getplatform = "android";
      } else if (this.platform.is("ios")) {
        this.getplatform = "ios";
      }

      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );

      this.getProductionPendingCount();
    });

    this.dashboardForm = this.fb.group({
      select_station: new FormControl(""),
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

    this.getSummaryPopUpFlag();

    this.getStation();
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

        this.getProductionPendingCount();
      }
    );
  }

  btn_notification() {
    localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);
  }

  btn_reportnotification() {
    this.router.navigate(["/notification-report"]);
  }

  forceUpdated() {
    var app_version;

    this.appVersion.getVersionNumber().then(
      (versionNumber) => {
        app_version = versionNumber;

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
          text: this.translate.instant("FORCEUPDATE.button"),
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

  getProductionPendingCount() {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    //console.log(req);

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

  refreshRecords() {
    //this.dashboardForm.controls.select_station.setValue("");

    this.getStation();
  }

  getMillBackGroundColor(status) {
    let color;

    if (status == "0") {
      color = "#CB4335";
      //color ="linear-gradient(to right top, #ea2c2c, #ef4444, #f3585a, #f56b6f, #f67d83, #f68086, #f5838a, #f5868d, #f57c81, #f57175, #f46769, #f35c5c)";
    } else if (status == "1") {
      color = "#008000";
      //color ="linear-gradient(to right top, #74d217, #8bd847, #a0dd69, #b4e388, #c6e8a5, #c8e8a8, #cae9ac, #cce9af, #bfe599, #b1e183, #a2dd6c, #93d954)";
    } else {
      color = "#ff9f0c";
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

  getStation() {
    this.pleasewaitflag = true;

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

        this.pleasewaitflag = false;
      }
    });
  }

  getProductionStatus() {
    if (!this.pleasewaitflag) {
      this.pleasewaitflag = true;
    }

    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };
    //console.log(req);
    this.service.getProductionStartStopStatus(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.transactionid = resultdata.data[0].id;
        this.productionflag = resultdata.data[0].status;
        this.breakdownflag = resultdata.data[0].breakdownflag;

        //console.log(this.productionflag);

        this.mill_startdatetime = resultdata.data[0].start_date;
        this.mill_stopdatetime = resultdata.data[0].stop_date;

        this.millstartdatetime = resultdata.data[0].mill_start_date;
        this.millstopdatetime = resultdata.data[0].mill_stop_date;

        this.productionalerttitle = resultdata.productionalerttitle;
        this.startalertmessage = resultdata.startalertmessage;
        this.stopalertmessage = resultdata.stopalertmessage;
        this.breakdownalerttitle = resultdata.breakdownalerttitle;
        this.breakdownalertmessage = resultdata.breakdownalertmessage;
        this.breakdownreason = resultdata.data[0].breakdownreason;
        this.reasonplaceholder = resultdata.reasonplaceholder;
        this.balancecropplaceholder = resultdata.balancecropplaceholder;
        this.reasonalerttitle = resultdata.reasonalerttitle;
        this.reasonalertmessage = resultdata.reasonalertmessage;
        this.reasonalertplaceholder = resultdata.reasonplaceholder;

        this.ffbcageenableflag = resultdata.data[0].ffbcageenableflag;
        this.ffbtotal = resultdata.data[0].ffbcagestotal;
        this.ffbinuse = resultdata.data[0].ffbcagesinuse;
        this.ffbnotinuse = resultdata.data[0].ffbcagesnotinuse;
        this.ffbunderrepair = resultdata.data[0].ffbcagesunderrepair;

        if (this.productionflag == "1") {
          this.txt_millproductionstatus = this.translate.instant(
            "SUPERVISORDASHBOARD.inoperation"
          );
          this.txt_millstartstop = this.translate.instant(
            "SUPERVISORDASHBOARD.millstartdatetime"
          );
          this.isDisabled = false;
        } else if (this.productionflag == "0") {
          if (this.breakdownflag == 1) {
            this.txt_millproductionstatus = this.translate.instant(
              "SUPERVISORDASHBOARD.stoppedoperation"
            );
            this.txt_millstartstop = this.translate.instant(
              "SUPERVISORDASHBOARD.stoppedbreakdownoperation"
            );
          } else {
            this.txt_millproductionstatus = this.translate.instant(
              "SUPERVISORDASHBOARD.stoppedoperation"
            );
            this.txt_millstartstop = this.translate.instant(
              "SUPERVISORDASHBOARD.millstopdatetime"
            );
          }
          this.isDisabled = true;
        } else if (this.productionflag == "") {
          this.isDisabled = true;
        }

        this.getStations();
      } else {
        this.productionflag = "0";

        this.productionalerttitle = "Amaran";
        this.startalertmessage =
          "Dengan menekan butang hijau anda mengesahkan bahawa operasi kilang akan dimulakan.";
        this.stopalertmessage =
          "Dengan menekan butang merah anda mengesahkan bahawa operasi kilang akan diberhentikan.";
        this.breakdownalerttitle = "Amaran";
        this.breakdownalertmessage = "Sila masukkan sebab breakdown";
        this.reasonplaceholder = "Sebab Kerosakan";
        this.balancecropplaceholder = "Tanaman Imbangan";
        this.reasonalerttitle = "Masukkan sebab";
        this.reasonalertmessage = "Sila berikan sebab untuk menghentikan";
        this.reasonalertplaceholder = "sebab";

        this.isDisabled = true;

        this.getStations();
      }
    });
  }

  getStations() {
    if (!this.pleasewaitflag) {
      this.pleasewaitflag = true;
    }

    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    //console.log(req);

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
          this.previoushistoryuienable = false;

          this.uienable = true;

          this.welcomemessage = this.translate.instant(
            "SUPERVISORDASHBOARD.productionstarted"
          );
        } else {
          /*Commented on 29.04.2023 due to stations and machines to show all the time
          this.uienable = false;*/

          /*Added due to show stations and machines all the time - Start*/
          this.uienable = true;
          /*Added due to show stations and machines all the time - End*/

          this.welcomemessage = this.translate.instant(
            "SUPERVISORDASHBOARD.productionstopped"
          );

          /*Added due to show stations and machines all the time - Start*/
          this.previoushistoryuienable = false;
          /*Added due to show stations and machines all the time - End*/

          /*Commented on 29.04.2023 due to stations and machines to show all the time
          this.previoushistory();*/
        }

        this.pleasewaitflag = false;
      } else {
        this.stationsArr = [];

        this.filterstationsArr = this.stationsArr;

        this.uienable = false;

        this.pleasewaitflag = false;

        //this.dashboardForm.controls.select_station.setValue("");
        //this.previoushistory();
      }
    });
  }

  /*previoushistory() {
    var req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    this.service.previousProductionHistory(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        this.previoushistoryArr = resultdata.data;
        this.previoushistoryuienable = true;
      } else {
        this.previoushistoryArr = [];
        this.previoushistoryuienable = false;
      }
    });
  }*/

  getSummaryPopUpFlag() {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.commonservice.getsummarypopupflag(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        if (resultdata.popup == 1) {
          //this.callmodalcontroller("SUMMARY");

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

  confirmProduction(value) {
    let alertmessage = "";

    if (this.ffbcageenableflag == 1) {
      if (value == 0) {
        alertmessage =
          this.startalertmessage +
          "<br><br>" +
          this.translate.instant("FFBCAGES.title");
      } else {
        alertmessage =
          this.stopalertmessage +
          "<br><br>" +
          this.translate.instant("FFBCAGES.title");
      }

      this.alertController
        .create({
          mode: "md",
          message: alertmessage,
          cssClass: "millstartstopalertmessagetwobuttons",
          backdropDismiss: false,
          inputs: [
            {
              name: "inuse",
              type: "number",
              placeholder: this.translate.instant("FFBCAGES.inuse"),
            },
            {
              name: "notinuse",
              type: "number",
              placeholder: this.translate.instant("FFBCAGES.notinuse"),
            },
            {
              name: "underrepair",
              type: "number",
              placeholder: this.translate.instant("FFBCAGES.underrepair"),
            },
          ],
          buttons: [
            {
              //text: this.translate.instant("GENERALBUTTON.cancelbutton"),
              text: "",
              cssClass: "cancelbutton",
              handler: () => {
                //console.log("Cancel");
              },
            },
            {
              //text: this.translate.instant("GENERALBUTTON.yes"),
              text: "",
              //cssClass: "okaybutton",
              handler: (data: any) => {
                var checknumber = /^-?[0-9]+$/;

                if (data.inuse == "") {
                  this.commonservice.presentToast("In Use is Mandatory");
                  return false;
                }

                if (!checknumber.test(data.inuse)) {
                  this.commonservice.presentToast(
                    "In Use is a not a Valid Number"
                  );
                  return false;
                }

                if (data.notinuse == "") {
                  this.commonservice.presentToast("Not In Use is Mandatory");
                  return false;
                }

                if (!checknumber.test(data.notinuse)) {
                  this.commonservice.presentToast(
                    "Not In Use is a not a Valid Number"
                  );
                  return false;
                }

                if (data.underrepair == "") {
                  this.commonservice.presentToast("Under Repair is Mandatory");
                  return false;
                }

                if (!checknumber.test(data.underrepair)) {
                  this.commonservice.presentToast(
                    "Under Repair is a not a Valid Number"
                  );
                  return false;
                }

                this.dashboardForm.controls.select_station.setValue("");
                this.searchedstationid =
                  this.dashboardForm.value.select_station;

                this.saveFFBCages(
                  "0",
                  data.inuse,
                  data.notinuse,
                  data.underrepair,
                  "1"
                );
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    } else {
      if (value == 0) {
        alertmessage = this.startalertmessage;
      } else {
        alertmessage = this.stopalertmessage;
      }

      this.alertController
        .create({
          mode: "md",
          message: alertmessage,
          cssClass: "millstartstopalertmessagetwobuttons",
          backdropDismiss: false,
          buttons: [
            {
              text: "",
              cssClass: "cancelbutton",
              handler: () => {
                //console.log("Cancel");
              },
            },
            {
              text: "",
              handler: (data: any) => {
                this.startstopProduction("");
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    }
  }

  saveFFBCages(gettotal, getinuse, getnotinuse, getunderrepair, refresh) {
    var req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      total: gettotal,
      inuse: getinuse,
      notinuse: getnotinuse,
      underrepair: getunderrepair,
      language: this.languageService.selected,
      isrefresh: refresh,
    };

    console.log(req);

    this.service.saveffbcages(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        if (refresh == 1) {
          this.startstopProduction("");
        } else {
          this.getProductionStatus();
        }
      } else {
        if (refresh == 1) {
          this.startstopProduction("");
        } else {
          this.getProductionStatus();
        }
      }
    });
  }

  startstopProduction(getbalancecrop) {
    if (this.productionflag == "0" || this.productionflag == "") {
      this.productioncount = 1;
    }

    if (this.productionflag == "1") {
      this.productioncount = 0;
    }

    if (!this.pleasewaitflag) {
      this.pleasewaitflag = true;
    }

    var req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      productionstatus: this.productioncount,
      balanceCrop: getbalancecrop,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.startstopProduction(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        if (this.productioncount == 1) {
          this.commonservice.presentToast(
            this.translate.instant(
              "SUPERVISORDASHBOARD.productionstartedsuccessfully"
            )
          );
        } else {
          this.commonservice.presentToast(
            this.translate.instant(
              "SUPERVISORDASHBOARD.productionstoppedsuccessfully"
            )
          );
        }

        this.getProductionStatus();
      } else {
        this.commonservice.presentToast(
          this.translate.instant("SUPERVISORDASHBOARD.productionstartfailed")
        );

        this.pleasewaitflag = false;
      }
    });
  }

  breakdownalert() {
    let alertmessage = this.breakdownalertmessage;

    this.alertController
      .create({
        mode: "md",
        header: this.breakdownalerttitle,
        message: alertmessage,
        cssClass: "customalertmessagetwobuttons",
        backdropDismiss: false,
        inputs: [
          {
            name: "reason",
            type: "textarea",
            cssClass: "alertinput",
            placeholder: this.reasonplaceholder,
          },
          /*{
            name: "balancecrop",
            type: "number",
            placeholder: this.balancecropplaceholder,
          },*/
        ],
        buttons: [
          {
            //text: this.translate.instant("GENERALBUTTON.cancelbutton"),
            text: "",
            cssClass: "cancelbutton",
            handler: () => {
              //console.log("Confirm Cancel");
            },
          },
          {
            //text: this.translate.instant("GENERALBUTTON.yes"),
            text: "",
            //cssClass: "okaybutton",
            handler: (data: any) => {
              if (data.reason != "") {
                this.saveBreakDown(data.reason, "");
              } else {
                this.commonservice.presentToast(
                  this.translate.instant("SUPERVISORDASHBOARD.reasonmandatory")
                );
                return false;
              }
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  saveBreakDown(getreason, getbalancecrop) {
    const req = {
      user_id: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      remarks: getreason,
      balanceCrop: getbalancecrop,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.saveBreakDownStatus(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.commonservice.presentToast(
          this.translate.instant(
            "SUPERVISORDASHBOARD.breakdownsavedsuccessfully"
          )
        );

        this.getProductionStatus();
      } else {
        this.commonservice.presentToast(
          this.translate.instant("SUPERVISORDASHBOARD.breakdownsavingfailed")
        );
      }
    });
  }

  confirmStation(stationid, stationname, stationstatus) {
    let alertmessage = "";

    if (stationstatus == 0) {
      /*Commented by suresh as said by vignesh MG-547
      alertmessage =
        stationname +
        " running hours are monitored when the machinery tabs are green in color.<br><br>" +
        "Kindly tap the button if the machinery are switched off. This will turn the tab into red in color and running hours will not be monitored.";*/
      alertmessage =
        this.translate.instant("SUPERVISORDASHBOARD.themachineriesunder") +
        stationname +
        this.translate.instant("SUPERVISORDASHBOARD.machineoff");

      this.alertController
        .create({
          mode: "md",
          header: this.translate.instant("SUPERVISORDASHBOARD.machineheader"),
          message: alertmessage,
          cssClass: "customalertmessagetwobuttons",
          backdropDismiss: false,
          buttons: [
            {
              //text: this.translate.instant("SUPERVISORDASHBOARD.cancel"),
              text: "",
              role: "cancel",
              cssClass: "cancelbutton",
              handler: (cancel) => {
                //console.log("Confirm Cancel");
              },
            },
            {
              //text: this.translate.instant("SUPERVISORDASHBOARD.okay"),
              text: "",
              //cssClass: "okaybutton",
              handler: () => {
                this.startstopMachines(stationid, stationname, stationstatus);
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    } else {
      alertmessage =
        this.translate.instant("SUPERVISORDASHBOARD.machinealert") +
        stationname +
        "?";

      this.alertController
        .create({
          mode: "md",
          header: this.translate.instant("SUPERVISORDASHBOARD.machineheader"),
          message: alertmessage,
          cssClass: "customalertmessagetwobuttons",
          backdropDismiss: false,
          buttons: [
            {
              //text: this.translate.instant("SUPERVISORDASHBOARD.no"),
              text: "",
              cssClass: "cancelbutton",
              handler: () => {},
            },
            {
              //text: this.translate.instant("SUPERVISORDASHBOARD.yes"),
              text: "",
              //cssClass: "okaybutton",
              handler: () => {
                this.startstopMachines(stationid, stationname, stationstatus);
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    }
  }

  startstopMachines(stationid, stationname, stationstatus) {
    var req;

    var station_status = 0;

    if (stationstatus == 0) {
      station_status = 1;
    }

    if (stationstatus == 1) {
      station_status = 0;
    }

    if (!this.pleasewaitflag) {
      this.pleasewaitflag = true;
    }

    req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      productionstatus: station_status,
      stationid: stationid,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.startstopProductionStation(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        if (station_status == 1) {
          this.commonservice.presentToast(
            stationname +
              this.translate.instant("SUPERVISORDASHBOARD.startedsuccessfully")
          );
        } else {
          this.commonservice.presentToast(
            stationname +
              this.translate.instant("SUPERVISORDASHBOARD.stoppedsuccessfully")
          );
        }

        this.getStations();
      } else {
        this.pleasewaitflag = false;

        this.commonservice.presentToast(
          this.translate.instant("SUPERVISORDASHBOARD.productionstartfailed")
        );
      }
    });
  }

  btn_Action(stationid, stationname, item) {
    //console.log(JSON.stringify(item));

    if (this.productionflag == "1") {
      if (item.breakdownstatus == 0) {
        /*if (item.machinestatus == 1) {
          this.popupmodalcontroller(stationid, stationname, item);
        } else {
          this.alertturnon(stationid, stationname, item);
        }*/
        this.popupmodalcontroller(stationid, stationname, item);
      } else {
        this.alreadybreakdownalert(stationid, stationname, item);
      }
    } else {
      if (item.breakdownstatus == 0) {
        this.popupmodalcontroller(stationid, stationname, item);
      } else {
        this.alreadybreakdownalert(stationid, stationname, item);
      }
    }
  }

  reasonformachineshutdownalert(stationid, stationname, item) {
    //console.log(JSON.stringify(item));

    //let alertmessage = "Please enter Reason for Breakdown and Balance Crop";
    let alertmessage = this.reasonalertmessage + " " + item.machinename;

    this.alertController
      .create({
        mode: "md",
        header: this.reasonalerttitle,
        message: alertmessage,
        cssClass: "customalertmessagetwobuttons",
        backdropDismiss: false,
        inputs: [
          {
            name: "reason",
            type: "textarea",
            cssClass: "alertinput",
            placeholder: this.reasonalertplaceholder,
          },
        ],
        buttons: [
          {
            text: "",
            handler: (cancel) => {
              //console.log("Confirm Cancel");
            },
          },
          {
            text: "",
            handler: (data: any) => {
              if (data.reason != "") {
                //console.log(data.reason);
                this.updateMachineStatus(
                  stationid,
                  stationname,
                  item,
                  data.reason,
                  "",
                  "",
                  "",
                  "",
                  "",
                  ""
                );
              } else {
                return false;
              }
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  alertturnon(stationid, stationname, item) {
    let alertmessage = "";
    let machine = item.machinename;

    if (item.machinestatus == "2") {
      alertmessage =
        this.translate.instant("SUPERVISORDASHBOARD.turnoffmachine") +
        machine +
        "?";
    } else {
      alertmessage =
        this.translate.instant("SUPERVISORDASHBOARD.turnonmachine") +
        machine +
        "?";
    }

    this.alertController
      .create({
        mode: "md",
        header: this.translate.instant("SUPERVISORDASHBOARD.header"),
        message: alertmessage,
        cssClass: "customalertmessagetwobuttons",
        backdropDismiss: false,

        buttons: [
          {
            //text: this.translate.instant("GENERALBUTTON.cancelbutton"),
            text: "",
            cssClass: "cancelbutton",
            handler: () => {
              //console.log("Confirm Cancel");
            },
          },
          {
            //text: this.translate.instant("GENERALBUTTON.yes"),
            text: "",
            //cssClass: "okaybutton",
            handler: (data: any) => {
              this.updateMachineStatus(
                stationid,
                stationname,
                item,
                "",
                "",
                "",
                "",
                "",
                "",
                ""
              );
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  updateMachineStatus(
    stationid,
    stationname,
    item,
    getproblem,
    getmaintenancetype,
    getpart,
    getotherpartname,
    getbreakdowncauses,
    getbreakdownremarks,
    getnotinuseremarks
  ) {
    var currentmachinestatus;
    var settype;

    if (item.machinestatus == 0) {
      currentmachinestatus = 1;
    } else {
      currentmachinestatus = 0;
    }

    if (this.productionflag == "1") {
      settype = "1";
    } else {
      settype = "6";
    }

    if (!this.pleasewaitflag) {
      this.pleasewaitflag = true;
    }

    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      stationid: item.stationid,
      machineid: item.machineid,
      machinestatus: Number(currentmachinestatus),
      reason: getproblem,
      maintenancetype: getmaintenancetype,
      part_defect: getpart,
      other_part_name: getotherpartname,
      breakdown_cause: getbreakdowncauses,
      remarks: getbreakdownremarks,
      notinuseremarks: getnotinuseremarks,
      language: this.languageService.selected,
      type: settype,
      ffbcagestatus: item.ffbcageflag,
      millstatus: this.productionflag,
    };

    console.log(req);

    this.service.saveMachineStatus(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        if (item.ffbcageflag) {
          this.refreshFFBStatus();
        } else {
          this.getStations();
        }
      } else if (resultdata.httpcode == 401) {
        this.pleasewaitflag = false;

        this.alreadybreakdownalert(stationid, stationname, item);
      }
    });
  }

  refreshFFBStatus() {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };
    //console.log(req);
    this.service.getProductionStartStopStatus(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.ffbtotal = resultdata.data[0].ffbcagestotal;
        this.ffbinuse = resultdata.data[0].ffbcagesinuse;
        this.ffbnotinuse = resultdata.data[0].ffbcagesnotinuse;
        this.ffbunderrepair = resultdata.data[0].ffbcagesunderrepair;

        this.getStations();
      } else {
        this.ffbtotal = "";
        this.ffbinuse = "";
        this.ffbnotinuse = "";
        this.ffbunderrepair = "";

        this.getStations();
      }
    });
  }

  async alreadybreakdownalert(stationid, stationname, item) {
    let machine = item.machinename;
    let alertmessage =
      machine +
      this.translate.instant(
        "SUPERVISORDASHBOARD.alreadybreakdownalertmessage"
      );

    const alert = await this.alertController.create({
      mode: "md",
      header: this.translate.instant(
        "SUPERVISORDASHBOARD.alreadybreakdownalerttitle"
      ),
      cssClass: "customalertmessageonebuttons",
      message: alertmessage,
      buttons: [
        {
          text: "",
          handler: () => {
            //console.log("Confirm Okay");
          },
        },
      ],
    });

    await alert.present();
  }

  async popupmodalcontroller(getstationid, getstationname, value) {
    const modal = await this.modalController.create({
      component: ProductionMachineshutdownalertModalPage,
      componentProps: {
        item: JSON.stringify(value),
        stationid: getstationid,
        stationname: getstationname,
        millstatus: this.productionflag,
        module: "CM",
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ["acknowledgement-modal"],
    });

    modal.onDidDismiss().then((modeldata) => {
      let breakdownid = modeldata["data"]["breakdown_id"];
      let maintenancetypeid = modeldata["data"]["maintenancetype_id"];
      let partid = modeldata["data"]["part_id"];
      let otherpartname = modeldata["data"]["otherpart_name"];
      let breakdowncauses = modeldata["data"]["breakdowncauses_id"];
      let breakdownremarks = modeldata["data"]["breakdownremarks"];
      let notinuseremarks = modeldata["data"]["notinuseremarks"];

      if (
        typeof breakdownid !== "undefined" &&
        typeof maintenancetypeid !== "undefined" &&
        typeof partid !== "undefined" &&
        typeof breakdowncauses !== "undefined"
      ) {
        //this.dashboardForm.controls.select_station.setValue("");

        this.problemalertmessage(
          getstationid,
          getstationname,
          value,
          breakdownid,
          maintenancetypeid,
          partid,
          otherpartname,
          breakdowncauses,
          breakdownremarks,
          notinuseremarks
        );
      }
    });

    return await modal.present();
  }

  async ffbcagemodalcontroller() {
    const modal = await this.modalController.create({
      component: ProductionFfbcagePage,
      componentProps: {
        ffbcagetotal: this.ffbtotal,
        ffbcageinuse: this.ffbinuse,
        ffbcagenotinuse: this.ffbnotinuse,
        ffbcageunderrepair: this.ffbunderrepair,
        millstatus: this.productionflag,
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ["ffbcagepopup-modal"],
    });

    modal.onDidDismiss().then((modeldata) => {
      let getdata = modeldata["data"]["item"];

      if (getdata != "") {
        this.getProductionStatus();
      }
    });

    return await modal.present();
  }

  async problemalertmessage(
    station_id,
    station_name,
    value,
    breakdown_id,
    maintenancetype_id,
    part_id,
    otherpart_name,
    breakdown_causes,
    breakdown_remarks,
    notinuse_remarks
  ) {
    //console.log("breakdownid:", breakdown_id);

    if (breakdown_id == 1 || breakdown_id == 2) {
      var alertmessage =
        this.translate.instant(
          "SUPERVISORDASHBOARD.correctivemaintenancecreated"
        ) + value.machinename;

      const alert = await this.alertController.create({
        mode: "md",
        header: this.translate.instant("SUPERVISORDASHBOARD.reportsubmitted"),
        cssClass: "customalertmessageonebuttons",
        message: alertmessage,
        backdropDismiss: false,
        buttons: [
          {
            text: "",
            handler: () => {
              this.updateMachineStatus(
                station_id,
                station_name,
                value,
                breakdown_id,
                maintenancetype_id,
                part_id,
                otherpart_name,
                breakdown_causes,
                breakdown_remarks,
                notinuse_remarks
              );
            },
          },
        ],
      });

      await alert.present();
    } else if (breakdown_id == 0 || breakdown_id == 3) {
      this.updateMachineStatus(
        station_id,
        station_name,
        value,
        breakdown_id,
        maintenancetype_id,
        part_id,
        otherpart_name,
        breakdown_causes,
        breakdown_remarks,
        notinuse_remarks
      );
    }
  }

  btn_QRcodescanner() {
    this.router.navigate(["/qrcodescanner"]);
  }

  async callmodalcontroller(value) {
    if (value == "") {
      const modal = await this.modalController.create({
        component: SchedulePage,
      });

      modal.onDidDismiss().then((data) => {
        this.ngAfterViewInit();
      });

      return await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: SummaryPopupPage,
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ["summarypopup-modal"],
      });

      modal.onDidDismiss().then((data) => {
        //this.ionViewDidEnter();
      });

      return await modal.present();
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
