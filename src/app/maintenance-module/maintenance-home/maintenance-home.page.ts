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
  ModalController,
  AlertController,
  Platform,
  Animation,
  AnimationController,
  IonSlides,
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

import { SchedulePage } from "src/app/maintenance-module/schedule/schedule.page";

import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

import { Market } from "@ionic-native/market/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { MaintenanceServiceService } from "src/app/services/maintenance-serivce/maintenance-service.service";

// Custom Datepicker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

import { MaintenanceNotificationAcceptModalPage } from "src/app/maintenance-module/maintenance-notification-accept-modal/maintenance-notification-accept-modal.page";
import { MaintenanceFitterwiremanVerifyAcknowledgePage } from "src/app/maintenance-module/maintenance-fitterwireman-verify-acknowledge/maintenance-fitterwireman-verify-acknowledge.page";

@Component({
  selector: "app-maintenance-home",
  templateUrl: "./maintenance-home.page.html",
  styleUrls: ["./maintenance-home.page.scss"],
})
export class MaintenanceHomePage implements OnInit {
  @ViewChild("myElementRef", { static: false }) myElementRef: ElementRef;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  usermillcode = this.userlist.millcode;
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;
  oillossnotificationflag = this.userlist.oilloss_notification_flag;

  //mill_name = appsettings.MILL_NAME;

  mill_name = this.nl2br(this.userlist.millname);

  count = 0;
  startstopstatus = 0;

  dcrecords = 0;
  pvrecords = 0;
  rpvrecords = 0;
  cmrecords = 0;

  dcenableflag = false;
  pvenableflag = false;
  rpvenableflag = false;
  cmenableflag = false;

  pleasewaitflag = false;

  labArr = [
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.oillosses"),
        path: "/lab-oillosses-list",
        imgpath: "../../assets/img/oil_loss.png",
      },
    ],
  ];

  labreportsArr = [
    // {
    //   title: "Machineries Running Hours",
    //   path: "/report-machineryrunninghour",
    //   imgpath: "../../assets/img/bg_machinerrunninghours_report.png",
    // },
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.sterilizationtitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.subtitlestation"),
        path: "/report-sterilizerhourlyperformance",
        imgpath: "../../assets/img/sterilizer_ report.png",
      },
      {
        title: this.translate.instant("MAINTENANCEHOME.pressingtitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.pressingsubtitle"),
        path: "/report-pressstationhourlyperformance",
        imgpath: "../../assets/img/press_report.png",
      },
    ],
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.oiltitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.oilsubtitle"),
        path: "/lab-oillossesreport",
        imgpath: "../../assets/img/oil_loss_report.png",
      },
    ],
  ];

  managerproductionreportsArr = [
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.sterilizationtitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.subtitlestation"),
        path: "/report-sterilizerhourlyperformance",
        imgpath: "../../assets/img/sterilizer_ report.png",
      },
      {
        title: this.translate.instant("MAINTENANCEHOME.pressingtitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.pressingsubtitle"),
        path: "/report-pressstationhourlyperformance",
        imgpath: "../../assets/img/press_report.png",
      },
    ],
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.oiltitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.oilsubtitle"),
        path: "/lab-oillossesreport",
        imgpath: "../../assets/img/oil_loss_report.png",
      },
      {
        title: this.translate.instant("MAINTENANCEHOME.predictiontitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.predictionsubtitle"),
        path: "/dashboard-oilloss-predictionanalysis",
        //path: "/dashboard-forecasting",
        imgpath: "../../assets/img/prediction.png",
      },
    ],
  ];

  managermaintenancereportsArr = [
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.correctivetitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.correctivesubtitle"),
        path: "/report-maintenance-notification",
        imgpath: "../../assets/img/corrective_report.png",
      },
      {
        title: this.translate.instant("MAINTENANCEHOME.preventivetitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.preventivesubtitle"),
        path: "/report-pvrpv",
        imgpath: "../../assets/img/preventive_report.png",
      },
    ],
    // [
    //   {
    //     title: "Machineries",
    //     subtitle: "Running Hours",
    //     path: "/report-machineryrunninghour",
    //     imgpath: "../../assets/img/bg_machinerrunninghours_report.png",
    //   },
    // ],
  ];

  engineerArr = [
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.correctivetitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.correctivesubtitle"),
        name: "Maintenance Notification",
        path: "/maintenance-notification-list",
        imgpath: "../../assets/img/corrective.png",
      },
      {
        title: this.translate.instant("MAINTENANCEHOME.preventivetitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.preventivesubtitle"),
        name: "Preventive Maintenance",
        path: "/maintenance-pvrpv-list",
        imgpath: "../../assets/img/preventive.png",
      },
    ],
  ];

  engineerReportsArr = [
    /*{
      title: "Preventive Maintenance",
      name: "Preventive Maintenance",
      path: "/report-pvrpv",
      imgpath: "../../assets/img/bg_preventivemaintenance_report.png",
    },
    {
      title: "Corrective Maintenance",
      name: "Corrective Maintenance",
      path: "/report-maintenance-notification",
      imgpath: "../../assets/img/bg_correctivemaintenance_report.png",
    },*/
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.sterilizationtitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.subtitlestation"),
        path: "/report-sterilizerhourlyperformance",
        imgpath: "../../assets/img/sterilizer_ report.png",
      },
      {
        title: this.translate.instant("MAINTENANCEHOME.pressingtitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.pressingsubtitle"),
        path: "/report-pressstationhourlyperformance",
        imgpath: "../../assets/img/press_report.png",
      },
      // {
      //     title: "Machineries",
      //     subtitle: "Running Hours",
      //     path: "/report-machineryrunninghour",
      //     imgpath: "../../assets/img/bg_machinerrunninghours_report.png",
      // },
    ],
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.oiltitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.oilsubtitle"),
        path: "/lab-oillossesreport",
        imgpath: "../../assets/img/oil_loss_report.png",
      },
      {
        title: this.translate.instant("MAINTENANCEHOME.predictiontitle"),
        subtitle: this.translate.instant("MAINTENANCEHOME.predictionsubtitle"),
        name: "Prediction Analysis",
        path: "/dashboard-oilloss-predictionanalysis",
        imgpath: "../../assets/img/prediction.png",
      },
    ],
  ];

  foremanArr = [
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.correctivemaintenance"),
        name: "Maintenance Notification",
        path: "/maintenance-foreman-notification-list",
        imgpath: "../../assets/img/corrective.png",
      },
      {
        title: this.translate.instant("MAINTENANCEHOME.preventivemaintenance"),
        name: "Preventive Maintenance",
        path: "/maintenance-foreman-pvrpv-list",
        imgpath: "../../assets/img/preventive.png",
      },
    ],
  ];

  foremanReportsArr = [
    [
      {
        title: this.translate.instant("MAINTENANCEHOME.preventivemaintenance"),
        name: "Preventive Maintenance",
        path: "/report-pvrpv",
        imgpath: "../../assets/img/preventive_report.png",
      },
      {
        title: this.translate.instant("MAINTENANCEHOME.correctivemaintenance"),
        name: "Corrective Maintenance",
        path: "/report-maintenance-notification",
        imgpath: "../../assets/img/corrective_report.png",
      },
      // {
      //   title: "Machineries Running Hours",
      //   path: "/report-machineryrunninghour",
      //   imgpath: "../../assets/img/bg_machinerrunninghours_report.png",
      // },
    ],
  ];

  dclistArr = [];
  pvlistArr = [];
  rpvlistArr = [];
  cmlistArr = [];

  currentlanguage = "";
  getDate = "";

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");
  fromdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  maintenancehomeForm;

  tabs_segment = "";

  dccolor = "#FFFF00";
  pvcolor = "#000000";
  rpvcolor = "#000000";
  cmcolor = "#000000";

  notificationdate = "";
  notificationdata;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    public modalController: ModalController,
    private alertController: AlertController,
    private zone: NgZone,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private fb: FormBuilder,
    private notifi: AuthGuardService,
    private commonservice: AIREIService,
    private platform: Platform,
    private appVersion: AppVersion,
    private market: Market,
    private animationCtrl: AnimationController,
    private service: MaintenanceServiceService,
    private screenOrientation: ScreenOrientation
  ) {
    this.currentlanguage = this.languageService.selected;

    this.notificationdate =
      this.activatedroute.snapshot.paramMap.get("reportdate");

    this.maintenancehomeForm = this.fb.group({
      pickdate: new FormControl(this.fromdate),
    });

    this.tabs_segment = "Routine Preventive Maintenance";

    if (
      this.userdepartmentid == 7 &&
      (this.userdesignation == 5 || this.userdesignation == 11)
    ) {
      this.activatedroute.params.subscribe((val) => {
        if (
          this.screenOrientation.type == "landscape" ||
          this.screenOrientation.type == "landscape-primary" ||
          this.screenOrientation.type == "landscape-secondary"
        ) {
          this.screenOrientation.lock(
            this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
          );
        }

        if (localStorage.getItem("notificationdata") != "") {
          this.notificationdata = localStorage.getItem("notificationdata");

          if (
            this.notificationdata !== "undefined" &&
            this.notificationdata !== null
          ) {
            if (
              this.notificationdata ==
              "ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION"
            ) {
              if (
                typeof this.notificationdata.fromdate !== "undefined" &&
                this.notificationdata.fromdate !== null &&
                this.notificationdata.fromdate != ""
              ) {
                this.fromdate = moment(
                  this.notificationdata.fromdate,
                  "YYYY-MM-DD"
                ).format("DD-MM-YYYY");

                this.maintenancehomeForm.controls.pickdate.setValue(
                  this.fromdate
                );
              }

              localStorage.setItem("notificationdata", "");

              this.tabs_segment = "Routine Preventive Maintenance";

              this.getDCList();
            } else if (
              this.notificationdata ==
              "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION"
            ) {
              if (
                typeof this.notificationdata.fromdate !== "undefined" &&
                this.notificationdata.fromdate !== null &&
                this.notificationdata.fromdate != ""
              ) {
                this.fromdate = moment(
                  this.notificationdata.fromdate,
                  "YYYY-MM-DD"
                ).format("DD-MM-YYYY");

                this.maintenancehomeForm.controls.pickdate.setValue(
                  this.fromdate
                );
              }

              localStorage.setItem("notificationdata", "");

              this.tabs_segment = "Replacement Preventive Maintenance";

              this.getPVList();
            } else if (
              this.notificationdata == "CORRECTIVE MAINTENANCE NOTIFICATION"
            ) {
              if (
                typeof this.notificationdata.fromdate !== "undefined" &&
                this.notificationdata.fromdate !== null &&
                this.notificationdata.fromdate != ""
              ) {
                this.fromdate = moment(
                  this.notificationdata.fromdate,
                  "YYYY-MM-DD"
                ).format("DD-MM-YYYY");

                this.maintenancehomeForm.controls.pickdate.setValue(
                  this.fromdate
                );
              }

              localStorage.setItem("notificationdata", "");

              this.tabs_segment = "Corrective Maintenance";

              this.getCMList();
            }
          } else {
            if (this.tabs_segment == "Routine Preventive Maintenance") {
              this.getDCList();
            } else if (
              this.tabs_segment == "Replacement Preventive Maintenance"
            ) {
              this.getPVList();
            } else if (this.tabs_segment == "Corrective Maintenance") {
              this.getCMList();
            }
          }
        } else {
          if (this.tabs_segment == "Routine Preventive Maintenance") {
            this.getDCList();
          } else if (
            this.tabs_segment == "Replacement Preventive Maintenance"
          ) {
            this.getPVList();
          } else if (this.tabs_segment == "Corrective Maintenance") {
            this.getCMList();
          }
        }

        this.ionViewDidEnter();
      });
    }
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.userlist.dept_id == 25) {
      const animation: Animation = this.animationCtrl
        .create()
        .addElement(this.myElementRef.nativeElement)
        .duration(1000)
        .fromTo("opacity", "0", "1");

      animation.play();
    } else {
      const animation: Animation = this.animationCtrl
        .create()
        .addElement(this.myElementRef.nativeElement)
        .duration(1000)
        .fromTo("transform", "translateX(600px)", "translateX(0px)")
        .fromTo("opacity", "0", "1");

      animation.play();
    }

    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    this.forceUpdated();
  }

  ionViewDidEnter() {
    if (this.userlist.dept_id == 25) {
      const animation: Animation = this.animationCtrl
        .create()
        .addElement(this.myElementRef.nativeElement)
        .duration(1000)
        .fromTo("opacity", "0", "1");

      animation.play();
    }

    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    this.forceUpdated();
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

  slideOpts = {
    slidesPerView: 1.5,
    centeredSlides: true,
    speed: 300,
    loop: true,
  };

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  openDateTimePicker(type) {
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
          if (type == "FD") {
            this.fromdate = val.value;
            this.maintenancehomeForm.controls.pickdate.setValue(this.fromdate);
          }
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  getStatusColor(status) {
    let color;

    if (status == "ROUT") {
      //color = "#87D37C";
      color = "#ffffff";
    }

    if (status == "REPL") {
      //color = "#ffffb3";
      color = "#ffffff";
    }

    if (status == "CM") {
      //color = "#66ccff";
      color = "#ffffff";
    }

    if (status == "RPV") {
      //color = "#ff4d4d";
      color = "#ffffff";
    }

    return color;
  }

  getBackgroundColor(status) {
    let color;

    if (status == "") {
      color = "#ffffff";
    }

    if (status == "ROUT") {
      //color = "#efffed";
      color = "#ffffff";
    }

    if (status == "REPL") {
      //color = "#ffffe6";
      color = "#ffffff";
    }

    if (status == "CM") {
      //color = "#e9f8ff";
      color = "#ffffff";
    }

    if (status == "RPV") {
      color = "#ff4d4d";
    }

    return color;
  }

  getTextColor(status) {
    let color;

    if (status == "RoPM") {
      color = "#000000";
    }

    if (status == "RePM") {
      color = "#000000";
    }

    if (status == "CM") {
      color = "#000000";
    }

    if (status == "RPV") {
      color = "#000000";
    }

    return color;
  }

  getBadgeColor(status) {
    let color;

    if (status == "RoPM") {
      color = "#ffbf00";
    }

    return color;
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

    return color;
  }

  btn_notification() {
    localStorage.setItem("badge_count", "0");

    this.router.navigate(["/segregatenotification"]);
  }

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem("badge_count"));

      // To call the api when notificaton comes
      if (
        this.userdepartmentid == 7 &&
        (this.userdesignation == 5 || this.userdesignation == 11)
      ) {
        if (this.tabs_segment == "Routine Preventive Maintenance") {
          this.getDCList();
        } else if (this.tabs_segment == "Replacement Preventive Maintenance") {
          this.getPVList();
        } else if (this.tabs_segment == "Corrective Maintenance") {
          this.getCMList();
        }
      }
    });
  }

  getLiveNotification() {
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        // alert('Push received: ' + JSON.stringify(notification));
        this.updateNotification();
      }
    );
  }

  getDCList() {
    this.dclistArr = [];
    this.dcenableflag = false;
    this.pleasewaitflag = true;

    this.getDate = moment(this.fromdate, "DD-MM-YYYY").format("YYYY-MM-DD");

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      fromdate: this.getDate,
      type: "ROUT" /*ROUT changes as Routine Preventive Maintenance*/,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getFitterNotificationList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.dclistArr = resultdata.data;

        this.dcrecords = resultdata.routcount;
        this.pvrecords = resultdata.replcount;
        this.rpvrecords = resultdata.rpvcount;
        this.cmrecords = resultdata.cmcount;

        this.dcenableflag = false;

        this.pleasewaitflag = false;
      } else {
        this.dclistArr = [];

        this.dcrecords = resultdata.routcount;
        this.pvrecords = resultdata.replcount;
        this.rpvrecords = resultdata.rpvcount;
        this.cmrecords = resultdata.cmcount;

        this.dcenableflag = true;

        this.pleasewaitflag = false;
      }
    });
  }

  getPVList() {
    this.pvlistArr = [];
    this.pvenableflag = false;
    this.pleasewaitflag = true;

    this.getDate = moment(this.fromdate, "DD-MM-YYYY").format("YYYY-MM-DD");

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      fromdate: this.getDate,
      type: "REPL" /*REPL changed as Replace Preventive Maintenance*/,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getFitterNotificationList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.pvlistArr = resultdata.data;

        this.dcrecords = resultdata.routcount;
        this.pvrecords = resultdata.replcount;
        this.rpvrecords = resultdata.rpvcount;
        this.cmrecords = resultdata.cmcount;

        this.pvenableflag = false;

        this.pleasewaitflag = false;
      } else {
        this.pvlistArr = [];

        this.dcrecords = resultdata.routcount;
        this.pvrecords = resultdata.replcount;
        this.rpvrecords = resultdata.rpvcount;
        this.cmrecords = resultdata.cmcount;

        this.pvenableflag = true;

        this.pleasewaitflag = false;
      }
    });
  }

  getCMList() {
    this.cmlistArr = [];
    this.cmenableflag = false;
    this.pleasewaitflag = true;

    this.getDate = moment(this.fromdate, "DD-MM-YYYY").format("YYYY-MM-DD");

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      fromdate: this.getDate,
      type: "CM" /*Corrective Maintenance*/,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getFitterNotificationList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.cmlistArr = resultdata.data;

        this.dcrecords = resultdata.routcount;
        this.pvrecords = resultdata.replcount;
        this.rpvrecords = resultdata.rpvcount;
        this.cmrecords = resultdata.cmcount;

        this.cmenableflag = false;

        this.pleasewaitflag = false;
      } else {
        this.cmlistArr = [];

        this.dcrecords = resultdata.routcount;
        this.pvrecords = resultdata.replcount;
        this.rpvrecords = resultdata.rpvcount;
        this.cmrecords = resultdata.cmcount;

        this.cmrecords = 0;

        this.cmenableflag = true;

        this.pleasewaitflag = false;
      }
    });
  }

  btn_reportnotification() {
    this.router.navigate(["/notification-report"]);
  }

  btn_Action(item) {
    if (item.name == "Add New Job") {
      this.callmodalcontroller("");
    } else {
      this.router.navigate([item.path]);
    }
  }

  btn_ReportAction(item) {
    this.router.navigate([item.path, { reportdate: "" }]);
  }

  btn_NotificationNew() {
    this.router.navigate(["/maintenance-notification-new"]);
  }

  btn_Edit(value) {
    if (value.type == "ROUT") {
      /*this.router.navigate([
        "/maintenance-preventivemaintenance-edit",
        { item: JSON.stringify(value), from: "MH" },
      ]);*/

      this.callmodalcontroller(value);
    }

    if (value.type == "REPL") {
      this.callmodalcontroller(value);
    }

    if (value.type == "CM") {
      this.callmodalcontroller(value);
    }
  }

  taskstatus(value) {
    var req;

    if (value.status == 0) {
      this.startstopstatus = 1;

      req = {
        userid: this.userlist.userId,
        millcode: this.userlist.millcode,
        dept_id: this.userlist.dept_id,
        daily_checklist_id: value.id,
        stationid: value.stationid,
        equipmentid: value.equipmentid,
        status: this.startstopstatus,
        subtaskid: "",
        subtaskstatus: "",
        subtaskremarks: "",
        language: this.languageService.selected,
      };

      console.log(req);

      this.service.updateCheckListStatus(req).then((result) => {
        var resultdata: any;
        resultdata = result;

        if (resultdata.httpcode == 200) {
          this.router.navigate([
            "/maintenance-dailychecklist-edit",
            { item: JSON.stringify(value) },
          ]);
        } else {
          this.commonservice.presentToast("Checklist Saving Failed");
        }
      });
    } else {
      this.router.navigate([
        "/maintenance-dailychecklist-edit",
        { item: JSON.stringify(value) },
      ]);
    }
  }

  getRecords() {
    //console.log(this.tabs_segment);

    if (this.tabs_segment == "Routine Preventive Maintenance") {
      this.getDCList();
    } else if (this.tabs_segment == "Replacement Preventive Maintenance") {
      this.getPVList();
    } else if (this.tabs_segment == "Corrective Maintenance") {
      this.getCMList();
    }
  }

  segmentChanged(ev: any) {
    //console.log("Segment changed", ev.detail.value);
    if (ev.detail.value == "Routine Preventive Maintenance") {
      this.dccolor = "#FFFF00";
      this.pvcolor = "#000000";
      this.rpvcolor = "#000000";
      this.cmcolor = "#000000";

      this.getDCList();
    }

    if (ev.detail.value == "Replacement Preventive Maintenance") {
      this.dccolor = "#000000";
      this.pvcolor = "#FFFF00";
      this.rpvcolor = "#000000";
      this.cmcolor = "#000000";

      this.getPVList();
    }

    if (ev.detail.value == "Corrective Maintenance") {
      this.dccolor = "#000000";
      this.pvcolor = "#000000";
      this.rpvcolor = "#000000";
      this.cmcolor = "#FFFF00";

      this.getCMList();
    }
  }

  btn_NotificationView(value) {
    this.router.navigate([
      "/maintenance-dailychecklist-view",
      { item: JSON.stringify(value) },
    ]);
  }

  btn_NotificationAssign(value) {
    this.router.navigate([
      "/maintenance-preventivemaintenance-assign",
      { item: JSON.stringify(value) },
    ]);
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
      if (this.userlist.verificationacccess == 3) {
        const modal = await this.modalController.create({
          component: MaintenanceFitterwiremanVerifyAcknowledgePage,
          componentProps: {
            item: JSON.stringify(value),
          },
          showBackdrop: true,
          backdropDismiss: false,
          cssClass: ["notification-modal"],
        });

        modal.onDidDismiss().then((modaldata) => {
          if (modaldata["data"]["screen"] == "RePM") {
            this.tabs_segment = "Replacement Preventive Maintenance";
          } else if (modaldata["data"]["screen"] == "CM") {
            this.tabs_segment = "Corrective Maintenance";
          }
          this.getRecords();
        });

        return await modal.present();
      } else {
        const modal = await this.modalController.create({
          component: MaintenanceNotificationAcceptModalPage,
          componentProps: {
            item: JSON.stringify(value),
          },
          showBackdrop: true,
          backdropDismiss: false,
          cssClass: ["notification-modal"],
        });

        modal.onDidDismiss().then((modaldata) => {
          if (modaldata["data"]["screen"] == "RePM") {
            this.tabs_segment = "Replacement Preventive Maintenance";
          } else if (modaldata["data"]["screen"] == "CM") {
            this.tabs_segment = "Corrective Maintenance";
          }
          this.getRecords();
        });

        return await modal.present();
      }
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
