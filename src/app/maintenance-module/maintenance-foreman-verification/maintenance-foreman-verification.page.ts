import { Component, OnInit, ViewChild } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
  IonContent,
} from "@ionic/angular";
import { MaintenanceServiceService } from "src/app/services/maintenance-serivce/maintenance-service.service";

// Custom Date Picker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { Plugins } from "@capacitor/core";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

import { MaintenanceMaterialsearchPage } from "src/app/maintenance-module/maintenance-materialsearch/maintenance-materialsearch.page";

@Component({
  selector: "app-maintenance-foreman-verification",
  templateUrl: "./maintenance-foreman-verification.page.html",
  styleUrls: ["./maintenance-foreman-verification.page.scss"],
})
export class MaintenanceForemanVerificationPage implements OnInit {
  @ViewChild("pageTop") pageTop: IonContent;
  @ViewChild("damagetypeSelect", { static: false }) damagetypeRef: IonSelect;
  @ViewChild("breakdowncausesSelect", { static: false })
  breakdowncausesRef: IonSelect;
  @ViewChild("assignedtoSelect", { static: false }) assignedtoRef: IonSelect;

  userlist = JSON.parse(localStorage.getItem("userlist"));

  step1Form;

  params;

  title = this.translate.instant(
    "MAINTENANCEACKNOWLEDGEMODAL.correctivemaintenance"
  );
  module = "";

  breakdownArr = [];
  maintenancetypeArr = [];

  damageArr = [];
  breakdowncausesArr = [];
  activityArr = [];
  assignedtoArr = [];

  // Flags
  previewFlag = true;
  stepFlag = false;
  step1completedFlag = false;
  step2completedFlag = false;
  step3completedFlag = false;
  step4completedFlag = false;
  viewFlag = false;

  breakdownFlag = false;

  maintenancetypeFlag = false;

  partFlag = false;
  otherFlag = false;

  //additionpartdamageFlag = false;
  //additionalpartdamageotherFlag = false;

  damageFlag = false;

  breakdowncausesFlag = false;

  activityFlag = false;
  otheractivityFlag = false;

  assignedtoFlag = false;

  confirmDisable = false;

  // Variables
  getnotificationid = "";
  getnotificationnumber = "";
  getstationid = "";
  getstationname = "";
  getmachineid = "";
  getequipmentname = "";
  getnotificationtype = "";

  getbreakdown = "";
  getmaintenancetypeid = "";
  getmaintenancetype = "";
  getpartdefectid = "";
  getpartdefect = "";
  getbreakdowncausesid = "";
  getbreakdowncauses = "";
  getbreakdownremarks = "";

  getstatus = "";
  getstatusid = "";

  getrunninghours = "";
  getcreateddatetime = "";
  getreportedby = "";
  getremarks = "";
  getactivity = "";
  getpartreceiveddatetime = "";
  getactivitycompletiondatetime = "";
  getcarriedoutby = "";
  getverifiedby = "";
  getauthorizedby = "";
  getauthorizeddatetime = "";

  damagetypeid = "";
  damagetypevalue = "";
  damagetypeidArr = [];
  damagetypevalueArr = [];

  // View the details
  view_damage_type = "";
  view_damage_typeid = "";

  // Notification View
  generalArr = [];

  // Flag
  repairactivitynorecordFlag = false;
  jobauthorizationnorecordFlag = false;

  // Ionic Select Header
  public maintenancetypeOptions: any = {
    header: this.translate.instant(
      "MAINTENANCEACKNOWLEDGEMODAL.maintenancetype"
    ),
    cssClass: "multiselect",
  };

  public damagetypeOptions: any = {
    header: this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.damagetype"),
    cssClass: "multiselect",
  };

  public breakdowncausesOptions: any = {
    header: this.translate.instant(
      "MAINTENANCEACKNOWLEDGEMODAL.breakdowncauses"
    ),
    cssClass: "multiselect",
  };

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private router: Router,
    private alertController: AlertController,
    public modalController: ModalController,
    public notificationviewmodalController: ModalController,
    public partmodalController: ModalController,
    public otherpartmodalController: ModalController,
    public activitymodalController: ModalController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private commonservice: AIREIService,
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

    this.title = "ID: " + this.params.notificationno;
    this.module = navParams.get("module");

    console.log(this.params);

    this.getnotificationid = this.params.id;
    this.getnotificationnumber = this.params.notificationno;
    this.getstationid = this.params.stationid;
    this.getstationname = this.params.stationname;
    this.getmachineid = this.params.equipmentid;
    this.getequipmentname = this.params.equipmentname;
    this.getnotificationtype = this.params.notificationtype;
    this.getbreakdown = this.params.breakdowncoding;

    this.getmaintenancetypeid = this.params.maintenancetypeid;
    this.getmaintenancetype = this.params.maintenancetype;
    this.getpartdefectid = this.params.partdefectid;
    this.getpartdefect = this.params.partdefect;
    this.getbreakdowncausesid = this.params.breakdowncausesid;
    this.getbreakdowncauses = this.params.breakdowncauses;
    this.getbreakdownremarks = this.params.breakdownremarks;

    this.getstatus = this.params.statusname;
    this.getstatusid = this.params.statusId;

    this.step1Form = this.fb.group({
      select_damagetype: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getDamage();
  }

  getStatusColor(type) {
    let color;

    if (type == "STEP1") {
      if (!this.step1completedFlag) {
        color = "#ff0000";
      } else if (this.step1completedFlag) {
        color = "#008000";
      } else {
        color = "#ff0000";
      }
    } else if (type == "STEP2") {
      if (!this.step2completedFlag) {
        color = "#ff0000";
      } else if (this.step2completedFlag) {
        color = "#008000";
      } else {
        color = "#ff0000";
      }
    } else if (type == "STEP3") {
      if (!this.step3completedFlag) {
        color = "#ff0000";
      } else if (this.step3completedFlag) {
        color = "#008000";
      } else {
        color = "#ff0000";
      }
    } else if (type == "STEP4") {
      if (!this.step4completedFlag) {
        color = "#ff0000";
      } else if (this.step4completedFlag) {
        color = "#008000";
      } else {
        color = "#ff0000";
      }
    } else {
      color = "#ff0000";
    }

    return color;
  }

  getDamage() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
    };
    this.maintenanceservice.getDamageList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.damageArr = resultdata.data;

        let eachArr = [];

        for (let i = 0; i < this.damageArr.length; i++) {
          let eachitem = this.damageArr[i];
          let eachreq = {
            id: eachitem.id,
            damage: eachitem.damage,
            selected: 0,
          };
          eachArr.push(eachreq);

          if (this.damagetypeid != "") {
            if (eachitem.id == this.damagetypeid) {
              eachArr[i]["selected"] = 1;
            }
          }
        }

        this.damageArr = eachArr;

        this.damageFlag = true;

        this.getNotificationView();
      } else {
        this.damageArr = [];

        this.damageFlag = false;

        this.getNotificationView();
      }
    });
  }

  getNotificationView() {
    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      id: this.getnotificationid,
    };

    this.maintenanceservice.getNotificationView(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.generalArr = resultdata.data.general;

        this.getrunninghours = this.generalArr[0].runningHours;
        this.getcreateddatetime = this.generalArr[0].insDate;
        this.getreportedby = this.generalArr[0].reportBy;
        this.getremarks = this.generalArr[0].remarks;

        this.getactivity = this.generalArr[0].activity;
        this.getpartreceiveddatetime = this.generalArr[0].partreceiveddatetime;
        this.getactivitycompletiondatetime =
          this.generalArr[0].workcompletiondatetime;
        this.getcarriedoutby = this.generalArr[0].carriedoutby;

        if (
          this.getactivity == "" &&
          this.getpartreceiveddatetime == "" &&
          this.getactivitycompletiondatetime == "" &&
          this.getcarriedoutby == "" &&
          this.getverifiedby == ""
        ) {
          this.repairactivitynorecordFlag = true;
        }

        this.getauthorizedby = this.generalArr[0].authorisedBy;
        this.getauthorizeddatetime = this.generalArr[0].acknowledgeddatetime;

        if (this.getauthorizedby == "" && this.getauthorizeddatetime == "") {
          this.jobauthorizationnorecordFlag = true;
        }
      } else {
        this.generalArr = [];

        this.getrunninghours = "";
        this.getcreateddatetime = "";
        this.getactivity = "";
        this.getpartreceiveddatetime = "";
        this.getactivitycompletiondatetime = "";
        this.getcarriedoutby = "";
        this.getverifiedby = "";
        this.getreportedby = "";
        this.getauthorizedby = "";
        this.getauthorizeddatetime = "";
      }
    });
  }

  btn_damagetype(value, index) {
    for (let i = 0; i < this.damageArr.length; i++) {
      if (this.damageArr[i].selected == 1) {
        this.damageArr[i]["selected"] = 0;
      }
    }

    if (value.selected == 0) {
      this.damagetypeid = value.id;
      this.damagetypevalue = value.damage;

      this.damageArr[index]["selected"] = 1;
    } else {
      this.damagetypeid = "";
      this.damagetypevalue = "";
      this.damageArr[index]["selected"] = 0;
    }
  }

  openDamageType() {
    this.damagetypeRef.open();
  }

  damagehandleChange(e) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.damagetypeidArr = [];
      this.damagetypevalueArr = [];
      for (let i = 0; i < value.length; i++) {
        this.damagetypeidArr.push(JSON.parse(value[i]).id);
        this.damagetypevalueArr.push(JSON.parse(value[i]).damage);
      }

      this.damagetypeid = this.damagetypeidArr.join(",");
      this.damagetypevalue = this.nl2br(this.damagetypevalueArr.join(", "));
    } else {
      this.damagetypeidArr = [];
      this.damagetypevalueArr = [];
      this.damagetypeid = "";
      this.damagetypevalue = "";
    }
  }

  btn_next(type) {
    if (type == "PREVIEW") {
      this.previewFlag = false;
      this.viewFlag = false;

      this.pageTop.scrollToTop();
      this.stepFlag = true;
    } else if (type == "STEP1") {
      if (this.step1Form.value.select_damagetype == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEACKNOWLEDGEMODAL.damagetypeselection"
          )
        );
        return;
      }

      this.view();
    }
  }

  btn_back(type) {
    if (type == "PREVIEW") {
      this.stepFlag = false;
      this.viewFlag = false;

      this.pageTop.scrollToTop();
      this.previewFlag = true;
    } else if (type == "STEP1") {
      this.previewFlag = false;
      this.viewFlag = false;

      this.pageTop.scrollToTop();
      this.stepFlag = true;
    }
  }

  view() {
    this.view_damage_type = this.damagetypevalueArr.join(", ");
    this.view_damage_typeid = this.damagetypeidArr.join(",");

    this.stepFlag = false;

    this.pageTop.scrollToTop();
    this.viewFlag = true;
  }

  showAuthorize() {
    /*let alertmessage;

    if (this.module == "RePM") {
      alertmessage = this.translate.instant(
        "MAINTENANCEACKNOWLEDGEMODAL.alertreplacementverify"
      );
    }

    if (this.module == "CM") {
      alertmessage = this.translate.instant(
        "MAINTENANCEACKNOWLEDGEMODAL.alertcorrectiveverify"
      );
    }

    this.alertController
      .create({
        header: this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.alert"),
        message: alertmessage,
        cssClass: "alertmessage",
        backdropDismiss: false,
        buttons: [
          {
            text: this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.no"),
            role: "no",
            cssClass: "secondary",
            handler: (no) => {
              //console.log("No");
            },
          },
          {
            text: this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.yes"),
            handler: () => {
              this.authorizecorrectivemaintenance();
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });*/

    this.authorizecorrectivemaintenance();
  }

  authorizecorrectivemaintenance() {
    this.confirmDisable = true;

    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      maintanence_type: this.getmaintenancetypeid,
      part_defect: this.getpartdefectid,
      other_part_name: "",
      damage: this.view_damage_typeid,
      breakdown_cause: this.getbreakdowncausesid,
      cmflag: 0,
      id: this.getnotificationid,
    };

    console.log(req);

    this.maintenanceservice
      .formanCorrectiveMaintenanceVerify(req)
      .then((result) => {
        var resultdata: any;
        resultdata = result;
        if (resultdata.httpcode == 200) {
          this.confirmDisable = false;

          this.commonservice.presentToast(
            this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.closedsuccess")
          );

          this.modalController.dismiss({
            dismissed: true,
            item: "Submitted",
          });
        } else {
          this.confirmDisable = false;

          this.commonservice.presentToast(
            this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.closedfailed")
          );
        }
      });
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  parseString(item) {
    return JSON.stringify(item);
  }
}
