import { Component, OnInit, NgZone } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

@Component({
  selector: "app-production-sterilizerpress-hourlyreporting",
  templateUrl: "./production-sterilizerpress-hourlyreporting.page.html",
  styleUrls: ["./production-sterilizerpress-hourlyreporting.page.scss"],
})
export class ProductionSterilizerpressHourlyreportingPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  designationId = this.userlist.desigId;

  count = 0;

  productionhourlyreportingArr = [
    [
      {
        title: this.translate.instant("PRODUCTIONHOME.pressingstation"),
        name: "Pressing Station",
        path: "/production-hourlypressingstation",
        imgpath: "../../assets/img/pressingstation.png",
      },
      {
        title: this.translate.instant("PRODUCTIONHOME.sterilizationstation"),
        name: "Sterilisation Station",
        path: "/production-hourlysterilizerstation",
        imgpath: "../../assets/img/sterilisationstation.png",
      },
    ],
    /*[
      {
        title: "Kernel Station",
        name: "Kernel Station",
        path: "/maintenance-report",
        imgpath: "../../assets/img/kernalrecoverystation.png",
      },
    ],
    [
      {
        title: "Clarification Station",
        name: "Clarification Station",
        path: "/maintenance-report",
        imgpath: "../../assets/img/clarificationstation.png",
      },
    ],*/
  ];

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private router: Router,
    private alertController: AlertController,
    private commonservice: AIREIService,
    private service: SupervisorService
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();
  }

  ionViewDidEnter() {
    //this.getPerformanceDetails();
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();
  }

  btn_notification() {
    localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);
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
      }
    );
  }

  btn_Action(item) {
    if (
      (item.name == "Pressing Station" && this.designationId == 7) ||
      (item.name == "Sterilisation Station" && this.designationId == 8)
    ) {
      this.router.navigate([item.path]);

      /*if (localStorage.getItem("runninghourid") == "0") {
        this.showalert(item);
      } else {
        this.router.navigate([item.path]);
      }*/
    } else if (item.name == "Pressing Station" && this.designationId != 7) {
      this.commonservice.presentToast(
        this.translate.instant("PRODUCTIONHOME.accessdenied")
      );
    } else if (
      item.name == "Sterilisation Station" &&
      this.designationId != 18
    ) {
      this.commonservice.presentToast(
        this.translate.instant("PRODUCTIONHOME.accessdenied")
      );
    } else {
      this.commonservice.presentToast(
        this.translate.instant("PRODUCTIONHOME.featuretobeupgraded")
      );
    }
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
}
