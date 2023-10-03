import { Component, OnInit, NgZone, ViewChild } from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AIREIService } from "src/app/api/api.service";
import { MaintenanceServiceService } from "../../services/maintenance-serivce/maintenance-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { FormBuilder, FormControl } from "@angular/forms";
import { Platform, AlertController, ModalController } from "@ionic/angular";
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

// Modal Pages - Start
import { MaintenanceNotificationUpdateModalPage } from "src/app/maintenance-module/maintenance-notification-update-modal/maintenance-notification-update-modal.page";
import { MaintenanceForemanVerificationPage } from "src/app/maintenance-module/maintenance-foreman-verification/maintenance-foreman-verification.page";
import { CmMultipartSavePage } from "src/app/maintenance-module/cm-multipart-save/cm-multipart-save.page";
import { PopupMaintenanceNotificationViewPage } from "src/app/maintenance-module/popup-maintenance-notification-view/popup-maintenance-notification-view.page";
// Modal Pages - End

@Component({
  selector: "app-tab-correctivemaintenance",
  templateUrl: "./tab-correctivemaintenance.page.html",
  styleUrls: ["./tab-correctivemaintenance.page.scss"],
})
export class TabCorrectivemaintenancePage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  mill_name = this.nl2br(this.userlist.millname);
  departmentid = this.userlist.dept_id;
  designationid = this.userlist.desigId;
  count = 0;
  pendingcount = 0;
  pendingcountlength = 0;

  // Varibles
  correctivemaintenanceForm;

  newnotificationlistArr = [];
  pendingnotificationlistArr = [];

  newrecords = 0;
  pendingrecords = 0;

  newnorecordflag = false;
  pendingnorecordflag = false;
  disableAccept = false;
  pleasewaitflag = false;

  newsize;
  newtotalpage;

  pendingsize;
  pendingtotalpage;

  notificationdata;

  filterTerm: string;
  getplatform: string;
  tabs_segment = "";

  constructor(
    private platform: Platform,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private languageService: LanguageService,
    private activatedroute: ActivatedRoute,
    private alertController: AlertController,
    public modalController: ModalController,
    private router: Router,
    private screenOrientation: ScreenOrientation,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private service: MaintenanceServiceService
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

      if (
        this.designationid == 2 ||
        this.designationid == 4 ||
        this.designationid == 6
      ) {
        this.getMaintenancePendingCount();
      }

      if (localStorage.getItem("notificationdata") != "") {
        this.notificationdata = localStorage.getItem("notificationdata");

        if (
          this.notificationdata !== "undefined" &&
          this.notificationdata !== null
        ) {
          if (this.notificationdata == "CORRECTIVE MAINTENANCE NOTIFICATION") {
            localStorage.setItem("notificationdata", "");

            this.tabs_segment = "New";

            /*this.newnotificationlistArr = [];
            this.getNewNotification(this.tabs_segment, true, "0");*/
          } else if (
            this.notificationdata ==
            "CORRECTIVE MAINTENANCE NOTIFICATION VERIFICATION"
          ) {
            localStorage.setItem("notificationdata", "");

            this.tabs_segment = "Pending";

            /*this.pendingnotificationlistArr = [];
            this.getPendingNotification(this.tabs_segment, true, "0");*/
          } else if (
            this.notificationdata ==
            "CORRECTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
          ) {
            localStorage.setItem("notificationdata", "");

            this.tabs_segment = "Pending";

            /*this.pendingnotificationlistArr = [];
            this.getPendingNotification(this.tabs_segment, true, "0");*/
          }
        }
      } else {
        this.tabs_segment = "New";

        //this.getNewNotification(this.tabs_segment, true, "0");
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

    if (this.tabs_segment == "New") {
      //this.newnotificationlistArr = [];
      this.getNewNotification(this.tabs_segment, true, "0");
    } else if (this.tabs_segment == "Pending") {
      //this.pendingnotificationlistArr = [];
      this.getPendingNotification(this.tabs_segment, true, "0");
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
        this.updateNotification();

        if (
          this.designationid == 2 ||
          this.designationid == 4 ||
          this.designationid == 6
        ) {
          this.getMaintenancePendingCount();
        }
      }
    );
  }

  btn_notification() {
    if (this.designationid != 4 && this.designationid != 6) {
      localStorage.setItem("badge_count", "0");
      this.router.navigate(["/segregatenotification"]);
    }

    /*localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);*/
  }

  getBackgroundColor(value) {
    //console.log(value);

    let color;

    /*
    // Breakdown
    if (value == "1") {
      color = "#ffebeb";
    }

    // Abnormal
    if (value == "2") {
      color = "#fff0e0";
    }*/

    color = "#ffffff";

    return color;
  }

  getTextColor(status) {
    let color;

    if (status == "1") {
      color = "#ffffff";
    }

    if (status == "2") {
      color = "#000000";
    }

    return color;
  }

  getStatusTextColor(status) {
    let color;

    if (status == "1") {
      color = "#cb4335";
    }

    if (status == "2") {
      color = "#FF8C00";
    }

    return color;
  }

  geBorderColor(status) {
    let color;

    if (status == "") {
      color = "#ffffff";
    }

    // Good
    if (status == "0") {
      color = "#87D37C";
    }

    // Breakdown
    if (status == "1") {
      color = "#cb4335";
    }

    // Abnormal
    if (status == "2") {
      color = "#FF8C00";
    }

    return color;
  }

  getMaintenancePendingCount() {
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

  getNewNotification(getcurrentsegment, pagerefresh: Boolean, pagenum: string) {
    this.newnorecordflag = false;
    this.pleasewaitflag = true;

    if (pagerefresh == true) {
      this.newnotificationlistArr = [];
    } else {
    }

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      fromdate: "",
      todate: "",
      segment: getcurrentsegment,
      type: 1,
      page: parseInt(pagenum) + 1,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.getNotificationList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      this.newsize = parseInt(resultdata.size);

      this.newtotalpage = resultdata.total_page * this.newsize;

      if (resultdata.httpcode == 200) {
        this.newrecords = resultdata.newcount;
        this.pendingrecords = resultdata.pendingcount;

        if (resultdata.data.length > 0) {
          for (var i = 0; i < resultdata.data.length; i++) {
            let eachitem = resultdata.data[i];
            let eachreq = {
              activity: eachitem.activity,
              activityids: eachitem.activityids,
              breakdowncauses: eachitem.breakdowncauses,
              breakdowncausesid: eachitem.breakdowncausesid,
              breakdowncoding: eachitem.breakdowncoding,
              breakdowncodingid: eachitem.breakdowncodingid,
              breakdownremarks: eachitem.breakdownremarks,
              condition: eachitem.condition,
              conditionid: eachitem.conditionid,
              damages: eachitem.damages,
              damagesid: eachitem.damagesid,
              enddateandtime: eachitem.enddateandtime,
              equipment: eachitem.equipment,
              equipmentid: eachitem.equipmentid,
              equipmentname: eachitem.equipmentname,
              id: eachitem.id,
              insDate: eachitem.insDate,
              isExpanded: eachitem.isExpanded,
              isUpdateEnable: eachitem.isUpdateEnable,
              iscompleted: eachitem.iscompleted,
              machine: eachitem.machine,
              machineid: eachitem.machineid,
              machinename: eachitem.machinename,
              machinereplacement: eachitem.machinereplacement,
              maintenancetype: eachitem.maintenancetype,
              maintenancetypeid: eachitem.maintenancetypeid,
              notificationno: eachitem.notificationno,
              notificationtype: eachitem.notificationtype,
              notificationtypeid: eachitem.notificationtypeid,
              orderNo: eachitem.orderNo,
              partdefect: this.nl2br(eachitem.partdefect),
              partdefectid: eachitem.partdefectid,
              prNo: eachitem.prNo,
              problem: eachitem.problem,
              reason: eachitem.reason,
              remarks: eachitem.remarks,
              replacement_activityid: eachitem.replacement_activityid,
              replacement_activityname: eachitem.replacement_activityname,
              reportBy: eachitem.reportBy,
              reportById: eachitem.reportById,
              reportDatetime: eachitem.reportDatetime,
              runningHours: eachitem.runningHours,
              startdateandtime: eachitem.startdateandtime,
              stationid: eachitem.stationid,
              stationname: eachitem.stationname,
              statusId: eachitem.statusId,
              statusname: eachitem.statusname,
              teco: eachitem.teco,
              type: eachitem.type,
              typeId: eachitem.typeId,
            };

            this.newnotificationlistArr.push(eachreq);
          }
          this.newnorecordflag = false;
        }

        this.pleasewaitflag = false;
      } else {
        this.newrecords = resultdata.newcount;
        this.pendingrecords = resultdata.pendingcount;

        if (this.newnotificationlistArr.length > 0) {
          this.newnorecordflag = false;
        } else {
          this.newnorecordflag = true;
        }

        this.pleasewaitflag = false;
      }
    });
  }

  getPendingNotification(
    getcurrentsegment,
    pagerefresh: Boolean,
    pagenum: string
  ) {
    this.pendingnorecordflag = false;
    this.pleasewaitflag = true;

    if (pagerefresh == true) {
      this.pendingnotificationlistArr = [];
    } else {
    }

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      fromdate: "",
      todate: "",
      segment: getcurrentsegment,
      type: 1,
      page: parseInt(pagenum) + 1,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.getNotificationList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      this.pendingsize = parseInt(resultdata.size);

      this.pendingtotalpage = resultdata.total_page * this.pendingsize;

      if (resultdata.httpcode == 200) {
        this.newrecords = resultdata.newcount;
        this.pendingrecords = resultdata.pendingcount;

        if (resultdata.data.length > 0) {
          for (var i = 0; i < resultdata.data.length; i++) {
            let eachitem = resultdata.data[i];
            let eachreq = {
              activity: eachitem.activity,
              activityids: eachitem.activityids,
              breakdowncauses: eachitem.breakdowncauses,
              breakdowncausesid: eachitem.breakdowncausesid,
              breakdowncoding: eachitem.breakdowncoding,
              breakdowncodingid: eachitem.breakdowncodingid,
              breakdownremarks: eachitem.breakdownremarks,
              condition: eachitem.condition,
              conditionid: eachitem.conditionid,
              damages: eachitem.damages,
              damagesid: eachitem.damagesid,
              enddateandtime: eachitem.enddateandtime,
              equipment: eachitem.equipment,
              equipmentid: eachitem.equipmentid,
              equipmentname: eachitem.equipmentname,
              id: eachitem.id,
              insDate: eachitem.insDate,
              isExpanded: eachitem.isExpanded,
              isUpdateEnable: eachitem.isUpdateEnable,
              iscompleted: eachitem.iscompleted,
              machine: eachitem.machine,
              machineid: eachitem.machineid,
              machinename: eachitem.machinename,
              machinereplacement: eachitem.machinereplacement,
              maintenancetype: eachitem.maintenancetype,
              maintenancetypeid: eachitem.maintenancetypeid,
              notificationno: eachitem.notificationno,
              notificationtype: eachitem.notificationtype,
              notificationtypeid: eachitem.notificationtypeid,
              orderNo: eachitem.orderNo,
              partdefect: this.nl2br(eachitem.partdefect),
              partdefectid: eachitem.partdefectid,
              prNo: eachitem.prNo,
              problem: eachitem.problem,
              reason: eachitem.reason,
              remarks: eachitem.remarks,
              replacement_activityid: eachitem.replacement_activityid,
              replacement_activityname: eachitem.replacement_activityname,
              reportBy: eachitem.reportBy,
              reportById: eachitem.reportById,
              reportDatetime: eachitem.reportDatetime,
              runningHours: eachitem.runningHours,
              startdateandtime: eachitem.startdateandtime,
              stationid: eachitem.stationid,
              stationname: eachitem.stationname,
              statusId: eachitem.statusId,
              statusname: eachitem.statusname,
              teco: eachitem.teco,
              type: eachitem.type,
              typeId: eachitem.typeId,
            };

            this.pendingnotificationlistArr.push(eachreq);
          }
          this.pendingnorecordflag = false;
        }

        this.pleasewaitflag = false;
      } else {
        this.newrecords = resultdata.newcount;
        this.pendingrecords = resultdata.pendingcount;

        if (this.pendingnotificationlistArr.length > 0) {
          this.pendingnorecordflag = false;
        } else {
          this.pendingnorecordflag = true;
        }

        this.pleasewaitflag = false;
      }
    });
  }

  newpagination(event) {
    setTimeout(() => {
      if (this.newnotificationlistArr.length == this.newtotalpage) {
        event.target.complete();
        return;
      }

      event.target.complete();

      var z = Math.ceil(this.newnotificationlistArr.length / this.newsize);

      if (this.newnotificationlistArr.length < this.newtotalpage) {
        this.getNewNotification(this.tabs_segment, false, String(z));
      }
    }, 500);
  }

  pendingpagination(event) {
    setTimeout(() => {
      if (this.pendingnotificationlistArr.length == this.pendingtotalpage) {
        event.target.complete();
        return;
      }

      event.target.complete();

      var z = Math.ceil(
        this.pendingnotificationlistArr.length / this.pendingsize
      );

      if (this.pendingnotificationlistArr.length < this.pendingtotalpage) {
        this.getPendingNotification(this.tabs_segment, false, String(z));
      }
    }, 500);
  }

  btn_NotificationVerify(value) {
    this.callmodalcontroller(value, "VERIFY");
  }

  btn_NotificationEdit(value) {
    if (value.statusId == 1) {
      this.callmodalcontroller(value, "ASSIGN");
    }
  }

  btn_NotificationAccept(value) {
    if (value.statusId == 1) {
      this.callmodalcontroller(value, "ASSIGN");
    }
  }

  btn_NotificationClose(value) {
    this.callmodalcontroller(value, "CLOSE");
  }

  btn_NotificationView(value) {
    /*this.router.navigate([
      "/maintenance-notification-view",
      { item: JSON.stringify(value), from: "CM" },
    ]);*/

    this.callmodalcontroller(value, "NOTIFICATIONVIEW");
  }

  btn_Acknowledge(value) {
    /*this.router.navigate([
      "/maintenance-notification-view",
      { item: JSON.stringify(value), from: "CM" },
    ]);*/

    this.callmodalcontroller(value, "ACKNOWLEDGE");
  }

  segmentChanged(ev: any) {
    this.filterTerm = "";

    if (ev.detail.value == "New") {
      //this.newnotificationlistArr = [];
      this.getNewNotification(ev.detail.value, true, "0");
    } else {
      //this.pendingnotificationlistArr = [];
      this.getPendingNotification(ev.detail.value, true, "0");
    }
  }

  async callmodalcontroller(value, type) {
    if (type == "ASSIGN") {
      var getpartdefectidArr = value.partdefectid.split(",");

      if (getpartdefectidArr.length > 1) {
        const modal = await this.modalController.create({
          component: CmMultipartSavePage,
          componentProps: {
            item: JSON.stringify(value),
            module: "CM",
          },
          showBackdrop: true,
          backdropDismiss: false,
          cssClass: ["acknowledgement-modal"],
        });

        modal.onDidDismiss().then((modaldata) => {
          let getdata = modaldata["data"]["item"];

          if (getdata != "") {
            this.refreshData();
          }
        });

        return await modal.present();
      } else {
        const modal = await this.modalController.create({
          component: MaintenanceNotificationUpdateModalPage,
          componentProps: {
            item: JSON.stringify(value),
            module: "CM",
          },
          showBackdrop: true,
          backdropDismiss: false,
          cssClass: ["acknowledgement-modal"],
        });

        modal.onDidDismiss().then((modaldata) => {
          let getdata = modaldata["data"]["item"];

          if (getdata != "") {
            this.refreshData();
          }
        });

        return await modal.present();
      }
    }

    if (type == "VERIFY") {
      const modal = await this.modalController.create({
        component: MaintenanceForemanVerificationPage,
        componentProps: {
          item: JSON.stringify(value),
          module: "CM",
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ["notification-modal"],
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata["data"]["item"];

        if (getdata != "") {
          this.refreshData();
        }
      });

      return await modal.present();
    }

    /*if (type == "CLOSE") {
      const modal = await this.modalController.create({
        component: MaintenanceForemanVerificationPage,
        componentProps: {
          item: JSON.stringify(value),
          module: "CM",
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ["notification-modal"],
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata["data"]["item"];

        if (getdata != "") {
          this.refreshData();
        }
      });

      return await modal.present();
    }*/

    if (type == "CLOSE") {
      const modal = await this.modalController.create({
        component: PopupMaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          module: "CM",
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata["data"]["item"];

        if (getdata != "") {
          this.refreshData();
        }
      });

      return await modal.present();
    }

    if (type == "ACKNOWLEDGE") {
      const modal = await this.modalController.create({
        component: PopupMaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          module: "CM",
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((modaldata) => {
        let getdata = modaldata["data"]["item"];

        if (getdata != "") {
          this.refreshData();
        }
      });

      return await modal.present();
    }

    if (type == "NOTIFICATIONVIEW") {
      const modal = await this.modalController.create({
        component: PopupMaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          module: "CMVIEW",
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((data) => {});

      return await modal.present();
    }
  }

  refreshData() {
    if (this.tabs_segment == "New") {
      this.getNewNotification(this.tabs_segment, true, "0");
    } else if (this.tabs_segment == "Pending") {
      if (this.designationid == 2 || this.designationid == 4) {
        this.getMaintenancePendingCount();
      }
      this.getPendingNotification(this.tabs_segment, true, "0");
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
