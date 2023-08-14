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
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
  IonContent,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

// Modal
import { PopupReplacementExtendedhoursUpdatePage } from "src/app/maintenance-module/popup-replacement-extendedhours-update/popup-replacement-extendedhours-update.page";

@Component({
  selector: "app-update-extendedrunninghours",
  templateUrl: "./update-extendedrunninghours.page.html",
  styleUrls: ["./update-extendedrunninghours.page.scss"],
})
export class UpdateExtendedrunninghoursPage implements OnInit {
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
  cmpartslistArr = [];
  ropmpartslistArr = [];
  repmpartslistArr = [];

  notificationstatus = "";
  notificationstatusid = "";
  notificationno = "";
  type = "";
  stationcode = "";
  station = "";
  stationid = "";
  maximumrunninghours = "";
  runninghours = "";
  extendedmaximumrunninghours = "";
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
  fromscreen = "RePM";
  getreportdate = "";
  statusid = "";
  conditionid = "";
  extendrunninghoursFlag = "";
  modal_extendedrunninghours;

  // Flag
  detailsnorecordFlag = false;
  repairactivitynorecordFlag = false;
  jobauthorizationnorecordFlag = false;
  isDisabled = false;

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private fb: FormBuilder,
    public navParams: NavParams,
    public modalController: ModalController,
    public extendedrunninghoursController: ModalController,
    private commonservice: AIREIService,
    private screenOrientation: ScreenOrientation,
    private maintenanceservice: MaintenanceServiceService
  ) {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.modalController.getTop().then((modal) => {
        if (modal != null) {
          return;
        } // Don't go back if there's a modal opened
      });
    });

    let viewform = navParams.get("item");
    this.params = JSON.parse(viewform);
    this.notificationid = this.params.baseid;

    console.log(this.params);

    //console.log(this.fromscreen);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
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

    this.maintenanceservice.getNotificationView(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.generalArr = resultdata.data.general;

        //console.log(this.generalArr);

        this.notificationstatus = this.generalArr[0].statusname;
        this.notificationstatusid = this.generalArr[0].statusId;
        this.notificationno = this.generalArr[0].notificationno;
        this.stationcode = this.generalArr[0].stationcode;

        if (
          this.fromscreen == "RoPM" ||
          this.fromscreen == "RoPMVIEW" ||
          this.fromscreen == "RoPMReport"
        ) {
          this.notificationtype =
            "Routine " + this.generalArr[0].notificationtype;
        } else if (
          this.fromscreen == "RePM" ||
          this.fromscreen == "RePMVIEW" ||
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
        this.maximumrunninghours = this.generalArr[0].lifetimehours;
        //this.runninghours = this.generalArr[0].runningHours;
        this.extendedmaximumrunninghours =
          this.generalArr[0].extendedlifetimehours;
        //this.partdefect = this.generalArr[0].partdefect;
        this.partdefectid = this.generalArr[0].partdefectid;
        this.damage = this.generalArr[0].damages;
        this.damagesid = this.generalArr[0].damagesid;
        this.breakdowncauses = this.generalArr[0].breakdowncauses;
        this.breakdowncausesid = this.generalArr[0].breakdowncausesidnew;
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

        if (
          (this.fromscreen == "CM" || this.fromscreen == "CMVIEW") &&
          getpartdefectidArr.length > 1
        ) {
          this.getParts(
            this.generalArr[0].stationid,
            this.generalArr[0].equipmentid,
            2,
            this.generalArr[0].runningHours,
            this.generalArr[0].partdefect
          );
        } else if (
          (this.fromscreen == "RoPM" || this.fromscreen == "RoPMVIEW") &&
          getpartdefectidArr.length > 1
        ) {
          this.getParts(
            this.generalArr[0].stationid,
            this.generalArr[0].equipmentid,
            0,
            this.generalArr[0].runningHours,
            this.generalArr[0].partdefect
          );
        } else if (
          (this.fromscreen == "RePM" || this.fromscreen == "RePMVIEW") &&
          getpartdefectidArr.length > 1
        ) {
          this.getParts(
            this.generalArr[0].stationid,
            this.generalArr[0].equipmentid,
            1,
            this.generalArr[0].runningHours,
            this.generalArr[0].partdefect
          );
        } else if (this.partdefect == "") {
          if (this.fromscreen == "CM" || this.fromscreen == "CMVIEW") {
            this.getParts(
              this.generalArr[0].stationid,
              this.generalArr[0].equipmentid,
              2,
              this.generalArr[0].runningHours,
              this.generalArr[0].partdefect
            );
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
        this.stationid = "";

        this.equipment = "";
        this.equipmentid = "";

        this.maximumrunninghours = "";
        this.runninghours = "";
        this.extendedmaximumrunninghours = "";

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

    console.log(req);

    this.maintenanceservice.getMultiPartDefectViewList(req).then((result) => {
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

        /*this.repmpartslistArr = [
          {
            partname: "MECH,PLUMMER BLOCK SN 513",
            condition: "Replaced",
            maximumrunninghours: "",
            extendedmaximumrunninghours: "",
            partid: 3,
            currentrunninghours: "166 Hours",
            updatebutton: 0,
          },
          {
            partname: "MECH,COUPLING MACHINE - 1",
            condition: "Serviced",
            maximumrunninghours: "2404.0 Hours",
            extendedmaximumrunninghours: "",
            partid: 1,
            currentrunninghours: "2348 Hours",
            updatebutton: 1,
          },
          {
            partname: "MECH,COUPLING MACHINE - 2",
            condition: "Serviced",
            maximumrunninghours: "2404.0 Hours",
            extendedmaximumrunninghours: "",
            partid: 2,
            currentrunninghours: "2348 Hours",
            updatebutton: 1,
          },
        ];*/

        console.log(this.repmpartslistArr);
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

  authorizenotification() {
    if (this.designationid != 2) {
      this.isDisabled = true;

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
        cmflag: 0,
        id: this.notificationid,
        language: this.languageService.selected,
      };

      //console.log(req);

      this.maintenanceservice
        .formanCorrectiveMaintenanceVerify(req)
        .then((result) => {
          var resultdata: any;
          resultdata = result;
          if (resultdata.httpcode == 200) {
            this.isDisabled = false;

            this.commonservice.presentToast(
              this.translate.instant(
                "MAINTENANCEACKNOWLEDGEMODAL.closedsuccess"
              )
            );

            this.modalController.dismiss({
              dismissed: true,
              item: "Submitted",
            });
          } else {
            this.isDisabled = false;

            this.commonservice.presentToast(
              this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.closedfailed")
            );
          }
        });
    }

    if (this.designationid == 2) {
      let extendedhourstoupdate = 1;
      let validationflag = false;
      let partsstatus = [];

      if (this.fromscreen == "RePM") {
        for (let i = 0; i < this.repmpartslistArr.length; i++) {
          if (
            this.repmpartslistArr[i].updatebutton == 1 &&
            this.repmpartslistArr[i].extendedmaximumrunninghours == ""
          ) {
            validationflag = true;
          }
        }

        if (validationflag) {
          this.commonservice.presentToast(
            this.translate.instant(
              "MAINTENANCENOTIFICATIONVIEW.extendhoursmandatory"
            )
          );
          return;
        }

        this.isDisabled = true;

        if (!validationflag) {
          for (let i = 0; i < this.repmpartslistArr.length; i++) {
            if (this.repmpartslistArr[i].updatebutton == 1) {
              extendedhourstoupdate = 2;
            }

            let eachreq = {
              partid: this.repmpartslistArr[i].partid,
              replacestatus: this.repmpartslistArr[i].condition,
              lifetimerunninghours:
                this.repmpartslistArr[i].maximumrunninghours,
              currentrunninghours: this.repmpartslistArr[i].currentrunninghours,
              extendedmaxrunninghours:
                this.repmpartslistArr[i].extendedmaximumrunninghours,
              updatebutton: this.repmpartslistArr[i].updatebutton,
              notificationdetailid:
                this.repmpartslistArr[i].maintenance_notification_det_id,
            };

            partsstatus.push(eachreq);
          }
        }
      }

      let req = {
        user_id: this.userlist.userId,
        millcode: this.userlist.millcode,
        dept_id: this.userlist.dept_id,
        design_id: this.userlist.desigId,
        stationid: this.stationid,
        equipment: this.equipmentid,
        maintanence_type: this.maintenancetypeid,
        part_defect: this.partdefectid,
        partsarray: JSON.stringify(partsstatus),
        other_part_name: "",
        damage: this.damagesid,
        breakdown_cause: this.breakdowncausesid,
        cmflag: 0,
        id: this.notificationid,
        extendrunninghoursflag: extendedhourstoupdate,
        language: this.languageService.selected,
      };

      //console.log(req);

      this.maintenanceservice
        .updateCorrectiveMaintenanceAuthorize(req)
        .then((result) => {
          var resultdata: any;
          resultdata = result;
          if (resultdata.httpcode == 200) {
            this.updatenotificationlist();
          } else {
            this.commonservice.presentToast(
              this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.failed")
            );
          }
        });
    }
  }

  updatenotificationlist() {
    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      id: this.params.id,
      filter: 2,
      language: this.languageService.selected,
    };

    this.commonservice.deletedasboardnotification(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.commonservice.presentToast(
          this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.success")
        );

        this.modalController.dismiss({
          dismissed: true,
          item: "Submitted",
        });
      } else {
        this.commonservice.presentToast(
          this.translate.instant("SEGREGATENOTIFICATION.message")
        );
      }
    });
  }

  async callmodalcontroller(value) {
    const extendedrunninghoursmodal =
      await this.extendedrunninghoursController.create({
        component: PopupReplacementExtendedhoursUpdatePage,
        componentProps: {
          station: this.station,
          machine: this.equipment,
          id: this.notificationno,
          item: JSON.stringify(value),
        },
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ["notification-modal"],
      });

    extendedrunninghoursmodal.onDidDismiss().then((modeldata) => {
      this.modal_extendedrunninghours = String(
        modeldata["data"]["extendedrunninghours"]
      );

      if (this.modal_extendedrunninghours != "") {
        const index = this.repmpartslistArr.findIndex(
          (acc) => acc.partid === value.partid
        );

        this.repmpartslistArr[index].extendedmaximumrunninghours =
          this.modal_extendedrunninghours;
      }
    });

    return await extendedrunninghoursmodal.present();
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }
}
