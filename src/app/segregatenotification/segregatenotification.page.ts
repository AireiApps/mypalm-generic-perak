import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { App, AppState } from "@capacitor/core";
import { AIREIService } from "src/app/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AlertController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

// Modal Pages - Start
import { AlertacknowledgePage } from "src/app/segregatenotificatepages/alertacknowledge/alertacknowledge.page";
// Modal Pages - End

@Component({
  selector: "app-segregatenotification",
  templateUrl: "./segregatenotification.page.html",
  styleUrls: ["./segregatenotification.page.scss"],
})
export class SegregatenotificationPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  departmentid = this.userlist.dept_id;
  designationid = this.userlist.desigId;
  oillossnotificationflag = this.userlist.oilloss_notification_flag;

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
  isModalActive = false;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  alertnotificationArr = [];

  currentorientation: string;

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private service: AIREIService,
    private activatedroute: ActivatedRoute,
    private alertController: AlertController,
    public modalController: ModalController,
    private router: Router,
    private location: Location,
    private screenOrientation: ScreenOrientation
  ) {
    if (
      this.designationid == "1" ||
      this.designationid == "3" ||
      this.designationid == "4" ||
      this.designationid == "5" ||
      this.designationid == "6" ||
      this.designationid == "7" ||
      this.designationid == "8" ||
      this.designationid == "9" ||
      this.designationid == "11"
    ) {
      this.activatedroute.params.subscribe((val) => {
        this.currentorientation = this.screenOrientation.type;

        if (
          this.screenOrientation.type == "landscape" ||
          this.screenOrientation.type == "landscape-primary" ||
          this.screenOrientation.type == "landscape-secondary"
        ) {
          this.screenOrientation.lock(
            this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
          );
        }

        if (this.designationid == "3") {
          this.getalert();
        } else {
          this.getNotification();
        }
      });
    }
  }

  ngOnInit() {
    //console.log("Init");

    App.addListener("appStateChange", (state: AppState) => {
      if (state.isActive == true) {
        if (this.router.url == "/segregatenotification") {
          if (!this.isModalActive) {
            this.reloadCurrentPage();
          }
        }
      } else if (state) {
      }
    });
  }

  ngAfterViewInit(): void {}

  ionViewDidEnter() {
    if (
      this.designationid == "1" ||
      this.designationid == "3" ||
      this.designationid == "4" ||
      this.designationid == "5" ||
      this.designationid == "6" ||
      this.designationid == "7" ||
      this.designationid == "8" ||
      this.designationid == "9" ||
      this.designationid == "11"
    ) {
      if (this.designationid == "3") {
        this.getalert();
      } else {
        this.getNotification();
      }
    }
  }

  ngOnDestroy() {
    if (this.designationid == 7 || this.designationid == 8) {
      if (this.currentorientation == "landscape-primary") {
        this.screenOrientation.unlock();
        this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.LANDSCAPE
        );
      }
    }
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

  reloadCurrentPage() {
    let currentUrl = this.router.url;

    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
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

  getalert() {
    const req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      millcode: this.userlist.millcode,
      filter: "4",
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getalertnotification(req).then((result) => {
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

        //console.log(this.oldernotificationArr);

        this.enableflag = false;
      } else {
        this.todaysnotificationcount = 0;
        this.oldernotificationcount = 0;

        this.todaysnotificationArr = [];
        this.oldernotificationArr = [];

        this.enableflag = true;
      }
    });
  }

  getNotification() {
    if (this.designationid == "1" || this.designationid == "3") {
      this.filterstatus = "4";
    } else if (
      this.designationid == "7" ||
      this.designationid == "8" ||
      this.designationid == "9"
    ) {
      this.filterstatus = "3";
    } else if (
      this.designationid == "4" ||
      this.designationid == "5" ||
      this.designationid == "6" ||
      this.designationid == "11"
    ) {
      this.filterstatus = "2";
    }

    const req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      filter: this.filterstatus,
      language: this.languageService.selected,
    };

    this.service.getsegregatenotification(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.todaysnotificationcount = resultdata.todaycount;
        this.oldernotificationcount = resultdata.oldercount;

        this.todaysnotificationArr = resultdata.data.today;
        this.oldernotificationArr = resultdata.data.older;

        this.enableflag = false;
      } else {
        this.todaysnotificationcount = 0;
        this.oldernotificationcount = 0;

        this.todaysnotificationArr = [];
        this.oldernotificationArr = [];

        this.enableflag = true;
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
            //cssClass: "cancelbutton",
            handler: (cancel) => {
              //console.log("Confirm Cancel");
            },
          },
          {
            text: "",
            //cssClass: "okaybutton",
            handler: (data: any) => {
              if (data.reason != "") {
                this.save(data.reason, "2", value.baseid, value.id, value.type);
              } else {
                this.service.presentToast(
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

    this.service.updatealertnotification(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        this.isDisable = false;

        if (getrectifystatus == "2") {
          this.service.presentToast(
            this.translate.instant("ALERTACKNOWLEDGE.unabletorectifysuccess")
          );
        }

        this.getalert();
      } else {
        this.isDisable = false;

        if (getrectifystatus == "2") {
          this.service.presentToast(
            this.translate.instant("ALERTACKNOWLEDGE.unabletorectifyfailed")
          );
        }
      }
    });
  }

  updateNotification(value) {
    //this.redirectcontroller(value);
    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      id: value.id,
      filter: this.filterstatus,
      language: this.languageService.selected,
    };

    this.service.deletedasboardnotification(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        if (value.rectify_status == 0) {
          this.redirectcontroller(value);
        }
      } else {
        this.service.presentToast(
          this.translate.instant("SEGREGATENOTIFICATION.message")
        );
      }
    });
  }

  redirectcontroller(value) {
    this.getNotification();

    if (value.redirect == "CORRECTIVE MAINTENANCE NOTIFICATION") {
      if (this.designationid == 5 || this.designationid == 11) {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs"]);
      } else {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabcorrectivemaintenance"]);
      }
    } else if (
      value.redirect == "ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION"
    ) {
      if (this.designationid == 5 || this.designationid == 11) {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs"]);
      } else {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabpreventivemaintenance"]);
      }
    }
    if (value.redirect == "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION") {
      if (this.designationid == 5 || this.designationid == 11) {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs"]);
      } else {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabpreventivemaintenance"]);
      }
    } else if (
      value.redirect == "CORRECTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
    ) {
      localStorage.setItem("notificationdata", value.redirect);

      this.router.navigate(["/tabs/tabcorrectivemaintenance"]);
    } else if (
      value.redirect ==
      "ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
    ) {
      localStorage.setItem("notificationdata", value.redirect);

      this.router.navigate(["/tabs/tabpreventivemaintenance"]);
    } else if (
      value.redirect ==
      "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
    ) {
      localStorage.setItem("notificationdata", value.redirect);

      this.router.navigate(["/tabs/tabpreventivemaintenance"]);
    } else if (value.redirect == "HOURLY PRESS") {
      this.router.navigate(["/production-hourlypressingstation"]);
      //this.router.navigate(["/tabs"]);
    } else if (value.redirect == "HOURLY STERILIZER") {
      this.router.navigate(["/production-hourlysterilizerstation"]);
      //this.router.navigate(["/tabs"]);
    } else if (value.redirect == "HOURLY OIL LOSS") {
      //this.router.navigate(["/lab-oillosses-list", { reportdate: "" }]);
      this.router.navigate(["/tabs"]);
    } else if (value.redirect == "HIGH OIL LOSS") {
      this.router.navigate(["/dashboard-oilloss-predictionanalysis"]);
    }
  }

  async callmodalcontroller(value) {
    this.isModalActive = true;

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
      this.isModalActive = false;
      this.getalert();
    });

    return await modal.present();
  }

  nl2br(text: string) {
    //console.log(text.replace(/(?:\r\n|\r|\n)/g, "<br>"));
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  back() {
    this.location.back();
  }
}
