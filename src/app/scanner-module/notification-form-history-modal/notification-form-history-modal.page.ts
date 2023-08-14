import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { LanguageService } from "src/app/services/language-service/language.service";
import { ModalController, NavParams } from "@ionic/angular";

@Component({
  selector: "app-notification-form-history-modal",
  templateUrl: "./notification-form-history-modal.page.html",
  styleUrls: ["./notification-form-history-modal.page.scss"],
})
export class NotificationFormHistoryModalPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  millcode = this.userlist.millcode;

  params;
  notificationid = "";

  generalArr = [];
  issuanceArr = [];
  operationArr = [];
  cmpartslistArr = [];
  ropmpartslistArr = [];
  repmpartslistArr = [];

  notificationstatus = "";
  notificationstatusid = "";
  notificationno = "";
  type = "";
  stationcode = "";
  station = "";
  maximumrunninghours = "";
  runninghours = "";
  extendedmaximumrunninghours = "";
  equipment = "";
  reportedby = "";
  notificationtype = "";
  breakdownremarks = "";
  breakdowncoding = "";
  maintenancetype = "";
  partdefect = "";
  partdefectid = "";
  damage = "";
  breakdowncauses = "";
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
  screenname = "";
  statusid = "";
  conditionid = "";

  // Flag
  detailsnorecordFlag = false;
  repairactivitynorecordFlag = false;
  jobauthorizationnorecordFlag = false;

  constructor(
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    public navParams: NavParams,
    private fb: FormBuilder,
    public modalController: ModalController,
    private commonservice: AIREIService,
    private supervisorservice: SupervisorService
  ) {
    let viewform = navParams.get("item");
    this.params = JSON.parse(viewform);
    this.notificationid = this.params.id;
    if (
      navParams.get("from") !== "undefined" &&
      navParams.get("from") !== null
    ) {
      this.fromscreen = navParams.get("from");
    }
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getNotificationView();
  }

  ionViewDidEnter() {
    this.getNotificationView();
  }

  getNotificationView() {
    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      id: this.notificationid,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.supervisorservice.getNotificationView(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.generalArr = resultdata.data.general;

        this.notificationstatus = this.generalArr[0].statusname;
        this.notificationstatusid = this.generalArr[0].statusId;
        this.notificationno = this.generalArr[0].notificationno;
        this.stationcode = this.generalArr[0].stationcode;

        if (this.fromscreen == "RoPM") {
          this.notificationtype =
            "Routine " + this.generalArr[0].notificationtype;
        } else if (this.fromscreen == "RePM") {
          this.notificationtype =
            "Replacement " + this.generalArr[0].notificationtype;
        } else {
          this.notificationtype = this.generalArr[0].notificationtype;
        }

        this.breakdownremarks = this.generalArr[0].breakdownremarks;
        this.breakdowncoding = this.generalArr[0].breakdowncoding;
        this.maintenancetype = this.generalArr[0].maintenancetype;

        this.station = this.generalArr[0].stationname;
        this.equipment = this.generalArr[0].equipment;

        this.maximumrunninghours = this.generalArr[0].lifetimehours;
        //this.runninghours = this.generalArr[0].runningHours;
        this.extendedmaximumrunninghours =
          this.generalArr[0].extendedlifetimehours;

        //this.partdefect = this.generalArr[0].partdefect;
        this.partdefectid = this.generalArr[0].partdefectid;

        this.damage = this.generalArr[0].damages;
        this.breakdowncauses = this.generalArr[0].breakdowncauses;
        this.remarks = this.generalArr[0].remarks;
        this.createddatetime = this.generalArr[0].insDate;

        this.statusid = this.generalArr[0].statusId;
        this.reportedby = this.generalArr[0].reportBy;

        var getpartdefectidArr = this.partdefectid.split(",");

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

        if (this.fromscreen == "CM" && getpartdefectidArr.length > 1) {
          this.getParts(
            this.generalArr[0].stationid,
            this.generalArr[0].equipmentid,
            2,
            this.generalArr[0].runningHours,
            this.generalArr[0].partdefect
          );
        } else if (this.fromscreen == "RoPM" && getpartdefectidArr.length > 1) {
          this.getParts(
            this.generalArr[0].stationid,
            this.generalArr[0].equipmentid,
            0,
            this.generalArr[0].runningHours,
            this.generalArr[0].partdefect
          );
        } else if (this.fromscreen == "RePM" && getpartdefectidArr.length > 1) {
          this.getParts(
            this.generalArr[0].stationid,
            this.generalArr[0].equipmentid,
            1,
            this.generalArr[0].runningHours,
            this.generalArr[0].partdefect
          );
        } else if (this.partdefect == "") {
          if (this.fromscreen == "CM" || this.fromscreen == "CMVIEW") {
            if (this.damage == "" && this.activity == "") {
              this.getParts(
                this.generalArr[0].stationid,
                this.generalArr[0].equipmentid,
                2,
                this.generalArr[0].runningHours,
                this.generalArr[0].partdefect
              );
            } else {
              this.runninghours = this.generalArr[0].runningHours;
              this.partdefect = this.generalArr[0].partdefect;
            }
          } else if (
            this.fromscreen == "RoPM" ||
            this.fromscreen == "RoPMVIEW"
          ) {
            this.getParts(
              this.generalArr[0].stationid,
              this.generalArr[0].equipmentid,
              0,
              this.generalArr[0].runningHours,
              this.generalArr[0].partdefect
            );
          } else if (
            this.fromscreen == "RePM" ||
            this.fromscreen == "RePMVIEW"
          ) {
            this.getParts(
              this.generalArr[0].stationid,
              this.generalArr[0].equipmentid,
              1,
              this.generalArr[0].runningHours,
              this.generalArr[0].partdefect
            );
          }
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
        this.equipment = "";
        this.runninghours = "";
        this.partdefect = "";
        this.damage = "";
        this.breakdowncauses = "";
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

        this.cmpartslistArr = [];
        this.ropmpartslistArr = [];
        this.repmpartslistArr = [];
      }
    });
  }

  getParts(
    getstationid,
    getequipmentid,
    getpvflag,
    getrunninghours,
    getpartdefect
  ) {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      id: this.notificationid,
      partdefectid: this.partdefectid,
      stationid: getstationid,
      equipment: getequipmentid,
      pvflag: getpvflag,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.supervisorservice.getMultiPartDefectViewList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.runninghours = "";
        this.partdefect = "";

        if (getpvflag == 0) {
          this.ropmpartslistArr = resultdata.data;
        } else if (getpvflag == 1) {
          this.repmpartslistArr = resultdata.data;
        } else {
          this.cmpartslistArr = resultdata.data;
        }

        //console.log(this.cmpartslistArr);
      } else {
        this.runninghours = getrunninghours;
        this.partdefect = getpartdefect;

        if (getpvflag == 0) {
          this.ropmpartslistArr = [];
        } else if (getpvflag == 1) {
          this.repmpartslistArr = [];
        } else {
          this.cmpartslistArr = [];
        }
      }
    });
  }

  goBack() {
    //console.log("screenname:", this.screenname);
    if (this.screenname == "qrcodehistory") {
      this.router.navigate(["/qrcodescanner", { uienable: "true" }]);
    } else if (this.screenname == "maintenancenotificationreport") {
      this.router.navigate(["/report-production-maintenance-notification"]);
    } else {
      this.router.navigate(["/production-notification-list"]);
    }
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }
}
