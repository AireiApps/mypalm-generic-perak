import { Component, OnInit, NgZone } from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AIREIService } from "src/app/api/api.service";
import { MaintenanceServiceService } from "../../services/maintenance-serivce/maintenance-service.service";
import { Platform, AlertController, ModalController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { FormBuilder, FormControl } from "@angular/forms";
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
import { MaintenancePreventivemaintenanceAssignModalPage } from "src/app/maintenance-module/maintenance-preventivemaintenance-assign-modal/maintenance-preventivemaintenance-assign-modal.page";
import { MaintenanceForemanPvClosePage } from "src/app/maintenance-module/maintenance-foreman-pv-close/maintenance-foreman-pv-close.page";
import { PopupMaintenanceNotificationViewPage } from "src/app/maintenance-module/popup-maintenance-notification-view/popup-maintenance-notification-view.page";
import { RopmMultipartSavePage } from "src/app/maintenance-module/ropm-multipart-save/ropm-multipart-save.page";
import { RepmMultipartSavePage } from "src/app/maintenance-module/repm-multipart-save/repm-multipart-save.page";
// Modal Pages - End

@Component({
  selector: "app-tab-preventivemaintenance",
  templateUrl: "./tab-preventivemaintenance.page.html",
  styleUrls: ["./tab-preventivemaintenance.page.scss"],
})
export class TabPreventivemaintenancePage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  mill_name = this.nl2br(this.userlist.millname);
  departmentid = this.userlist.dept_id;
  designationid = this.userlist.desigId;
  count = 0;
  pendingcount = 0;
  pendingcountlength = 0;

  RoPMForm;
  RePMForm;

  ropmnewnotificationlistArr = [];
  ropmpendingnotificationlistArr = [];

  repmnewnotificationlistArr = [];
  repmpendingnotificationlistArr = [];

  totalropmrecords = 0;
  totlrepmrecords = 0;

  ropmnewrecords = 0;
  ropmpendingrecords = 0;

  repmnewrecords = 0;
  repmpendingrecords = 0;

  ropmnewnorecordflag = false;
  ropmpendingnorecordflag = false;

  repmnewnorecordflag = false;
  repmpendingnorecordflag = false;

  tabs_segment = "";
  secondtabs_segment = "";

  ropmnewsize;
  ropmnewtotalpage;
  ropmpendingsize;
  ropmpendingtotalpage;

  repmnewsize;
  repmnewtotalpage;
  repmpendingsize;
  repmpendingtotalpage;

  notificationdata;

  ropmfilterTerm: string;
  repmfilterTerm: string;
  getplatform: string;
  pleasewaitflag = false;

  fromnotificationscreen = 0;

  extendrunninghoursFlag = "1";

  constructor(
    private platform: Platform,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private languageService: LanguageService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    public modalController: ModalController,
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
            this.fromnotificationscreen = 1;

            localStorage.setItem("notificationdata", "");

            this.tabs_segment = "Routine";
            this.secondtabs_segment = "New";

            this.ropmnewnotificationlistArr = [];
            this.getRoPMNewPVNotification(this.secondtabs_segment, true, "0");
          } else if (
            this.notificationdata ==
            "ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
          ) {
            this.fromnotificationscreen = 1;

            localStorage.setItem("notificationdata", "");

            this.tabs_segment = "Routine";
            this.secondtabs_segment = "Pending";

            this.ropmpendingnotificationlistArr = [];
            this.getRoPMPendingPVNotification(
              this.secondtabs_segment,
              true,
              "0"
            );
          } else if (
            this.notificationdata ==
            "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION"
          ) {
            this.fromnotificationscreen = 1;

            localStorage.setItem("notificationdata", "");

            this.tabs_segment = "Replacement";
            this.secondtabs_segment = "New";

            this.repmnewnotificationlistArr = [];
            this.getRePMNewPVNotification(this.secondtabs_segment, true, "0");
          } else if (
            this.notificationdata ==
            "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION VERIFICATION"
          ) {
            this.fromnotificationscreen = 1;

            localStorage.setItem("notificationdata", "");

            this.tabs_segment = "Replacement";
            this.secondtabs_segment = "Pending";

            this.repmpendingnotificationlistArr = [];
            this.getRePMPendingPVNotification(
              this.secondtabs_segment,
              true,
              "0"
            );
          } else if (
            this.notificationdata ==
            "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION ACKNOWLEDGEMENT"
          ) {
            this.fromnotificationscreen = 1;

            localStorage.setItem("notificationdata", "");

            this.tabs_segment = "Replacement";
            this.secondtabs_segment = "Pending";

            this.repmpendingnotificationlistArr = [];
            this.getRePMPendingPVNotification(
              this.secondtabs_segment,
              true,
              "0"
            );
          }
        }
      } else {
        this.tabs_segment = "Routine";

        if (this.tabs_segment == "Routine") {
          this.secondtabs_segment = "New";

          /*if (this.secondtabs_segment == "New") {
            this.getRoPMNewPVNotification(this.secondtabs_segment, true, "0");
          }*/
        }
      }
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    if (this.tabs_segment == "Routine") {
      if (this.secondtabs_segment == "New") {
        this.ropmnewnotificationlistArr = [];
        this.getRoPMNewPVNotification(this.secondtabs_segment, true, "0");
      } else {
        this.ropmpendingnotificationlistArr = [];
        this.getRoPMPendingPVNotification(this.secondtabs_segment, true, "0");
      }
    } else if (this.tabs_segment == "Replacement") {
      if (this.secondtabs_segment == "New") {
        this.repmnewnotificationlistArr = [];
        this.getRePMNewPVNotification(this.secondtabs_segment, true, "0");
      } else {
        this.repmpendingnotificationlistArr = [];
        this.getRePMPendingPVNotification(this.secondtabs_segment, true, "0");
      }
    }
  }

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem("badge_count"));

      if (
        this.designationid == 2 ||
        this.designationid == 4 ||
        this.designationid == 6
      ) {
        this.getMaintenancePendingCount();
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
    if (this.designationid != 4 && this.designationid != 6) {
      localStorage.setItem("badge_count", "0");
      this.router.navigate(["/segregatenotification"]);
    }

    /*localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);*/
  }

  getBackgroundColor(status, machineflag) {
    //console.log(value);

    let color;

    color = "#ffffff";

    return color;
  }

  getTextColor(status) {
    let color;

    color = "#ffffff";

    return color;
  }

  geBorderColor(type, status, machineflag) {
    let color;

    if (type == "RoPM") {
      color = "#008000";
    } else {
      if (machineflag == 1) {
        color = "#cb4335";
      } else {
        color = "#0086c2";
      }
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

    if (status == "12") {
      color = "#f36311";
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

  getRoPMNewPVNotification(
    getcurrentsegment,
    pagerefresh: Boolean,
    pagenum: string
  ) {
    this.ropmnewnorecordflag = false;
    this.pleasewaitflag = true;

    if (pagerefresh == true) {
      this.ropmnewnotificationlistArr = [];
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
      type: 2,
      page: parseInt(pagenum) + 1,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getNotificationList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      this.ropmnewsize = parseInt(resultdata.size);

      this.ropmnewtotalpage = resultdata.total_page * this.ropmnewsize;

      if (resultdata.httpcode == 200) {
        //this.newnotificationlistArr.push(resultdata.data);

        this.ropmnewrecords = resultdata.newcount;
        this.ropmpendingrecords = resultdata.pendingcount;

        if (resultdata.data.length > 0) {
          for (var i = 0; i < resultdata.data.length; i++) {
            let eachitem = resultdata.data[i];
            let eachreq = {
              reason: eachitem.reason,
              breakdowncausesid: eachitem.breakdowncausesid,
              damagesid: eachitem.damagesid,
              type: eachitem.type,
              breakdownremarks: eachitem.breakdownremarks,
              notificationno: eachitem.notificationno,
              partdefectid: eachitem.partdefectid,
              problem: eachitem.problem,
              activityids: eachitem.activityids,
              id: eachitem.id,
              notificationtypeid: eachitem.notificationtypeid,
              reportDatetime: eachitem.reportDatetime,
              reportBy: eachitem.reportBy,
              isExpanded: eachitem.isExpanded,
              orderNo: eachitem.orderNo,
              insDate: eachitem.insDate,
              isUpdateEnable: eachitem.isUpdateEnable,
              enddateandtime: eachitem.enddateandtime,
              equipmentname: eachitem.equipmentname,
              partdefect: this.nl2br(eachitem.partdefect),
              equipment: eachitem.equipment,
              statusname: eachitem.statusname,
              teco: eachitem.teco,
              stationname: eachitem.stationname,
              reportById: eachitem.reportById,
              maintenancetype: eachitem.maintenancetype,
              condition: eachitem.condition,
              statusId: eachitem.statusId,
              notificationtype: eachitem.notificationtype,
              maintenancetypeid: eachitem.maintenancetypeid,
              typeId: eachitem.typeId,
              stationid: eachitem.stationid,
              breakdowncoding: eachitem.breakdowncoding,
              activity: eachitem.activity,
              damages: eachitem.damages,
              breakdowncauses: eachitem.breakdowncauses,
              iscompleted: eachitem.iscompleted,
              machineid: eachitem.machineid,
              prNo: eachitem.prNo,
              machinename: eachitem.machinename,
              machinereplacement: eachitem.machinereplacement,
              breakdowncodingid: eachitem.breakdowncodingid,
              runningHours: eachitem.runningHours,
              replacement_activityname: eachitem.replacement_activityname,
              startdateandtime: eachitem.startdateandtime,
              equipmentid: eachitem.equipmentid,
              conditionid: eachitem.conditionid,
              machine: eachitem.machine,
              replacement_activityid: eachitem.replacement_activityid,
              remarks: eachitem.remarks,
            };

            this.ropmnewnotificationlistArr.push(eachreq);
          }

          this.ropmnewnorecordflag = false;
        }

        this.pleasewaitflag = false;
      } else {
        this.ropmnewrecords = resultdata.newcount;
        this.ropmpendingrecords = resultdata.pendingcount;

        if (this.ropmnewnotificationlistArr.length > 0) {
          this.ropmnewnorecordflag = false;
        } else {
          this.ropmnewnorecordflag = true;
        }

        this.pleasewaitflag = false;
      }
    });
  }

  getRoPMPendingPVNotification(
    getcurrentsegment,
    pagerefresh: Boolean,
    pagenum: string
  ) {
    this.ropmpendingnorecordflag = false;
    this.pleasewaitflag = true;

    if (pagerefresh == true) {
      this.ropmpendingnotificationlistArr = [];
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
      type: 2,
      page: parseInt(pagenum) + 1,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.getNotificationList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      this.ropmpendingsize = parseInt(resultdata.size);

      this.ropmpendingtotalpage = resultdata.total_page * this.ropmpendingsize;

      if (resultdata.httpcode == 200) {
        //this.newnotificationlistArr.push(resultdata.data);

        this.ropmnewrecords = resultdata.newcount;
        this.ropmpendingrecords = resultdata.pendingcount;

        if (resultdata.data.length > 0) {
          for (var i = 0; i < resultdata.data.length; i++) {
            let eachitem = resultdata.data[i];
            let eachreq = {
              reason: eachitem.reason,
              breakdowncausesid: eachitem.breakdowncausesid,
              damagesid: eachitem.damagesid,
              type: eachitem.type,
              breakdownremarks: eachitem.breakdownremarks,
              notificationno: eachitem.notificationno,
              partdefectid: eachitem.partdefectid,
              problem: eachitem.problem,
              activityids: eachitem.activityids,
              id: eachitem.id,
              notificationtypeid: eachitem.notificationtypeid,
              reportDatetime: eachitem.reportDatetime,
              reportBy: eachitem.reportBy,
              isExpanded: eachitem.isExpanded,
              orderNo: eachitem.orderNo,
              insDate: eachitem.insDate,
              isUpdateEnable: eachitem.isUpdateEnable,
              enddateandtime: eachitem.enddateandtime,
              equipmentname: eachitem.equipmentname,
              partdefect: this.nl2br(eachitem.partdefect),
              equipment: eachitem.equipment,
              statusname: eachitem.statusname,
              teco: eachitem.teco,
              stationname: eachitem.stationname,
              reportById: eachitem.reportById,
              maintenancetype: eachitem.maintenancetype,
              condition: eachitem.condition,
              statusId: eachitem.statusId,
              notificationtype: eachitem.notificationtype,
              maintenancetypeid: eachitem.maintenancetypeid,
              typeId: eachitem.typeId,
              stationid: eachitem.stationid,
              breakdowncoding: eachitem.breakdowncoding,
              activity: eachitem.activity,
              damages: eachitem.damages,
              breakdowncauses: eachitem.breakdowncauses,
              iscompleted: eachitem.iscompleted,
              machineid: eachitem.machineid,
              prNo: eachitem.prNo,
              machinename: eachitem.machinename,
              machinereplacement: eachitem.machinereplacement,
              breakdowncodingid: eachitem.breakdowncodingid,
              runningHours: eachitem.runningHours,
              replacement_activityname: eachitem.replacement_activityname,
              startdateandtime: eachitem.startdateandtime,
              equipmentid: eachitem.equipmentid,
              conditionid: eachitem.conditionid,
              machine: eachitem.machine,
              replacement_activityid: eachitem.replacement_activityid,
              remarks: eachitem.remarks,
            };

            this.ropmpendingnotificationlistArr.push(eachreq);
          }
          this.ropmpendingnorecordflag = false;
        }

        this.pleasewaitflag = false;
      } else {
        this.ropmnewrecords = resultdata.newcount;
        this.ropmpendingrecords = resultdata.pendingcount;

        if (this.ropmpendingnotificationlistArr.length > 0) {
          this.ropmpendingnorecordflag = false;
        } else {
          this.ropmpendingnorecordflag = true;
        }

        this.pleasewaitflag = false;
      }
    });
  }

  getRePMNewPVNotification(
    getcurrentsegment,
    pagerefresh: Boolean,
    pagenum: string
  ) {
    this.repmnewnorecordflag = false;
    this.pleasewaitflag = true;

    if (pagerefresh == true) {
      this.repmnewnotificationlistArr = [];
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
      type: 3,
      page: parseInt(pagenum) + 1,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getNotificationList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      this.extendrunninghoursFlag = String(resultdata.extendedrunningkeyinflag);

      this.repmnewsize = parseInt(resultdata.size);

      this.repmnewtotalpage = resultdata.total_page * this.repmnewsize;

      if (resultdata.httpcode == 200) {
        //this.newnotificationlistArr.push(resultdata.data);

        this.repmnewrecords = resultdata.newcount;
        this.repmpendingrecords = resultdata.pendingcount;

        if (resultdata.data.length > 0) {
          for (var i = 0; i < resultdata.data.length; i++) {
            let eachitem = resultdata.data[i];
            let eachreq = {
              reason: eachitem.reason,
              breakdowncausesid: eachitem.breakdowncausesid,
              damagesid: eachitem.damagesid,
              type: eachitem.type,
              breakdownremarks: eachitem.breakdownremarks,
              notificationno: eachitem.notificationno,
              partdefectid: eachitem.partdefectid,
              problem: eachitem.problem,
              activityids: eachitem.activityids,
              id: eachitem.id,
              notificationtypeid: eachitem.notificationtypeid,
              reportDatetime: eachitem.reportDatetime,
              reportBy: eachitem.reportBy,
              isExpanded: eachitem.isExpanded,
              orderNo: eachitem.orderNo,
              insDate: eachitem.insDate,
              isUpdateEnable: eachitem.isUpdateEnable,
              enddateandtime: eachitem.enddateandtime,
              equipmentname: eachitem.equipmentname,
              partdefect: this.nl2br(eachitem.partdefect),
              equipment: eachitem.equipment,
              statusname: eachitem.statusname,
              teco: eachitem.teco,
              stationname: eachitem.stationname,
              reportById: eachitem.reportById,
              maintenancetype: eachitem.maintenancetype,
              condition: eachitem.condition,
              statusId: eachitem.statusId,
              notificationtype: eachitem.notificationtype,
              maintenancetypeid: eachitem.maintenancetypeid,
              typeId: eachitem.typeId,
              stationid: eachitem.stationid,
              breakdowncoding: eachitem.breakdowncoding,
              activity: eachitem.activity,
              damages: eachitem.damages,
              breakdowncauses: eachitem.breakdowncauses,
              iscompleted: eachitem.iscompleted,
              machineid: eachitem.machineid,
              prNo: eachitem.prNo,
              machinename: eachitem.machinename,
              machinereplacement: eachitem.machinereplacement,
              breakdowncodingid: eachitem.breakdowncodingid,
              runningHours: eachitem.runningHours,
              replacement_activityname: eachitem.replacement_activityname,
              startdateandtime: eachitem.startdateandtime,
              equipmentid: eachitem.equipmentid,
              conditionid: eachitem.conditionid,
              machine: eachitem.machine,
              replacement_activityid: eachitem.replacement_activityid,
              remarks: eachitem.remarks,
            };

            this.repmnewnotificationlistArr.push(eachreq);
          }

          this.repmnewnorecordflag = false;
        }

        this.pleasewaitflag = false;
      } else {
        this.extendrunninghoursFlag = String(
          resultdata.extendedrunningkeyinflag
        );
        this.repmnewrecords = resultdata.newcount;
        this.repmpendingrecords = resultdata.pendingcount;

        if (this.repmnewnotificationlistArr.length > 0) {
          this.repmnewnorecordflag = false;
        } else {
          this.repmnewnorecordflag = true;
        }

        this.pleasewaitflag = false;
      }
    });
  }

  getRePMPendingPVNotification(
    getcurrentsegment,
    pagerefresh: Boolean,
    pagenum: string
  ) {
    this.repmpendingnorecordflag = false;
    this.pleasewaitflag = true;

    if (pagerefresh == true) {
      this.repmpendingnotificationlistArr = [];
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
      type: 3,
      page: parseInt(pagenum) + 1,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getNotificationList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      this.extendrunninghoursFlag = String(resultdata.extendedrunningkeyinflag);

      this.repmpendingsize = parseInt(resultdata.size);

      this.repmpendingtotalpage = resultdata.total_page * this.repmpendingsize;

      if (resultdata.httpcode == 200) {
        //this.newnotificationlistArr.push(resultdata.data);

        this.repmnewrecords = resultdata.newcount;
        this.repmpendingrecords = resultdata.pendingcount;

        if (resultdata.data.length > 0) {
          for (var i = 0; i < resultdata.data.length; i++) {
            let eachitem = resultdata.data[i];
            let eachreq = {
              reason: eachitem.reason,
              breakdowncausesid: eachitem.breakdowncausesid,
              damagesid: eachitem.damagesid,
              type: eachitem.type,
              breakdownremarks: eachitem.breakdownremarks,
              notificationno: eachitem.notificationno,
              partdefectid: eachitem.partdefectid,
              problem: eachitem.problem,
              activityids: eachitem.activityids,
              id: eachitem.id,
              notificationtypeid: eachitem.notificationtypeid,
              reportDatetime: eachitem.reportDatetime,
              reportBy: eachitem.reportBy,
              isExpanded: eachitem.isExpanded,
              orderNo: eachitem.orderNo,
              insDate: eachitem.insDate,
              isUpdateEnable: eachitem.isUpdateEnable,
              enddateandtime: eachitem.enddateandtime,
              equipmentname: eachitem.equipmentname,
              partdefect: this.nl2br(eachitem.partdefect),
              equipment: eachitem.equipment,
              statusname: eachitem.statusname,
              teco: eachitem.teco,
              stationname: eachitem.stationname,
              reportById: eachitem.reportById,
              maintenancetype: eachitem.maintenancetype,
              condition: eachitem.condition,
              statusId: eachitem.statusId,
              notificationtype: eachitem.notificationtype,
              maintenancetypeid: eachitem.maintenancetypeid,
              typeId: eachitem.typeId,
              stationid: eachitem.stationid,
              breakdowncoding: eachitem.breakdowncoding,
              activity: eachitem.activity,
              damages: eachitem.damages,
              breakdowncauses: eachitem.breakdowncauses,
              iscompleted: eachitem.iscompleted,
              machineid: eachitem.machineid,
              prNo: eachitem.prNo,
              machinename: eachitem.machinename,
              machinereplacement: eachitem.machinereplacement,
              breakdowncodingid: eachitem.breakdowncodingid,
              runningHours: eachitem.runningHours,
              replacement_activityname: eachitem.replacement_activityname,
              startdateandtime: eachitem.startdateandtime,
              equipmentid: eachitem.equipmentid,
              conditionid: eachitem.conditionid,
              machine: eachitem.machine,
              replacement_activityid: eachitem.replacement_activityid,
              remarks: eachitem.remarks,
            };

            this.repmpendingnotificationlistArr.push(eachreq);
          }
          this.repmpendingnorecordflag = false;
        }

        this.pleasewaitflag = false;
      } else {
        this.extendrunninghoursFlag = String(
          resultdata.extendedrunningkeyinflag
        );
        this.repmnewrecords = resultdata.newcount;
        this.repmpendingrecords = resultdata.pendingcount;

        if (this.repmpendingnotificationlistArr.length > 0) {
          this.repmpendingnorecordflag = false;
        } else {
          this.repmpendingnorecordflag = true;
        }

        this.pleasewaitflag = false;
      }
    });
  }

  ropmnewpagination(event) {
    setTimeout(() => {
      if (this.ropmnewnotificationlistArr.length == this.ropmnewtotalpage) {
        event.target.complete();
        return;
      }

      event.target.complete();

      var z = Math.ceil(
        this.ropmnewnotificationlistArr.length / this.ropmnewsize
      );

      if (this.ropmnewnotificationlistArr.length < this.ropmnewtotalpage) {
        this.getRoPMNewPVNotification(
          this.secondtabs_segment,
          false,
          String(z)
        );
      }
    }, 500);
  }

  ropmpendingpagination(event) {
    setTimeout(() => {
      if (
        this.ropmpendingnotificationlistArr.length == this.ropmpendingtotalpage
      ) {
        event.target.complete();
        return;
      }

      event.target.complete();

      var z = Math.ceil(
        this.ropmpendingnotificationlistArr.length / this.ropmpendingsize
      );

      if (
        this.ropmpendingnotificationlistArr.length < this.ropmpendingtotalpage
      ) {
        this.getRoPMPendingPVNotification(
          this.secondtabs_segment,
          false,
          String(z)
        );
      }
    }, 500);
  }

  repmnewpagination(event) {
    setTimeout(() => {
      if (this.repmnewnotificationlistArr.length == this.repmnewtotalpage) {
        event.target.complete();
        return;
      }

      event.target.complete();

      var z = Math.ceil(
        this.repmnewnotificationlistArr.length / this.repmnewsize
      );

      if (this.repmnewnotificationlistArr.length < this.repmnewtotalpage) {
        this.getRePMNewPVNotification(
          this.secondtabs_segment,
          false,
          String(z)
        );
      }
    }, 500);
  }

  repmpendingpagination(event) {
    setTimeout(() => {
      if (
        this.repmpendingnotificationlistArr.length == this.repmpendingtotalpage
      ) {
        event.target.complete();
        return;
      }

      event.target.complete();

      var z = Math.ceil(
        this.repmpendingnotificationlistArr.length / this.repmpendingsize
      );

      if (
        this.repmpendingnotificationlistArr.length < this.repmpendingtotalpage
      ) {
        this.getRePMPendingPVNotification(
          this.secondtabs_segment,
          false,
          String(z)
        );
      }
    }, 500);
  }

  btn_NotificationAccept(value) {
    if (value.statusId == 1) {
      this.callmodalcontroller(value, "ASSIGN");
    }
  }

  btn_NotificationView(value) {
    /*this.router.navigate([
      "/maintenance-notification-view",
      { item: JSON.stringify(value), from: "CM" },
    ]);*/

    this.callmodalcontroller(value, "NOTIFICATIONVIEW");
  }

  btn_NotificationClose(value) {
    this.callmodalcontroller(value, "CLOSE");
  }

  btn_Acknowledge(value) {
    /*this.router.navigate([
      "/maintenance-notification-view",
      { item: JSON.stringify(value), from: "CM" },
    ]);*/

    this.callmodalcontroller(value, "ACKNOWLEDGE");
  }

  segmentChanged(ev: any) {
    if (this.fromnotificationscreen == 0) {
      if (ev.detail.value == "Routine") {
        this.secondtabs_segment = "New";

        if (this.secondtabs_segment == "New") {
          this.getRoPMNewPVNotification(this.secondtabs_segment, true, "0");
        } else {
          this.getRoPMPendingPVNotification(this.secondtabs_segment, true, "0");
        }
      } else {
        this.secondtabs_segment = "New";

        if (this.secondtabs_segment == "New") {
          this.getRePMNewPVNotification(this.secondtabs_segment, true, "0");
        } else {
          this.getRePMPendingPVNotification(this.secondtabs_segment, true, "0");
        }
      }
    }
  }

  secondsegmentChanged(ev: any) {
    if (this.fromnotificationscreen == 0) {
      if (this.tabs_segment == "Routine") {
        if (ev.detail.value == "New") {
          this.getRoPMNewPVNotification(this.secondtabs_segment, true, "0");
        } else {
          this.getRoPMPendingPVNotification(this.secondtabs_segment, true, "0");
        }
      } else {
        if (ev.detail.value == "New") {
          this.getRePMNewPVNotification(this.secondtabs_segment, true, "0");
        } else {
          this.getRePMPendingPVNotification(this.secondtabs_segment, true, "0");
        }
      }
    } else {
      this.fromnotificationscreen = 0;
    }
  }

  async callmodalcontroller(value, type) {
    console.log(value);

    if (type == "ASSIGN") {
      if (this.tabs_segment == "Routine") {
        var getpartdefectidArr = value.partdefectid.split(",");

        if (getpartdefectidArr.length > 1) {
          const modal = await this.modalController.create({
            component: RopmMultipartSavePage,
            componentProps: {
              item: JSON.stringify(value),
              flag: this.extendrunninghoursFlag,
              module: "RoPM",
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
        } else {
          const modal = await this.modalController.create({
            component: MaintenancePreventivemaintenanceAssignModalPage,
            componentProps: {
              item: JSON.stringify(value),
              flag: this.extendrunninghoursFlag,
              module: "RoPM",
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
      } else {
        var getpartdefectidArr = value.partdefectid.split(",");
        if (getpartdefectidArr.length > 1) {
          const modal = await this.modalController.create({
            component: RepmMultipartSavePage,
            componentProps: {
              item: JSON.stringify(value),
              module: "RePM",
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
        } else {
          const modal = await this.modalController.create({
            component: MaintenancePreventivemaintenanceAssignModalPage,
            componentProps: {
              item: JSON.stringify(value),
              module: "RePM",
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
      }
    }

    if (type == "CLOSE") {
      var sendmodule = "";
      if (this.tabs_segment == "Routine") {
        sendmodule = "RoPM";
      } else {
        sendmodule = "RePM";
      }

      const modal = await this.modalController.create({
        component: PopupMaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          module: sendmodule,
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
      var sendmodule = "";
      if (this.tabs_segment == "Routine") {
        sendmodule = "RoPM";
      } else {
        sendmodule = "RePM";
      }

      const modal = await this.modalController.create({
        component: PopupMaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          flag: this.extendrunninghoursFlag,
          module: sendmodule,
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
      var sendmodule = "";
      if (this.tabs_segment == "Routine") {
        sendmodule = "RoPMVIEW";
      } else {
        sendmodule = "RePMVIEW";
      }

      const modal = await this.modalController.create({
        component: PopupMaintenanceNotificationViewPage,
        componentProps: {
          item: JSON.stringify(value),
          module: sendmodule,
        },
        showBackdrop: true,
        backdropDismiss: false,
      });

      modal.onDidDismiss().then((data) => {});

      return await modal.present();
    }
  }

  refreshData() {
    if (this.tabs_segment == "Routine") {
      //this.secondtabs_segment = "New";

      if (this.secondtabs_segment == "New") {
        this.getRoPMNewPVNotification(this.secondtabs_segment, true, "0");
      } else {
        this.getMaintenancePendingCount();
        this.getRoPMPendingPVNotification(this.secondtabs_segment, true, "0");
      }
    } else if (this.tabs_segment == "Replacement") {
      //this.secondtabs_segment = "New";

      if (this.secondtabs_segment == "New") {
        this.getRePMNewPVNotification(this.secondtabs_segment, true, "0");
      } else {
        this.getMaintenancePendingCount();
        this.getRePMPendingPVNotification(this.secondtabs_segment, true, "0");
      }
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
