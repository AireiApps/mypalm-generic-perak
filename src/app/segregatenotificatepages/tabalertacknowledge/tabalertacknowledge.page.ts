import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { Platform, ModalController, AlertController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;
import * as moment from "moment";
// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

// Modal Pages - Start
import { AlertacknowledgePage } from "src/app/segregatenotificatepages/alertacknowledge/alertacknowledge.page";
// Modal Pages - End

@Component({
  selector: "app-tabalertacknowledge",
  templateUrl: "./tabalertacknowledge.page.html",
  styleUrls: ["./tabalertacknowledge.page.scss"],
})
export class TabalertacknowledgePage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  mill_name = this.nl2br(this.userlist.millname);
  departmentid = this.userlist.dept_id;
  designationid = this.userlist.desigId;
  count = 0;
  pendingcount = 0;
  pendingcountlength = 0;

  todaysnotificationArr = [];
  oldernotificationArr = [];

  todaysnotificationcount = 0;
  oldernotificationcount = 0;

  todaysnotificationflag = false;
  oldernotificationflag = false;

  todaysnotificationclick = 0;
  oldernotificationclick = 0;

  filterstatus = "";
  enableflag = false;
  isDisable = false;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  alertnotificationArr = [];

  getplatform: string;

  constructor(
    private platform: Platform,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private commonservice: AIREIService,
    private activatedroute: ActivatedRoute,
    private alertController: AlertController,
    public modalController: ModalController,
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
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );

      if (this.designationid == "3") {
        this.getalert();
      } else {
        this.getNotification();
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {}

  ionViewDidEnter() {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();
  }

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem("badge_count"));

      if (this.designationid == "3") {
        this.getalert();
      } else {
        this.getNotification();
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
    localStorage.setItem("badge_count", "0");

    this.updateNotification();
    this.getLiveNotification();

    if (this.designationid == "3") {
      this.getalert();
    } else {
      this.getNotification();
    }
  }

  getProductionPendingCount() {
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

  geBorderColor(value) {
    let color;

    if (value == "") {
      color = "#ffffff";
    }

    // Sterilizer
    if (value == "1") {
      color = "#FF9800";
    }

    // Press
    if (value == "2") {
      color = "#03A9F4";
    }

    // Oil loss
    if (value == "3") {
      color = "#F44336";
    }

    // Grading
    if (value == "4") {
      color = "#4CAF50";
    }

    return color;
  }

  getBackgroundColor(value) {
    //console.log(value);

    let color;

    if (value == "") {
      color = "#ffffff";
    }

    // Sterilizer
    if (value == "1") {
      color = "#FFF3E0";
    }

    // Press
    if (value == "2") {
      color = "#E1F5FE";
    }

    // Oil loss
    if (value == "3") {
      color = "#FFEBEE";
    }

    // Grading
    if (value == "4") {
      color = "#E8F5E9";
    }

    return color;
  }

  getTextColor(value) {
    let color;

    color = "#ffffff";

    return color;
  }

  gettodaysnotification() {
    if (this.todaysnotificationclick == 0) {
      this.todaysnotificationclick = 1;
    } else {
      this.todaysnotificationclick = 0;
    }
    this.oldernotificationclick = 0;

    if (this.todaysnotificationclick == 1) {
      this.todaysnotificationflag = true;
    } else {
      this.todaysnotificationflag = false;
    }
    this.oldernotificationflag = false;
  }

  getoldernotification() {
    this.todaysnotificationclick = 0;
    if (this.oldernotificationclick == 0) {
      this.oldernotificationclick = 1;
    } else {
      this.oldernotificationclick = 0;
    }

    this.todaysnotificationflag = false;
    if (this.oldernotificationclick == 1) {
      this.oldernotificationflag = true;
    } else {
      this.oldernotificationflag = false;
    }
  }

  getNotification() {
    this.filterstatus = "3";

    const req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      filter: this.filterstatus,
      language: this.languageService.selected,
    };

    this.commonservice.getsegregatenotification(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.todaysnotificationcount = resultdata.todaycount;
        this.oldernotificationcount = resultdata.oldercount;

        this.todaysnotificationArr = resultdata.data.today;
        this.oldernotificationArr = resultdata.data.older;

        this.enableflag = false;

        this.getProductionPendingCount();
      } else {
        this.todaysnotificationcount = 0;
        this.oldernotificationcount = 0;

        this.todaysnotificationArr = [];
        this.oldernotificationArr = [];

        this.enableflag = true;

        this.getProductionPendingCount();
      }
    });
  }

  getalert() {
    const req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      millcode: this.userlist.millcode,
      filter: "4",
      language: this.languageService.selected,
    };

    //console.log(req);

    this.commonservice.getalertnotification(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.todaysnotificationcount = resultdata.todaycount;
        this.oldernotificationcount = resultdata.oldercount;

        this.todaysnotificationArr = resultdata.data.today;
        this.oldernotificationArr = resultdata.data.older;

        if (this.todaysnotificationArr.length > 0) {
          let eachArr = [];

          for (let i = 0; i < this.todaysnotificationArr.length; i++) {
            let eachitem = this.todaysnotificationArr[i];
            let eachreq = {
              redirect: eachitem.redirect,
              rectify_status: eachitem.rectify_status,
              notification_date: eachitem.notification_date,
              rectify_remarks: eachitem.rectify_remarks,
              id: eachitem.id,
              baseid: eachitem.baseid,
              title: eachitem.title,
              notification_text: this.nl2br(eachitem.notification_text),
              status: eachitem.status,
              type: eachitem.type,
            };

            eachArr.push(eachreq);
          }

          this.todaysnotificationArr = eachArr;
        }

        if (this.oldernotificationArr.length > 0) {
          let eachArr = [];

          for (let i = 0; i < this.oldernotificationArr.length; i++) {
            let eachitem = this.oldernotificationArr[i];
            let eachreq = {
              redirect: eachitem.redirect,
              rectify_status: eachitem.rectify_status,
              notification_date: eachitem.notification_date,
              rectify_remarks: eachitem.rectify_remarks,
              id: eachitem.id,
              baseid: eachitem.baseid,
              title: eachitem.title,
              notification_text: this.nl2br(eachitem.notification_text),
              status: eachitem.status,
              type: eachitem.type,
            };

            eachArr.push(eachreq);
          }

          this.oldernotificationArr = eachArr;
        }

        this.enableflag = false;

        this.getProductionPendingCount();
      } else {
        this.todaysnotificationcount = 0;
        this.oldernotificationcount = 0;

        this.todaysnotificationArr = [];
        this.oldernotificationArr = [];

        this.enableflag = true;

        this.getProductionPendingCount();
      }
    });
  }

  btn_rectify(value) {
    //this.save("", "1", value.baseid, value.id, value.type);

    this.callmodalcontroller(value);
  }

  btn_notrectify(value) {
    //let alertmessage = "Please enter Reason for Breakdown and Balance Crop";
    let alertmessage = this.translate.instant("ALERTACKNOWLEDGE.reasontitle");

    this.alertController
      .create({
        mode: "md",
        header: "",
        message: alertmessage,
        cssClass: "customalertmessagetwobuttons",
        backdropDismiss: false,
        inputs: [
          {
            name: "reason",
            type: "textarea",
            cssClass: "alertinput",
            placeholder: this.translate.instant(
              "ALERTACKNOWLEDGE.reasonplaceholder"
            ),
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
                this.save(data.reason, "2", value.baseid, value.id, value.type);
              } else {
                this.commonservice.presentToast(
                  this.translate.instant("ALERTACKNOWLEDGE.reasonmandatory")
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

  save(getreason, getrectifystatus, getbaseid, getid, gettype) {
    var req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      baseid: getbaseid,
      id: getid,
      type: gettype,
      rectify_status: getrectifystatus,
      remarks: getreason,
      language: this.languageService.selected,
    };

    console.log(req);

    this.commonservice.updatealertnotification(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        this.isDisable = false;

        if (getrectifystatus == "2") {
          this.commonservice.presentToast(
            this.translate.instant("ALERTACKNOWLEDGE.unabletorectifysuccess")
          );
        }

        this.getalert();
      } else {
        this.isDisable = false;
        if (getrectifystatus == "2") {
          this.commonservice.presentToast(
            this.translate.instant("ALERTACKNOWLEDGE.unabletorectifyfailed")
          );
        }
      }
    });
  }

  updateAlertNotification(value) {
    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      id: value.id,
      filter: this.filterstatus,
      language: this.languageService.selected,
    };

    this.commonservice.deletedasboardnotification(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        if (value.rectify_status == 0) {
          this.redirectcontroller(value);
        }
      } else {
        this.commonservice.presentToast(
          this.translate.instant("SEGREGATENOTIFICATION.message")
        );
      }
    });
  }

  redirectcontroller(value) {
    this.getNotification();

    if (value.redirect == "HOURLY PRESS") {
      this.router.navigate(["/production-hourlypressingstation"]);
    } else if (value.redirect == "HOURLY STERILIZER") {
      this.router.navigate(["/production-hourlysterilizerstation"]);
    } else if (value.redirect == "HIGH OIL LOSS") {
      this.router.navigate(["/tabs/taboilloss"]);
    }
  }

  async callmodalcontroller(value) {
    const modal = await this.modalController.create({
      component: AlertacknowledgePage,
      componentProps: {
        item: JSON.stringify(value),
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ["alertattend-modal"],
    });

    modal.onDidDismiss().then((data) => {
      this.getalert();
    });

    return await modal.present();
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
