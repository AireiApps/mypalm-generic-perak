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
import {
  AlertController,
  Platform,
  Animation,
  AnimationController,
  IonSlides,
} from "@ionic/angular";

import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";

import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

import { Market } from "@ionic-native/market/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

@Component({
  selector: "app-production-sterilizerpress-home",
  templateUrl: "./production-sterilizerpress-home.page.html",
  styleUrls: ["./production-sterilizerpress-home.page.scss"],
})
export class ProductionSterilizerpressHomePage implements OnInit {
  @ViewChild("myElementRef", { static: false }) myElementRef: ElementRef;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;

  //mill_name = appsettings.MILL_NAME;

  mill_name = this.nl2br(this.userlist.millname);

  count = 0;

  pressArr = [
    [
      {
        title: this.translate.instant("PRODUCTIONHOME.pressingtitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.pressingsubtitle"),
        name: "Pressing Station",
        path: "/production-hourlypressingstation",
        imgpath: "../../assets/img/press.png",
      },
    ],
    /*[
      {
        title: "Reports",
        name: "Reports",
        path: "/production-report",
        imgpath: "../../assets/img/ceoreport.png",
      },
    ],*/
  ];

  pressreportsArr = [
    [
      // {
      //   title: "Machineries",
      //   subtitle: "Running Hours",
      //   path: "/report-machineryrunninghour",
      //   imgpath: "../../assets/img/bg_machinerrunninghours_report.png",
      // },

      {
        title: this.translate.instant("PRODUCTIONHOME.sterilizationtitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.subtitlestation"),
        path: "/report-sterilizerhourlyperformance",
        imgpath: "../../assets/img/sterilizer_ report.png",
      },
      {
        title: this.translate.instant("PRODUCTIONHOME.pressingtitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.pressingsubtitle"),
        path: "/report-pressstationhourlyperformance",
        imgpath: "../../assets/img/press_report.png",
      },
    ],
    [
      {
        title: this.translate.instant("PRODUCTIONHOME.oiltitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.oilsubtitle"),
        path: "/lab-oillossesreport",
        imgpath: "../../assets/img/oil_loss_report.png",
      },
    ],
  ];

  sterilizerArr = [
    [
      {
        title: this.translate.instant("PRODUCTIONHOME.sterilizationtitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.subtitlestation"),
        name: "Sterilization Station",
        path: "/production-hourlysterilizerstation",
        imgpath: "../../assets/img/sterilizer.png",
      },
    ],
    /*[
      {
        title: "Reports",
        name: "Reports",
        path: "/production-report",
        imgpath: "../../assets/img/ceoreport.png",
      },
    ],*/
  ];

  sterilizerreportsArr = [
    [
      // {
      //   title: "Machineries",
      //   subtitle: "Running Hours",
      //   path: "/report-machineryrunninghour",
      //   imgpath: "../../assets/img/bg_machinerrunninghours_report.png",
      // },

      {
        title: this.translate.instant("PRODUCTIONHOME.sterilizationtitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.subtitlestation"),
        path: "/report-sterilizerhourlyperformance",
        imgpath: "../../assets/img/sterilizer_ report.png",
      },
      {
        title: this.translate.instant("PRODUCTIONHOME.pressingtitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.pressingsubtitle"),
        path: "/report-pressstationhourlyperformance",
        imgpath: "../../assets/img/press_report.png",
      },
    ],
    [
      {
        title: this.translate.instant("PRODUCTIONHOME.oiltitle"),
        subtitle: this.translate.instant("PRODUCTIONHOME.oilsubtitle"),
        path: "/lab-oillossesreport",
        imgpath: "../../assets/img/oil_loss_report.png",
      },
    ],
  ];

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,

    private alertController: AlertController,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private platform: Platform,
    private appVersion: AppVersion,
    private market: Market,
    private animationCtrl: AnimationController,
    private service: SupervisorService
  ) {
    this.activatedroute.params.subscribe((val) => {
      PushNotifications.removeAllDeliveredNotifications();

      this.count = parseInt(localStorage.getItem("badge_count"));
      this.notifi.updateNotification();
      this.updateNotification();
      this.getLiveNotification();
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
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

  slideOpts = {
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true,
    speed: 300,
    loop: true,
  };

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  btn_Action(item) {
    if (this.userdesignation == 17 || this.userdesignation == 18) {
      if (localStorage.getItem("runninghourid") == "0") {
        this.showalert(item);
      } else {
        this.router.navigate([item.path]);
      }
    } else {
      this.router.navigate([item.path]);
    }
  }

  btn_ReportAction(item) {
    this.router.navigate([item.path, { reportdate: "" }]);
  }

  async showalert(item) {
    const alert = await this.alertController.create({
      mode: "md",
      header: "Nama",
      cssClass: "alertmessage",
      inputs: [
        {
          name: "name",
          placeholder: "Masukkan Nama",
        },
      ],
      buttons: [
        {
          text: this.translate.instant("GENERALBUTTON.cancelbutton"),
          role: "cancel",
          handler: (data) => {},
        },
        {
          text: this.translate.instant("GENERALBUTTON.savebutton"),
          handler: (data) => {
            this.saveName(item, data.name);
          },
        },
      ],
    });

    await alert.present();
  }

  saveName(item, name) {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      name: name,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.saveName(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        localStorage.setItem(
          "runninghourid",
          resultdata.data[0].running_user_id
        );

        this.router.navigate([item.path]);
      } else {
        this.commonservice.presentToast(
          this.translate.instant("PRODUCTIONHOME.namesavedfailed")
        );
      }
    });
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
