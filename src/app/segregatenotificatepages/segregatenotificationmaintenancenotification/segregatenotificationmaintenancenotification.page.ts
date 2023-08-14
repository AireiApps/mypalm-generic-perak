import { Component, OnInit } from "@angular/core";
import { App, AppState } from "@capacitor/core";
import { AIREIService } from "src/app/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

// Modal
import { UpdateExtendedrunninghoursPage } from "src/app/segregatenotificatepages/update-extendedrunninghours/update-extendedrunninghours.page";

@Component({
  selector: "app-segregatenotificationmaintenancenotification",
  templateUrl: "./segregatenotificationmaintenancenotification.page.html",
  styleUrls: ["./segregatenotificationmaintenancenotification.page.scss"],
})
export class SegregatenotificationmaintenancenotificationPage
  implements OnInit
{
  userlist = JSON.parse(localStorage.getItem("userlist"));

  departmentid = this.userlist.dept_id;
  designationid = this.userlist.desigId;

  todaysnotificationArr = [];
  oldernotificationArr = [];

  todaysnotificationcount = 0;
  oldernotificationcount = 0;

  todaysnotificationflag = false;
  oldernotificationflag = false;

  todaysnotificationclick = 0;
  oldernotificationclick = 0;

  filterstatus = 2;

  enableflag = false;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private service: AIREIService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    public modalController: ModalController
  ) {
    this.activatedroute.params.subscribe((val) => {
      this.getNotification();
    });
  }

  ngOnInit() {
    App.addListener("appStateChange", (state: AppState) => {
      if (state.isActive == true) {
        //this.getNotification();
        //this.router.navigate(["/segregatenotification"]);
        if (
          this.router.url == "/segregatenotificationmaintenancenotification"
        ) {
          this.reloadCurrentPage();
        }
      }
    });
    //this.getNotification();
  }

  ngAfterViewInit(): void {
    this.getNotification();
  }

  ionViewDidEnter() {
    this.getNotification();
  }

  reloadCurrentPage() {
    let currentUrl = this.router.url;

    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  geBorderColor(value) {
    let color;

    if (value == "") {
      color = "#ffffff";
    }

    // Extended Running Hours
    if (value == "EXTENDED RUNNING HOURS") {
      color = "#FF9800";
    }

    return color;
  }

  getBackgroundColor(value) {
    //console.log(value);

    let color;

    if (value == "") {
      color = "#ffffff";
    }

    // Extended Running Hours
    if (value == "EXTENDED RUNNING HOURS") {
      color = "#FFF3E0";
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
            };

            eachArr.push(eachreq);
          }

          this.oldernotificationArr = eachArr;
        }

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

  updateNotification(value) {
    if (value.redirect == "EXTENDED RUNNING HOURS") {
      this.extendedrunninghoursmodalcontroller(value);
    } else {
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
          this.callmodalcontroller(value);
        } else {
          this.service.presentToast(
            this.translate.instant("SEGREGATENOTIFICATION.message")
          );
        }
      });
    }
  }

  async callmodalcontroller(value) {
    this.getNotification();

    if (value.redirect == "ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION") {
      if (this.designationid == 4 || this.designationid == 6) {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabpreventivemaintenance"]);
      } else if (this.designationid == 5 || this.designationid == 11) {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate([
          "/tabs/tabmaintenancehome",
          { reportdate: value.fromdate },
        ]);
      } else {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabpreventivemaintenance"]);
      }
    } else if (
      value.redirect ==
      "ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
    ) {
      localStorage.setItem("notificationdata", value.redirect);

      this.router.navigate(["/tabs/tabpreventivemaintenance"]);
    } else if (
      value.redirect == "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION"
    ) {
      if (this.designationid == 4 || this.designationid == 6) {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabpreventivemaintenance"]);
      } else if (this.designationid == 5 || this.designationid == 11) {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate([
          "/tabs/tabmaintenancehome",
          { reportdate: value.fromdate },
        ]);
      } else {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabpreventivemaintenance"]);
      }
    } else if (
      value.redirect ==
      "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION VERIFICATION"
    ) {
      if (this.designationid == 4 || this.designationid == 6) {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabpreventivemaintenance"]);
      } else {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabpreventivemaintenance"]);
      }
    } else if (
      value.redirect ==
      "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
    ) {
      localStorage.setItem("notificationdata", value.redirect);

      this.router.navigate(["/tabs/tabpreventivemaintenance"]);
    } else if (value.redirect == "CORRECTIVE MAINTENANCE NOTIFICATION") {
      if (this.departmentid == 4) {
        this.router.navigate(["/production-notification-list"]);
      } else {
        if (this.designationid == 4 || this.designationid == 6) {
          localStorage.setItem("notificationdata", value.redirect);

          this.router.navigate(["/tabs/tabcorrectivemaintenance"]);
        } else if (this.designationid == 5 || this.designationid == 11) {
          localStorage.setItem("notificationdata", value.redirect);

          this.router.navigate([
            "/tabs/tabmaintenancehome",
            { reportdate: value.fromdate },
          ]);
        } else {
          localStorage.setItem("notificationdata", value.redirect);

          this.router.navigate(["/tabs/tabcorrectivemaintenance"]);
        }
      }
    } else if (
      value.redirect == "CORRECTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
    ) {
      localStorage.setItem("notificationdata", value.redirect);

      this.router.navigate(["/tabs/tabcorrectivemaintenance"]);
    } else if (
      value.redirect == "CORRECTIVE MAINTENANCE NOTIFICATION VERIFICATION"
    ) {
      if (this.designationid == 4 || this.designationid == 6) {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabcorrectivemaintenance"]);
      } else {
        localStorage.setItem("notificationdata", value.redirect);

        this.router.navigate(["/tabs/tabcorrectivemaintenance"]);
      }
    } else if (value.redirect == "HOURLY PRESS") {
      this.router.navigate(["/production-hourlypressingstation"]);
      //this.router.navigate(["/tabs"]);
    } else if (value.redirect == "HOURLY STERILIZER") {
      this.router.navigate(["/production-hourlysterilizerstation"]);
      //this.router.navigate(["/tabs"]);
    } else if (value.redirect == "HOURLY OIL LOSS") {
      this.router.navigate(["/dashboard-oilloss-predictionanalysis"]);
    } else if (value.redirect == "EXTENDED RUNNING HOURS") {
      const modal = await this.modalController.create({
        component: UpdateExtendedrunninghoursPage,
        componentProps: {
          item: JSON.stringify(value),
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata["data"]["item"];

        if (getdata != "") {
          //this.refreshData();
        }
      });

      return await modal.present();
    }
  }

  async extendedrunninghoursmodalcontroller(value) {
    const modal = await this.modalController.create({
      component: UpdateExtendedrunninghoursPage,
      componentProps: {
        item: JSON.stringify(value),
      },
      showBackdrop: true,
      backdropDismiss: false,
    });

    modal.onDidDismiss().then((modaldata) => {
      let getdata = modaldata["data"]["item"];

      if (getdata != "") {
        this.getNotification();
      }
    });

    return await modal.present();
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
