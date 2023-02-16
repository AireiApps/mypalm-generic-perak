import { Component, OnInit } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { Router } from "@angular/router";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";
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
    private router: Router
  ) {
    this.getNotification();
  }

  ngOnInit() {
    /*App.addListener("appStateChange", (state: AppState) => {
      if (state.isActive == true) {
        this.ionViewDidEnter();
      }
    });*/
    this.getNotification();
  }

  ngAfterViewInit(): void {
    this.getNotification();
  }

  ionViewDidEnter() {
    this.getNotification();
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

  updateNotification(value) {
    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      id: value.id,
      filter: this.filterstatus,
      language: this.languageService.selected,
    };

    //this.callmodalcontroller(value);

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

  async callmodalcontroller(value) {
    this.getNotification();

    if (value.redirect == "ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION") {
      if (this.designationid == 4) {
        localStorage.setItem("notificationdata", JSON.stringify(value));

        this.router.navigate([
          "/maintenance-foreman-pvrpv-list",
          { reportdate: value.fromdate },
        ]);
      } else if (this.designationid == 5 || this.designationid == 6) {
        localStorage.setItem("notificationdata", JSON.stringify(value));

        this.router.navigate([
          "/tabs/tabmaintenancehome",
          { reportdate: value.fromdate },
        ]);
      } else {
        localStorage.setItem("notificationdata", JSON.stringify(value));

        this.router.navigate([
          "/maintenance-pvrpv-list",
          { reportdate: value.fromdate },
        ]);
      }
    } else if (
      value.redirect ==
      "ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
    ) {
      localStorage.setItem("notificationdata", JSON.stringify(value));

      this.router.navigate([
        "/maintenance-pvrpv-list",
        { reportdate: value.fromdate },
      ]);
    } else if (
      value.redirect == "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION"
    ) {
      if (this.designationid == 4) {
        localStorage.setItem("notificationdata", JSON.stringify(value));

        this.router.navigate([
          "/maintenance-foreman-pvrpv-list",
          { reportdate: value.fromdate },
        ]);
      } else if (this.designationid == 5 || this.designationid == 6) {
        localStorage.setItem("notificationdata", JSON.stringify(value));

        this.router.navigate([
          "/tabs/tabmaintenancehome",
          { reportdate: value.fromdate },
        ]);
      } else {
        localStorage.setItem("notificationdata", JSON.stringify(value));

        this.router.navigate([
          "/maintenance-pvrpv-list",
          { reportdate: value.fromdate },
        ]);
      }
    } else if (
      value.redirect ==
      "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION VERIFICATION"
    ) {
      if (this.designationid == 4) {
        localStorage.setItem("notificationdata", JSON.stringify(value));

        this.router.navigate([
          "/maintenance-foreman-pvrpv-list",
          { reportdate: value.fromdate },
        ]);
      } else {
        localStorage.setItem("notificationdata", JSON.stringify(value));

        this.router.navigate([
          "/maintenance-pvrpv-list",
          { reportdate: value.fromdate },
        ]);
      }
    } else if (
      value.redirect ==
      "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
    ) {
      localStorage.setItem("notificationdata", JSON.stringify(value));

      this.router.navigate([
        "/maintenance-pvrpv-list",
        { reportdate: value.fromdate },
      ]);
    } else if (value.redirect == "CORRECTIVE MAINTENANCE NOTIFICATION") {
      if (this.departmentid == 4) {
        this.router.navigate(["/production-notification-list"]);
      } else {
        if (this.designationid == 4) {
          localStorage.setItem("notificationdata", JSON.stringify(value));

          this.router.navigate([
            "/maintenance-foreman-notification-list",
            { reportdate: value.fromdate },
          ]);
        } else if (this.designationid == 5 || this.designationid == 6) {
          localStorage.setItem("notificationdata", JSON.stringify(value));

          this.router.navigate([
            "/tabs/tabmaintenancehome",
            { reportdate: value.fromdate },
          ]);
        } else {
          localStorage.setItem("notificationdata", JSON.stringify(value));

          this.router.navigate([
            "/maintenance-notification-list",
            { reportdate: value.fromdate },
          ]);
        }
      }
    } else if (
      value.redirect == "CORRECTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
    ) {
      localStorage.setItem("notificationdata", JSON.stringify(value));

      this.router.navigate([
        "/maintenance-notification-list",
        { reportdate: value.fromdate },
      ]);
    } else if (
      value.redirect == "CORRECTIVE MAINTENANCE NOTIFICATION VERIFICATION"
    ) {
      if (this.designationid == 4) {
        localStorage.setItem("notificationdata", JSON.stringify(value));

        this.router.navigate([
          "/maintenance-foreman-notification-list",
          { reportdate: value.fromdate },
        ]);
      } else {
        localStorage.setItem("notificationdata", JSON.stringify(value));

        this.router.navigate([
          "/maintenance-notification-list",
          { reportdate: value.fromdate },
        ]);
      }
    } else if (value.redirect == "HOURLY PRESS") {
      if (this.designationid == 7 || this.designationid == 8) {
        this.router.navigate(["/production-sterilizerpress-hourlyreporting"]);
      } else {
        this.router.navigate(["/production-hourlypressingstation"]);
      }
    } else if (value.redirect == "HOURLY STERILIZER") {
      this.router.navigate(["/production-hourlysterilizerstation"]);
    } else if (value.redirect == "HOURLY OIL LOSS") {
      this.router.navigate(["/lab-oillosses-list", { reportdate: "" }]);
    }
  }
}