import { Component, OnInit, NgZone } from "@angular/core";
import { FormControl, FormBuilder, Validators } from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MaintenanceServiceService } from "src/app/services/maintenance-serivce/maintenance-service.service";
import { ModalController, AlertController } from "@ionic/angular";
import * as moment from "moment";

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
import { MaintenanceForemanVerificationPage } from "src/app/maintenance-module/maintenance-foreman-verification/maintenance-foreman-verification.page";
import { MaintenanceReplacementModalPage } from "src/app/maintenance-module/maintenance-replacement-modal/maintenance-replacement-modal.page";
import { MaintenanceAcknowledgeModalPage } from "src/app/maintenance-module/maintenance-acknowledge-modal/maintenance-acknowledge-modal.page";
// Modal Pages - End

// Custom Datepicker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

@Component({
  selector: "app-maintenance-foreman-pvrpv-list",
  templateUrl: "./maintenance-foreman-pvrpv-list.page.html",
  styleUrls: ["./maintenance-foreman-pvrpv-list.page.scss"],
})
export class MaintenanceForemanPvrpvListPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  departmentid = this.userlist.dept_id;
  designationid = this.userlist.desigId;

  RoPMForm;
  RePMForm;

  ropmcreatednotificationlistArr = [];
  ropmallnotificationlistArr = [];

  repmcreatednotificationlistArr = [];
  repmverifynotificationlistArr = [];
  repmallnotificationlistArr = [];

  routinerecords = 0;
  replacementrecords = 0;

  ropmcreatedrecords = 0;
  ropminprogressrecords = 0;
  ropmassignedrecords = 0;
  ropmcompletedrecords = 0;
  ropmacknowledgerecords = 0;

  repmcreatedrecords = 0;
  repmverifyrecords = 0;
  repmassignedrecords = 0;
  repminprogressrecords = 0;
  repmcompletedrecords = 0;
  repmacknowledgerecords = 0;

  count = 0;
  verificationsetting = 0;

  routinenorecordflag = false;
  replacementnorecordflag = false;

  ropmcreatednorecordflag = false;
  ropmallnorecordflag = false;

  repmcreatednorecordflag = false;
  repmverifynorecordflag = false;
  repmallnorecordflag = false;

  pleasewaitflag = false;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  ropmfromdate = moment(new Date().toISOString()).format("DD-MM-YYYY");
  ropmtodate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  repmfromdate = moment(new Date().toISOString()).format("DD-MM-YYYY");
  repmtodate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  ropmfilterTerm: string;
  repmfilterTerm: string;

  tabs_segment = "";
  secondtabs_segment = "";
  thirdtabs_segment = "";

  notificationdate = "";
  notificationdata;

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private zone: NgZone,
    private fb: FormBuilder,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private notifi: AuthGuardService,
    private commonservice: AIREIService,
    public modalController: ModalController,
    private alertController: AlertController,
    private service: MaintenanceServiceService
  ) {
    this.notificationdate =
      this.activatedroute.snapshot.paramMap.get("reportdate");

    this.RoPMForm = this.fb.group({
      txt_ropmfromdate: new FormControl(this.ropmfromdate),
      txt_ropmtodate: new FormControl(this.ropmtodate),
    });

    this.RePMForm = this.fb.group({
      txt_repmfromdate: new FormControl(this.repmfromdate),
      txt_repmtodate: new FormControl(this.repmtodate),
    });

    this.tabs_segment = "Routine";

    if (this.tabs_segment == "Routine") {
      this.secondtabs_segment = "Created";
    } else if (this.tabs_segment == "Replacement") {
      this.secondtabs_segment = "Created";
    }

    this.activatedroute.params.subscribe((val) => {
      if (localStorage.getItem("notificationdata") != "") {
        this.notificationdata = JSON.parse(
          localStorage.getItem("notificationdata")
        );

        if (
          this.notificationdata.redirect !== "undefined" &&
          this.notificationdata.redirect !== null
        ) {
          if (
            this.notificationdata.redirect ==
            "ROUTINE PREVENTIVE MAINTENANCE NOTIFICATION"
          ) {
            localStorage.setItem("notificationdata", "");

            if (
              typeof this.notificationdate !== "undefined" &&
              this.notificationdate !== null &&
              this.notificationdate != ""
            ) {
              this.ropmfromdate = moment(
                this.notificationdate,
                "YYYY-MM-DD"
              ).format("DD-MM-YYYY");

              this.RoPMForm.controls.txt_ropmfromdate.setValue(
                this.ropmfromdate
              );
            }

            this.tabs_segment = "Routine";
            this.secondtabs_segment = "Created";

            this.getRoPMCreatedPVNotification(this.secondtabs_segment);
          } else if (
            this.notificationdata.redirect ==
            "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION"
          ) {
            localStorage.setItem("notificationdata", "");

            if (
              typeof this.notificationdate !== "undefined" &&
              this.notificationdate !== null &&
              this.notificationdate != ""
            ) {
              this.repmfromdate = moment(
                this.notificationdate,
                "YYYY-MM-DD"
              ).format("DD-MM-YYYY");

              this.RePMForm.controls.txt_repmfromdate.setValue(
                this.repmfromdate
              );
            }

            this.tabs_segment = "Replacement";
            this.secondtabs_segment = "Created";

            this.getRePMCreatedPVNotification(this.secondtabs_segment);
          } else if (
            this.notificationdata.redirect ==
            "REPLACEMENT PREVENTIVE MAINTENANCE NOTIFICATION VERIFICATION"
          ) {
            localStorage.setItem("notificationdata", "");

            if (
              typeof this.notificationdate !== "undefined" &&
              this.notificationdate !== null &&
              this.notificationdate != ""
            ) {
              this.repmfromdate = moment(
                this.notificationdate,
                "YYYY-MM-DD"
              ).format("DD-MM-YYYY");

              this.RePMForm.controls.txt_repmfromdate.setValue(
                this.repmfromdate
              );
            }

            this.tabs_segment = "Replacement";
            this.secondtabs_segment = "Verify";

            this.getRePMVerifyPVNotification(this.secondtabs_segment);
          }
        }
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    if (this.tabs_segment == "Routine") {
      if (this.secondtabs_segment == "Created") {
        this.getRoPMCreatedPVNotification(this.secondtabs_segment);
      }
    } else {
      if (this.secondtabs_segment == "Created") {
        this.getRePMCreatedPVNotification(this.secondtabs_segment);
      } else if (this.secondtabs_segment == "Verify") {
        this.getRePMVerifyPVNotification(this.secondtabs_segment);
      } else if (this.secondtabs_segment == "All") {
        this.getRePMAllPVNotification(this.thirdtabs_segment);
      }
    }
  }

  ionViewDidEnter() {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    if (this.tabs_segment == "Routine") {
      if (this.secondtabs_segment == "Created") {
        this.getRoPMCreatedPVNotification(this.secondtabs_segment);
      }
    } else {
      if (this.secondtabs_segment == "Created") {
        this.getRePMCreatedPVNotification(this.secondtabs_segment);
      } else if (this.secondtabs_segment == "Verify") {
        this.getRePMVerifyPVNotification(this.secondtabs_segment);
      } else if (this.secondtabs_segment == "All") {
        this.getRePMAllPVNotification(this.thirdtabs_segment);
      }
    }
  }

  openDateTimePicker(type) {
    // Routine
    if (type == "RoPMFD") {
      DatePicker.present({
        mode: "date",
        format: "dd-MM-yyyy",
        date: this.ropmfromdate,
        max: this.currentdate,
        theme: "dark",
        doneText: this.translate.instant("GENERALBUTTON.done"),
        cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
      }).then(
        (val) => {
          if (val.value) {
            this.ropmfromdate = val.value;
            this.RoPMForm.controls.txt_ropmfromdate.setValue(this.ropmfromdate);
          }
        },
        (err) => {
          alert(JSON.stringify(err));
        }
      );
    }

    if (type == "RoPMTD") {
      DatePicker.present({
        mode: "date",
        format: "dd-MM-yyyy",
        date: this.ropmtodate,
        max: this.currentdate,
        theme: "dark",
        doneText: this.translate.instant("GENERALBUTTON.done"),
        cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
      }).then(
        (val) => {
          if (val.value) {
            this.ropmtodate = val.value;
            this.RoPMForm.controls.txt_ropmtodate.setValue(this.ropmtodate);
          }
        },
        (err) => {
          alert(JSON.stringify(err));
        }
      );
    }

    // Replacement
    if (type == "RePMFD") {
      DatePicker.present({
        mode: "date",
        format: "dd-MM-yyyy",
        date: this.repmfromdate,
        max: this.currentdate,
        theme: "dark",
        doneText: this.translate.instant("GENERALBUTTON.done"),
        cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
      }).then(
        (val) => {
          if (val.value) {
            this.repmfromdate = val.value;
            this.RePMForm.controls.txt_repmfromdate.setValue(this.repmfromdate);
          }
        },
        (err) => {
          alert(JSON.stringify(err));
        }
      );
    }

    if (type == "RePMTD") {
      DatePicker.present({
        mode: "date",
        format: "dd-MM-yyyy",
        date: this.repmtodate,
        max: this.currentdate,
        theme: "dark",
        doneText: this.translate.instant("GENERALBUTTON.done"),
        cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
      }).then(
        (val) => {
          if (val.value) {
            this.repmtodate = val.value;
            this.RePMForm.controls.txt_repmtodate.setValue(this.repmtodate);
          }
        },
        (err) => {
          alert(JSON.stringify(err));
        }
      );
    }
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

  geBorderColor(status) {
    let color;

    if (status == "") {
      color = "#ffffff";
    }

    // Good
    if (status == "0") {
      color = "#87D37C";
    }

    // Abnormal
    if (status == "1") {
      color = "#ff4d4d";
    }

    return color;
  }

  getBackgroundColor(status) {
    let color;

    if (status == "") {
      color = "#ffffff";
    }

    // Good
    if (status == "0") {
      color = "#efffed";
    }

    // Abnormal
    if (status == "1") {
      color = "#fdeded";
    }

    return color;
  }

  getTextColor(status) {
    let color;

    if (status == "") {
      color = "#000000";
    }

    if (status == "0") {
      color = "#000000";
    }

    if (status == "1") {
      color = "#ffffff";
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

  getRecords() {
    if (this.tabs_segment == "Routine") {
      if (this.secondtabs_segment == "Created") {
        this.getRoPMCreatedPVNotification(this.secondtabs_segment);
      }

      if (this.secondtabs_segment == "All") {
        this.getRoPMAllPVNotification(this.thirdtabs_segment);
      }
    } else {
      if (this.secondtabs_segment == "Created") {
        this.getRePMCreatedPVNotification(this.secondtabs_segment);
      }

      if (this.secondtabs_segment == "Verify") {
        this.getRePMVerifyPVNotification(this.secondtabs_segment);
      }

      if (this.secondtabs_segment == "All") {
        //console.log(this.thirdtabs_segment);
        this.getRePMAllPVNotification(this.thirdtabs_segment);
      }
    }
  }

  getRoPMCreatedPVNotification(getcurrentsegment) {
    let getfromdate = moment(this.ropmfromdate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    let gettodate = moment(this.ropmtodate, "DD-MM-YYYY").format("YYYY-MM-DD");

    this.ropmcreatednotificationlistArr = [];
    this.ropmcreatednorecordflag = false;
    this.pleasewaitflag = true;

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      fromdate: getfromdate,
      todate: gettodate,
      status: 0,
      type: 0,
      segment: getcurrentsegment,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getPreventiveMaintenanceList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      console.log(resultdata);

      if (resultdata.httpcode == 200) {
        this.ropmcreatednotificationlistArr = resultdata.data;

        this.ropmcreatedrecords = resultdata.createdcount;
        this.ropmassignedrecords = resultdata.assignedcount;
        this.ropmcompletedrecords = resultdata.completedcount;
        this.ropminprogressrecords = resultdata.inprogesscount;
        this.ropmacknowledgerecords = resultdata.acknowlegecount;

        this.ropmcreatednorecordflag = false;

        this.pleasewaitflag = false;
      } else {
        this.ropmcreatednotificationlistArr = [];

        this.ropmcreatedrecords = resultdata.createdcount;
        this.ropmassignedrecords = resultdata.assignedcount;
        this.ropmcompletedrecords = resultdata.completedcount;
        this.ropminprogressrecords = resultdata.inprogesscount;
        this.ropmacknowledgerecords = resultdata.acknowlegecount;

        this.ropmcreatednorecordflag = true;

        this.pleasewaitflag = false;
      }
    });
  }

  getRoPMAllPVNotification(getcurrentsegment) {
    let getfromdate = moment(this.ropmfromdate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    let gettodate = moment(this.ropmtodate, "DD-MM-YYYY").format("YYYY-MM-DD");

    this.ropmallnotificationlistArr = [];
    this.ropmallnorecordflag = false;
    this.pleasewaitflag = true;

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      fromdate: getfromdate,
      todate: gettodate,
      status: 0,
      type: 0,
      segment: getcurrentsegment,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.getPreventiveMaintenanceList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.ropmallnotificationlistArr = resultdata.data;

        this.ropmcreatedrecords = resultdata.createdcount;
        this.ropmassignedrecords = resultdata.assignedcount;
        this.ropmcompletedrecords = resultdata.completedcount;
        this.ropminprogressrecords = resultdata.inprogesscount;
        this.ropmacknowledgerecords = resultdata.acknowlegecount;

        this.ropmallnorecordflag = false;

        this.pleasewaitflag = false;
      } else {
        this.ropmallnotificationlistArr = [];

        this.ropmcreatedrecords = resultdata.createdcount;
        this.ropmassignedrecords = resultdata.assignedcount;
        this.ropmcompletedrecords = resultdata.completedcount;
        this.ropminprogressrecords = resultdata.inprogesscount;
        this.ropmacknowledgerecords = resultdata.acknowlegecount;

        this.ropmallnorecordflag = true;

        this.pleasewaitflag = false;
      }
    });
  }

  getRePMCreatedPVNotification(getcurrentsegment) {
    let getfromdate = moment(this.repmfromdate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    let gettodate = moment(this.repmtodate, "DD-MM-YYYY").format("YYYY-MM-DD");

    this.repmcreatednotificationlistArr = [];
    this.repmcreatednorecordflag = false;
    this.pleasewaitflag = true;

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      fromdate: getfromdate,
      todate: gettodate,
      status: 0,
      type: 1,
      segment: getcurrentsegment,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getPreventiveMaintenanceList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.repmcreatednotificationlistArr = resultdata.data;

        this.repmcreatedrecords = resultdata.createdcount;
        this.repmverifyrecords = resultdata.verifycount;
        this.repmassignedrecords = resultdata.assignedcount;
        this.repminprogressrecords = resultdata.inprogesscount;
        this.repmcompletedrecords = resultdata.completedcount;
        this.repmacknowledgerecords = resultdata.acknowlegecount;

        this.repmcreatednorecordflag = false;

        this.pleasewaitflag = false;
      } else {
        this.repmcreatednotificationlistArr = [];

        this.repmcreatedrecords = resultdata.createdcount;
        this.repmverifyrecords = resultdata.verifycount;
        this.repmassignedrecords = resultdata.assignedcount;
        this.repminprogressrecords = resultdata.inprogesscount;
        this.repmcompletedrecords = resultdata.completedcount;
        this.repmacknowledgerecords = resultdata.acknowlegecount;

        this.repmcreatednorecordflag = true;

        this.pleasewaitflag = false;
      }
    });
  }

  getRePMVerifyPVNotification(getcurrentsegment) {
    let getfromdate = moment(this.repmfromdate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    let gettodate = moment(this.repmtodate, "DD-MM-YYYY").format("YYYY-MM-DD");

    this.repmverifynotificationlistArr = [];
    this.repmverifynorecordflag = false;
    this.pleasewaitflag = true;

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      fromdate: getfromdate,
      todate: gettodate,
      status: 0,
      type: 1,
      segment: getcurrentsegment,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getPreventiveMaintenanceList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.repmverifynotificationlistArr = resultdata.data;

        this.repmcreatedrecords = resultdata.createdcount;
        this.repmverifyrecords = resultdata.verifycount;
        this.repmassignedrecords = resultdata.assignedcount;
        this.repminprogressrecords = resultdata.inprogesscount;
        this.repmcompletedrecords = resultdata.completedcount;
        this.repmacknowledgerecords = resultdata.acknowlegecount;

        this.repmverifynorecordflag = false;

        this.pleasewaitflag = false;
      } else {
        this.repmverifynotificationlistArr = [];

        this.repmcreatedrecords = resultdata.createdcount;
        this.repmverifyrecords = resultdata.verifycount;
        this.repmassignedrecords = resultdata.assignedcount;
        this.repminprogressrecords = resultdata.inprogesscount;
        this.repmcompletedrecords = resultdata.completedcount;
        this.repmacknowledgerecords = resultdata.acknowlegecount;

        this.repmverifynorecordflag = true;

        this.pleasewaitflag = false;
      }
    });
  }

  getRePMAllPVNotification(getcurrentsegment) {
    let getfromdate = moment(this.repmfromdate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    let gettodate = moment(this.repmtodate, "DD-MM-YYYY").format("YYYY-MM-DD");

    this.repmallnotificationlistArr = [];
    this.repmallnorecordflag = false;
    this.pleasewaitflag = true;

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      fromdate: getfromdate,
      todate: gettodate,
      status: 0,
      type: 1,
      segment: getcurrentsegment,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getPreventiveMaintenanceList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.repmallnotificationlistArr = resultdata.data;

        this.repmcreatedrecords = resultdata.createdcount;
        this.repmverifyrecords = resultdata.verifycount;
        this.repmassignedrecords = resultdata.assignedcount;
        this.repminprogressrecords = resultdata.inprogesscount;
        this.repmcompletedrecords = resultdata.completedcount;
        this.repmacknowledgerecords = resultdata.acknowlegecount;

        this.repmallnorecordflag = false;

        this.pleasewaitflag = false;
      } else {
        this.repmallnotificationlistArr = [];

        this.repmcreatedrecords = resultdata.createdcount;
        this.repmverifyrecords = resultdata.verifycount;
        this.repmassignedrecords = resultdata.assignedcount;
        this.repminprogressrecords = resultdata.inprogesscount;
        this.repmcompletedrecords = resultdata.completedcount;
        this.repmacknowledgerecords = resultdata.acknowlegecount;

        this.repmallnorecordflag = true;

        this.pleasewaitflag = false;
      }
    });
  }

  segmentChanged(ev: any) {
    //console.log("Segment changed", ev.detail.value);
    if (ev.detail.value == "Routine") {
      this.secondtabs_segment = "Created";

      if (this.secondtabs_segment == "Created") {
        this.getRoPMCreatedPVNotification(this.secondtabs_segment);
      } else {
        this.getRoPMAllPVNotification(this.secondtabs_segment);
      }
    }

    if (ev.detail.value == "Replacement") {
      this.secondtabs_segment = "Created";

      if (this.secondtabs_segment == "Created") {
        this.getRePMCreatedPVNotification(this.secondtabs_segment);
      } else {
        this.getRePMAllPVNotification(this.secondtabs_segment);
      }
    }
  }

  secondsegmentChanged(ev: any) {
    if (this.tabs_segment == "Routine") {
      if (ev.detail.value == "Created") {
        this.getRoPMCreatedPVNotification(ev.detail.value);
      }

      if (ev.detail.value == "All") {
        this.thirdtabs_segment = "Assigned";

        this.getRoPMAllPVNotification(this.thirdtabs_segment);
      }
    } else {
      if (ev.detail.value == "Created") {
        this.getRePMCreatedPVNotification(ev.detail.value);
      }

      if (ev.detail.value == "Verify") {
        this.getRePMVerifyPVNotification(ev.detail.value);
      }

      if (ev.detail.value == "All") {
        this.thirdtabs_segment = "Assigned";

        this.getRePMAllPVNotification(this.thirdtabs_segment);
      }
    }
  }

  thirdsegmentChanged(ev: any) {
    //console.log(this.thirdtabs_segment);
    if (this.tabs_segment == "Routine") {
      if (this.secondtabs_segment == "All") {
        this.getRoPMAllPVNotification(this.thirdtabs_segment);
      }
    } else {
      if (this.secondtabs_segment == "All") {
        this.getRePMAllPVNotification(this.thirdtabs_segment);
      }
    }
  }

  btn_PVNotificationEdit(value) {
    this.callmodalcontroller(value, "REPLACEMENT");
  }

  btn_PVNotificationView(value) {
    if (this.tabs_segment == "Routine") {
      this.router.navigate([
        "/maintenance-notification-view",
        { item: JSON.stringify(value), from: "RoPM" },
      ]);
    }

    if (this.tabs_segment == "Replacement") {
      this.router.navigate([
        "/maintenance-notification-view",
        { item: JSON.stringify(value), from: "RePM" },
      ]);
    }
  }

  btn_PVNotificationAssign(value) {
    this.router.navigate([
      "/maintenance-preventivemaintenance-assign",
      { item: JSON.stringify(value) },
    ]);
  }

  btn_PVNotificationMaterialRequest(value) {
    this.router.navigate([
      "/maintenance-preventivemaintenance-created",
      { item: JSON.stringify(value) },
    ]);
  }

  btn_NotificationVerify(value) {
    this.callmodalcontroller(value, "VERIFY");
  }

  async callmodalcontroller(value, type) {
    //console.log(this.tabs_segment);

    if (type == "ASSIGN") {
      const modal = await this.modalController.create({
        component: MaintenancePreventivemaintenanceAssignModalPage,
        componentProps: {
          item: JSON.stringify(value),
          module: "MAINTENANCE",
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ["notification-modal"],
      });

      modal.onDidDismiss().then((data) => {
        this.ngAfterViewInit();
      });

      return await modal.present();
    }

    if (type == "VERIFY") {
      const modal = await this.modalController.create({
        component: MaintenanceForemanVerificationPage,
        componentProps: {
          item: JSON.stringify(value),
          module: "RePM",
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ["notification-modal"],
      });

      modal.onDidDismiss().then((data) => {
        this.ngAfterViewInit();
      });

      return await modal.present();
    }

    if (type == "REPLACEMENT") {
      const modal = await this.modalController.create({
        component: MaintenanceReplacementModalPage,
        componentProps: {
          item: JSON.stringify(value),
          module: "RePM",
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ["notification-modal"],
      });

      modal.onDidDismiss().then((data) => {
        this.ngAfterViewInit();
      });

      return await modal.present();
    }

    if (type == "ACKNOWLEDGE") {
      let currenttabselected = "";

      if (this.tabs_segment == "Routine") {
        currenttabselected = "RoPM";
      }

      if (this.tabs_segment == "Replacement") {
        currenttabselected = "RePM";
      }

      const modal = await this.modalController.create({
        component: MaintenanceAcknowledgeModalPage,
        componentProps: {
          item: JSON.stringify(value),
          module: currenttabselected,
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ["notification-modal"],
      });

      modal.onDidDismiss().then((data) => {
        this.ngAfterViewInit();
      });

      return await modal.present();
    }
  }
}
