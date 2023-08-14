import { Component, OnInit, NgZone, ViewChild } from "@angular/core";
import { App, AppState } from "@capacitor/core";
import { AIREIService } from "src/app/api/api.service";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";
import { Router } from "@angular/router";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl } from "@angular/forms";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;
import {
  AlertController,
  Platform,
  Animation,
  AnimationController,
  ModalController,
  IonSlides,
} from "@ionic/angular";
import { AppVersion } from "@ionic-native/app-version/ngx";

import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;
import { Market } from "@ionic-native/market/ngx";
import { OillossRecomandationModalPage } from "src/app/owner-module/oilloss-recomandation-modal/oilloss-recomandation-modal.page";
import { LanguageService } from "src/app/services/language-service/language.service";

@Component({
  selector: "app-production-oilloss",
  templateUrl: "./production-oilloss.page.html",
  styleUrls: ["./production-oilloss.page.scss"],
})
export class ProductionOillossPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  mill_name = this.nl2br(this.userlist.millname);
  designationid = this.userlist.desigId;
  getlanguage = this.userlist.language;

  oillossesreportForm;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  getDate;

  count = 0;
  productioncount = 0;
  productioncountlength = 0;

  maintenancecount = 0;
  maintenancecountlength = 0;

  pendingcount = 0;
  pendingcountlength = 0;

  getplatform: string;

  reportdate = "";

  norecordsflag = false;
  pleasewaitflag = false;
  didInit = false;

  oillossesArr = [];
  pressdataArr = [];
  generalArr = [];
  actionArr = [
    /*{
      values: "Oil Losses within baseline. Keep up the good work.",
    },
    {
      values:
        "Temperature is too low, Ensure steam inlet valve leaking has no leaks.",
    },
    {
      values:
        "Press Motor amps is low, Ensur boiler pressure is at its process values.",
    },
    {
      values:
        "Hydraulic Pressure is low,Ensure boiler pressue is are at its process value",
    },*/
  ];

  title = "";
  note = "";
  selectedlanguage = "";

  constructor(
    private translate: TranslateService,
    private screenOrientation: ScreenOrientation,
    public modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private activatedroute: ActivatedRoute,
    private fb: FormBuilder,
    private platform: Platform,
    private market: Market,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private commonservice: AIREIService,
    private alertController: AlertController,
    private languageService: LanguageService,
    private appVersion: AppVersion,
    private supervisorservice: SupervisorService
  ) {
    if (this.reportdate == "") {
      this.reportdate = this.currentdate;
      //this.reportdate = "";
    } else {
      this.reportdate = moment(this.reportdate, "YYYY-MM-DD").format(
        "DD-MM-YYYY"
      );
    }

    this.oillossesreportForm = this.fb.group({
      pickdate: new FormControl(this.reportdate),
    });

    this.activatedroute.params.subscribe((val) => {
      this.selectedlanguage = this.languageService.selected;

      if (this.platform.is("android")) {
        this.getplatform = "android";
      } else if (this.platform.is("ios")) {
        this.getplatform = "ios";
      }

      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );

      this.getreport();
    });
  }

  ngOnInit() {
    App.addListener("appStateChange", (state: AppState) => {
      if (state.isActive == true) {
        if (this.router.url == "/tabs/taboilloss") {
          this.getreport();
        }
      }
    });
  }

  ngAfterViewInit(): void {}

  ionViewDidEnter() {}

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

  btn_notification(value) {
    localStorage.setItem("badge_count", "0");
    //this.router.navigate(["/segregatenotification"]);

    if (
      this.designationid == 1 ||
      this.designationid == 12 ||
      this.designationid == 13 ||
      this.designationid == 14
    ) {
      if (value == "Production") {
        this.router.navigate(["/tabs/tabproduction"]);
      } else {
        this.router.navigate(["/tabs/tabmaintenance"]);
      }
    } else if (this.designationid == 3 || this.designationid == 9) {
      this.router.navigate(["/segregatenotification"]);
    }
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
        // alert('Push received: ' + JSON.stringify(notification));
        this.updateNotification();

        if (
          this.designationid == 1 ||
          this.designationid == 12 ||
          this.designationid == 13 ||
          this.designationid == 14
        ) {
          this.getNotificationCount();
        } else if (this.designationid == 3 || this.designationid == 9) {
          this.getNotificationPendingCount();
        }
      }
    );
  }

  slideOpts = {
    initialSlide: 1,
    slidesPerView: 1.5,
    speed: 400,
    loop: false,
    centeredSlides: true,
    pager: false,
  };

  slidesDidLoad(slides: IonSlides) {
    //slides.startAutoplay();
  }

  getNotificationCount() {
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
        this.productioncount = resultdata.productioncount;
        this.productioncountlength = this.productioncount.toString().length;

        this.maintenancecount = resultdata.maintenancecount;
        this.maintenancecountlength = this.maintenancecount.toString().length;
      } else {
        this.productioncount = 0;
        this.productioncountlength = this.productioncount.toString().length;

        this.maintenancecount = 0;
        this.maintenancecountlength = this.maintenancecount.toString().length;
      }
    });
  }

  getNotificationPendingCount() {
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
          this.oillossesreportForm.controls.pickdate.setValue(this.reportdate);
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  getBackgroundColor(value) {
    let color;
    if (value == 0) {
      color = "#008000";
    } else {
      color = "#ff6060";
    }
    return color;
  }

  getreport() {
    if (this.reportdate != "") {
      this.getDate = moment(this.reportdate, "DD-MM-YYYY").format("YYYY-MM-DD");
    } else {
      this.getDate = "";
    }

    this.pressdataArr = [];
    this.oillossesArr = [];
    this.norecordsflag = false;
    this.pleasewaitflag = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      Fromdate: "",
      language: this.languageService.selected,
    };

    //console.log(req);

    this.supervisorservice.getOillossesvalues(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      this.generalArr = resultdata;
      this.oillossesArr = resultdata.data;

      this.title = resultdata.heading;
      this.note = resultdata.para;
      this.reportdate = moment(resultdata.Fromdate, "YYYY-MM-DD").format(
        "DD-MM-YYYY"
      );

      if (resultdata.httpcode == 200) {
        for (let i = 0; i < this.oillossesArr.length; i++) {
          for (let j = 0; j < this.oillossesArr[i].pressdata.length; j++) {
            this.pressdataArr.push(this.oillossesArr[i].pressdata[j]);
          }
        }
        //console.log("Press data Arr :", this.pressdataArr);

        this.norecordsflag = false;

        this.pleasewaitflag = false;

        this.didInit = true;
      } else {
        this.oillossesArr = [];

        this.norecordsflag = true;

        this.pleasewaitflag = false;

        this.didInit = false;
      }
    });
  }

  navigate() {
    this.router.navigate(["/oillosses-new", { reportdate: this.reportdate }]);
  }

  cancel() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
  async open_modal(item, type) {
    console.log("Type:", type);
    const modal = await this.modalController.create({
      component: OillossRecomandationModalPage,
      componentProps: {
        item: JSON.stringify(item),
        type: type,
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ["owneroiloss-modal"],
    });

    modal.onDidDismiss().then((modeldata) => {});

    return await modal.present();
  }
}
