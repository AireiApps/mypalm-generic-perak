import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
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

import { SchedulePage } from "src/app/maintenance-module/schedule/schedule.page";

import { Market } from "@ionic-native/market/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";

// Language Convertion
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

@Component({
  selector: "app-owner-reports",
  templateUrl: "./owner-reports.page.html",
  styleUrls: ["./owner-reports.page.scss"],
})
export class OwnerReportsPage implements OnInit {
  @ViewChild("myElementRef", { static: false }) myElementRef: ElementRef;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;
  usermillcode = this.userlist.millcode;

  //mill_name = appsettings.MILL_NAME;

  mill_name = this.nl2br(this.userlist.millname);

  count = 0;

  productioncount = 0;
  productioncountlength = 0;

  maintenancecount = 0;
  maintenancecountlength = 0;

  getplatform: string;

  reportsArr = [
    [
      {
        title: this.translate.instant("PRODUCTIONHOME.gradingtitle"),
        subtitle: this.nl2br("<br>"),
        //subtitle: "",
        path: "/grading-report",
        imgpath: "../../assets/img/gradingreport.png",
      },
      {
        title: this.translate.instant("PRODUCTIONHOME.sterilizationtitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.subtitlestation"),
        path: "/report-sterilizerhourlyperformance",
        imgpath: "../../assets/img/sterilizer_ report.png",
      },
    ],
    [
      {
        title: this.translate.instant("PRODUCTIONHOME.pressingtitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.pressingsubtitle"),
        path: "/report-pressstationhourlyperformance",
        imgpath: "../../assets/img/press_report.png",
      },
      {
        title: "Oil Losses",
        subtitle: "Summary",
        name: "Oil Losses Summary",
        path: "/oilloss-reports",
        imgpath: "../../assets/img/oil_loss.png",
      },
    ],
    [
      {
        title: this.translate.instant("PRODUCTIONHOME.correctivetitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.correctivesubtitle"),
        name: "Corrective Maintenance",
        path: "/report-production-maintenance-notification",
        imgpath: "../../assets/img/corrective_report.png",
      },
      {
        title: "Abnormal",
        subtitle: "Report",
        name: "Abnormal Report",
        path: "/abnormal-report-screen",
        imgpath: "../../assets/img/pressmachineroutinecheck.png",
      },
    ],
    [
      {
        title: this.translate.instant("PRODUCTIONHOME.preventivetitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.preventivesubtitle"),
        name: "Preventive Maintenance",
        path: "/report-pvrpv",
        imgpath: "../../assets/img/preventive_report.png",
      },
      {
        title: "Running Hours",
        subtitle: this.nl2br("<br>"),
        name: "Running Hours",
        path: "/owner-machinerunninghours",
        imgpath: "../../assets/img/machinerunninghours.png",
      },
    ],
    [
      {
        title: "Performance",
        subtitle: "Analysis",
        name: "Oil Losses Data Analysis",
        path: "/owner-oillosses-dataanalysis",
        imgpath: "../../assets/img/performanceanalysis.png",
      },
    ],
  ];

  currentlanguage = "";

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
    private animationCtrl: AnimationController,
    private screenOrientation: ScreenOrientation
  ) {
    this.currentlanguage = this.languageService.selected;

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

  ngOnInit() {}

  ngAfterViewInit(): void {
    /*if(this.userlist.dept_id==7 && this.userlist.desigId!=1)
    {
      PushNotifications.removeAllDeliveredNotifications();

      this.count = parseInt(localStorage.getItem("badge_count"));
      this.notifi.updateNotification();
      this.updateNotification();
      this.getLiveNotification();

      this.forceUpdated();
    }*/
  }

  ionViewDidEnter() {
    /*if(this.userlist.dept_id==7 && this.userlist.desigId!=1)
    {
      PushNotifications.removeAllDeliveredNotifications();

      this.count = parseInt(localStorage.getItem("badge_count"));
      this.notifi.updateNotification();
      this.updateNotification();
      this.getLiveNotification();

      this.forceUpdated();
    }*/

    const animation: Animation = this.animationCtrl
      .create()
      .addElement(this.myElementRef.nativeElement)
      .duration(1000)
      .fromTo("opacity", "0", "1");

    animation.play();

    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();
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

  btn_notification(value) {
    localStorage.setItem("badge_count", "0");
    //this.router.navigate(["/segregatenotification"]);

    if (value == "Production") {
      this.router.navigate(["/tabs/tabproduction"]);
    } else {
      this.router.navigate(["/tabs/tabmaintenance"]);
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

        this.getNotificationCount();
      }
    );
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

  getNotificationCount() {
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

  btn_Action(item) {
    if (item.name == "Add New Job") {
      this.callmodalcontroller(item.name);
    } else {
      this.router.navigate([item.path]);
    }
  }

  btn_ReportAction(item) {
    this.router.navigate([item.path]);
  }

  async callmodalcontroller(value) {
    const modal = await this.modalController.create({
      component: SchedulePage,
    });

    modal.onDidDismiss().then((data) => {
      this.ngAfterViewInit();
    });

    return await modal.present();
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
