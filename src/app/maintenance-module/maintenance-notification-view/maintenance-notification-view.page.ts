import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { MaintenanceServiceService } from "src/app/services/maintenance-serivce/maintenance-service.service";
import { AlertController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

@Component({
  selector: "app-maintenance-notification-view",
  templateUrl: "./maintenance-notification-view.page.html",
  styleUrls: ["./maintenance-notification-view.page.scss"],
})
export class MaintenanceNotificationViewPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  millcode = this.userlist.millcode;
  departmentid = this.userlist.dept_id;
  designationid = this.userlist.desigId;

  params;
  notificationid = "";

  generalArr = [];
  issuanceArr = [];
  operationArr = [];
  tasklistArr = [];

  notificationstatus = "";
  notificationstatusid = "";
  notificationno = "";
  type = "";
  stationcode = "";
  station = "";
  stationid = "";
  runninghours = "";
  equipment = "";
  equipmentid = "";
  reportedby = "";
  notificationtype = "";
  breakdownremarks = "";
  breakdowncoding = "";
  maintenancetype = "";
  maintenancetypeid = "";
  partdefect = "";
  partdefectid = "";
  damage = "";
  damagesid = "";
  breakdowncauses = "";
  breakdowncausesid = "";
  remarks = "";
  createddatetime = "";
  activity = "";
  carriedoutby = "";
  verifiedby = "";
  partreceiveddatetime = "";
  activitycompletiondatetime = "";
  authorizedby = "";
  authorizeddatetime = "";
  fromscreen = "";
  getreportdate = "";
  statusid = "";
  conditionid = "";

  // Flag
  detailsnorecordFlag = false;
  repairactivitynorecordFlag = false;
  jobauthorizationnorecordFlag = false;
  isDisabled = false;

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private screenOrientation: ScreenOrientation,
    private maintenanceservice: MaintenanceServiceService
  ) {
    let viewform = this.route.snapshot.paramMap.get("item");
    this.params = JSON.parse(viewform);
    this.notificationid = this.params.id;
    this.conditionid = this.params.conditionid;

    //console.log(this.params);

    if (
      this.route.snapshot.paramMap.get("from") !== "undefined" &&
      this.route.snapshot.paramMap.get("from") !== null
    ) {
      this.fromscreen = this.route.snapshot.paramMap.get("from");
    }

    if (
      this.route.snapshot.paramMap.get("reportdate") !== "undefined" &&
      this.route.snapshot.paramMap.get("reportdate") !== null
    ) {
      this.getreportdate = this.route.snapshot.paramMap.get("reportdate");
    }

    //console.log(this.getreportdate);

    /*if (this.fromscreen == "PV" || this.fromscreen == "RPV") {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    }*/
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getNotificationView();
  }

  ionViewDidEnter() {
    this.getNotificationView();
  }

  ngOnDestroy() {
    /*if (this.fromscreen == "PV" || this.fromscreen == "RPV") {
      this.screenOrientation.unlock();
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );
    }*/
  }

  getNotificationView() {
    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      id: this.notificationid,
      language: this.languageService.selected,
    };

    console.log(req);

    this.maintenanceservice.getNotificationView(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.generalArr = resultdata.data.general;

        this.notificationstatus = this.generalArr[0].statusname;
        this.notificationstatusid = this.generalArr[0].statusId;
        this.notificationno = this.generalArr[0].notificationno;
        this.stationcode = this.generalArr[0].stationcode;

        if (this.fromscreen == "RoPM" || this.fromscreen == "RoPMReport") {
          this.notificationtype =
            "Routine " + this.generalArr[0].notificationtype;
        } else if (
          this.fromscreen == "RePM" ||
          this.fromscreen == "RePMReport" ||
          this.fromscreen == "RePMACK"
        ) {
          this.notificationtype =
            "Replacement " + this.generalArr[0].notificationtype;
        } else {
          this.notificationtype = this.generalArr[0].notificationtype;
        }

        this.breakdownremarks = this.generalArr[0].breakdownremarks;
        this.breakdowncoding = this.generalArr[0].breakdowncoding;
        this.maintenancetype = this.generalArr[0].maintenancetype;
        this.maintenancetypeid = this.generalArr[0].maintenancetypeid;
        this.station = this.generalArr[0].stationname;
        this.stationid = this.generalArr[0].stationid;
        this.equipment = this.generalArr[0].equipment;
        this.equipmentid = this.generalArr[0].equipmentid;
        this.runninghours = this.generalArr[0].runningHours;
        this.partdefect = this.generalArr[0].partdefect;
        this.partdefectid = this.generalArr[0].partdefectid;
        this.damage = this.generalArr[0].damages;
        this.damagesid = this.generalArr[0].damagesid;
        this.breakdowncauses = this.generalArr[0].breakdowncauses;
        this.breakdowncausesid = this.generalArr[0].breakdowncausesidnew;
        this.remarks = this.generalArr[0].remarks;
        this.createddatetime = this.generalArr[0].insDate;

        this.statusid = this.generalArr[0].statusId;
        this.reportedby = this.generalArr[0].reportBy;

        if (
          this.station == "" &&
          this.equipment == "" &&
          this.runninghours == "" &&
          this.partdefect == "" &&
          this.damage == "" &&
          this.breakdowncauses == "" &&
          this.remarks == "" &&
          this.createddatetime
        ) {
          this.detailsnorecordFlag = true;
        }

        this.activity = this.generalArr[0].activity;
        this.partreceiveddatetime = this.generalArr[0].partreceiveddatetime;
        this.activitycompletiondatetime =
          this.generalArr[0].workcompletiondatetime;
        this.carriedoutby = this.generalArr[0].carriedoutby;
        this.verifiedby = this.generalArr[0].verifiedby;
        if (
          this.activity == "" &&
          this.partreceiveddatetime == "" &&
          this.activitycompletiondatetime == "" &&
          this.carriedoutby == "" &&
          this.verifiedby == ""
        ) {
          this.repairactivitynorecordFlag = true;
        }

        this.authorizedby = this.generalArr[0].authorisedBy;
        this.authorizeddatetime = this.generalArr[0].acknowledgeddatetime;

        if (this.authorizedby == "" && this.authorizeddatetime == "") {
          this.jobauthorizationnorecordFlag = true;
        }

        this.tasklistArr = resultdata.data.tasklist;

        if (
          typeof this.tasklistArr == "undefined" ||
          this.tasklistArr == null
        ) {
          this.tasklistArr = [];
        }
      } else {
        this.generalArr = [];

        this.notificationstatus = "";
        this.notificationstatusid = "";
        this.notificationno = "";
        this.stationcode = "";
        this.notificationtype = "";
        this.breakdowncoding = "";
        this.maintenancetype = "";

        this.station = "";
        this.stationid = "";

        this.equipment = "";
        this.equipmentid = "";

        this.runninghours = "";

        this.partdefect = "";
        this.partdefectid = "";

        this.damage = "";
        this.damagesid = "";

        this.breakdowncauses = "";
        this.breakdowncausesid = "";

        this.remarks = "";
        this.createddatetime = "";

        this.activity = "";
        this.partreceiveddatetime = "";
        this.activitycompletiondatetime = "";

        this.carriedoutby = "";
        this.verifiedby = "";

        this.reportedby = "";
        this.authorizedby = "";
        this.authorizeddatetime = "";

        this.tasklistArr = [];
      }
    });
  }

  btn_ConditionCheck() {
    if (this.conditionid == "1") {
      this.showCreateCM();
    } else {
      this.showAuthorize();
    }
  }

  showCreateCM() {
    let alertmessage;

    alertmessage = this.translate.instant("MAINTENANCENOTIFICATIONVIEW.alert");

    this.alertController
      .create({
        header: this.translate.instant("MAINTENANCENOTIFICATIONVIEW.header"),
        message: alertmessage,
        cssClass: "alertmessage",
        backdropDismiss: true,
        buttons: [
          {
            text: this.translate.instant("MAINTENANCENOTIFICATIONVIEW.no"),
            role: "no",
            cssClass: "secondary",
            handler: (no) => {
              this.authorizecorrectivemaintenance(0);
            },
          },
          {
            text: this.translate.instant("MAINTENANCENOTIFICATIONVIEW.yes"),
            handler: () => {
              this.authorizecorrectivemaintenance(1);
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  showAuthorize() {
    let alertmessage;

    if (this.fromscreen == "RoPM") {
      alertmessage = this.translate.instant(
        "MAINTENANCENOTIFICATIONVIEW.alertroutine"
      );
    }

    if (this.fromscreen == "RePM" || this.fromscreen == "RePMACK") {
      alertmessage = this.translate.instant(
        "MAINTENANCENOTIFICATIONVIEW.alertreplacement"
      );
    }

    if (this.fromscreen == "CM" || this.fromscreen == "CMACK") {
      alertmessage = this.translate.instant(
        "MAINTENANCENOTIFICATIONVIEW.alertcorrective"
      );
    }

    this.alertController
      .create({
        header: this.translate.instant("MAINTENANCENOTIFICATIONVIEW.header"),
        message: alertmessage,
        cssClass: "alertmessage",
        backdropDismiss: false,
        buttons: [
          {
            text: this.translate.instant("MAINTENANCENOTIFICATIONVIEW.no"),
            role: "no",
            cssClass: "secondary",
            handler: (no) => {
              //console.log("No");
            },
          },
          {
            text: this.translate.instant("MAINTENANCENOTIFICATIONVIEW.yes"),
            handler: () => {
              this.authorizecorrectivemaintenance("0");
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  authorizecorrectivemaintenance(value) {
    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      stationid: this.stationid,
      equipment: this.equipmentid,
      maintanence_type: this.maintenancetypeid,
      part_defect: this.partdefectid,
      other_part_name: "",
      damage: this.damagesid,
      breakdown_cause: this.breakdowncausesid,
      cmflag: value,
      id: this.notificationid,
      language: this.languageService.selected,
    };

    console.log(req);

    this.maintenanceservice
      .updateCorrectiveMaintenanceAuthorize(req)
      .then((result) => {
        var resultdata: any;
        resultdata = result;
        if (resultdata.httpcode == 200) {
          if (
            this.fromscreen == "RoPM" ||
            this.fromscreen == "RePM" ||
            this.fromscreen == "RePMACK"
          ) {
            this.commonservice.presentToast(
              this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.success")
            );

            this.router.navigate([
              "/maintenance-pvrpv-list",
              { reportdate: this.getreportdate },
            ]);
          } else {
            this.commonservice.presentToast(
              this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.success")
            );

            this.router.navigate([
              "/maintenance-notification-list",
              { reportdate: this.getreportdate },
            ]);
          }
        } else {
          this.commonservice.presentToast(
            this.translate.instant("MAINTENANCENOTIFICATIONVIEW.updatefailed")
          );
        }
      });
  }
}
