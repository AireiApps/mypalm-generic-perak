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
  selector: "app-maintenance-notification-accept-modal",
  templateUrl: "./maintenance-notification-accept-modal.page.html",
  styleUrls: ["./maintenance-notification-accept-modal.page.scss"],
})
export class MaintenanceNotificationAcceptModalPage implements OnInit {
  @ViewChild("damagetypeSelect", { static: false }) damagetypeRef: IonSelect;

  userlist = JSON.parse(localStorage.getItem("userlist"));

  notificationacceptForm;

  params;
  screen;

  title = this.translate.instant(
    "MAINTENANCEACCEPTMODAL.correctivemaintenance"
  );

  generalArr = [];
  reasonArr = [];
  damageArr = [];
  materialrequiredArr = [
    {
      id: 1,
      name: this.translate.instant("MAINTENANCEACCEPTMODAL.yes"),
      selected: 0,
    },
    {
      id: 2,
      name: this.translate.instant("MAINTENANCEACCEPTMODAL.no"),
      selected: 0,
    },
  ];

  workordercompletedArr = [
    {
      id: 1,
      name: this.translate.instant("MAINTENANCEACCEPTMODAL.yes"),
      selected: 0,
    },
    {
      id: 2,
      name: this.translate.instant("MAINTENANCEACCEPTMODAL.no"),
      selected: 0,
    },
  ];

  conditionArr = [
    {
      condition_id: 1,
      condition: this.translate.instant("MAINTENANCEACCEPTMODAL.yes"),
    },
    {
      condition_id: 0,
      condition: this.translate.instant("MAINTENANCEACCEPTMODAL.no"),
    },
  ];

  // Variables
  notificationid = "";
  activity = "";
  stationid = "";
  stationname = "";
  machineid = "";
  machinename = "";
  breakdowncoding = "";
  notificationnumber = "";

  breakdownname = "";
  maintanencetypename = "";
  partdefectname = "";
  damagename = "";
  breakdowncausesname = "";
  activityname = "";

  statusid = "";

  materialrequiredid = "";
  materialrequiredvalue = "";

  reasonid = "";
  reason = "";

  optionSelected = "";
  conditionoptionSelected = "";

  reasonFlag = false;
  conditionFlag = false;
  damageFlag = false;
  saveDisable = false;

  damagetypeid = "";
  damagetypevalue = "";
  damagetypeidArr = [];
  damagetypevalueArr = [];

  cssenable = 0;
  damagecssenable = 0;

  public reasonOptions: any = {
    header: this.translate.instant("MAINTENANCEACCEPTMODAL.reason"),
    cssClass: "singleselect",
  };

  public damagetypeOptions: any = {
    header: this.translate.instant("MAINTENANCEACCEPTMODAL.damagetype"),
    cssClass: "multiselect",
  };

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private router: Router,
    private alertController: AlertController,
    public modalController: ModalController,
    public materialmodalController: ModalController,
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

    this.stationid = this.params.stationid;
    this.stationname = this.params.stationname;
    this.machineid = this.params.equipmentid;
    this.machinename = this.params.equipmentname;
    this.breakdowncoding = this.params.breakdowncoding;
    this.statusid = this.params.statusId;
    this.notificationid = this.params.id;
    this.screen = this.params.type;

    this.notificationacceptForm = this.fb.group({
      select_reason: new FormControl(""),
      select_damagetype: new FormControl(""),
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getNotificationReason();
  }

  getNotificationReason() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      desig_id: this.userlist.desigId,
      language: this.languageService.selected,
    };

    this.maintenanceservice.getReason(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.reasonArr = resultdata.data;

        this.getNotificationView();
      } else {
        this.reasonArr = [];

        this.getNotificationView();
      }
    });
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

        this.partdefectname = this.generalArr[0].partdefect;

        this.activityname = this.generalArr[0].activity;
      } else {
        this.generalArr = [];
      }
    });
  }

  reasonhandleChange(e) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.reasonid = JSON.parse(value).reason_id;
      this.reason = JSON.parse(value).reason_name;
    } else {
      this.reasonid = "";
      this.reason = "";
    }
  }

  onOptionChange(value) {
    this.optionSelected = value;

    if (
      (this.statusid == "2" || this.statusid == "4") &&
      this.screen == "ROUT"
    ) {
      if (this.optionSelected == "Yes") {
        this.cssenable = 1;
        this.conditionFlag = true;
      } else {
        this.cssenable = 0;
        this.conditionFlag = false;
        this.damageFlag = false;

        if (typeof this.damagetypeRef !== "undefined") {
          this.damagetypeRef.value = "";
        }

        this.damagetypeidArr = [];
        this.damagetypevalueArr = [];
        this.damagetypeid = "";
        this.damagetypevalue = "";
      }
    } else if (
      (this.statusid == "2" || this.statusid == "4") &&
      this.screen != "ROUT"
    ) {
      this.cssenable = 0;
      this.conditionFlag = false;
      this.damageFlag = false;

      this.damagetypeidArr = [];
      this.damagetypevalueArr = [];
      this.damagetypeid = "";
      this.damagetypevalue = "";
    } else if (this.statusid == "3" || this.statusid == "10") {
      if (this.optionSelected == "No") {
        this.cssenable = 1;
        this.reasonFlag = true;
      } else {
        this.cssenable = 0;
        this.reasonFlag = false;
      }
    } else {
      if (this.statusid == "2" || this.statusid == "4") {
        this.cssenable = 0;
        this.conditionFlag = false;
      } else if (this.statusid == "3" || this.statusid == "10") {
        this.cssenable = 0;
        this.reasonFlag = false;
      }
    }
  }

  onConditionOptionChange(value) {
    this.conditionoptionSelected = value;

    if (this.statusid == "2" || this.statusid == "4") {
      if (this.conditionoptionSelected == "Abnormal") {
        this.getDamage();
      } else {
        this.damageFlag = false;
      }
    } else {
      this.damageFlag = false;
    }
  }

  getDamage() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
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
        }

        this.damageArr = eachArr;

        this.damagecssenable = 1;

        this.damageFlag = true;
      } else {
        this.damageArr = [];

        this.damagecssenable = 0;

        this.damageFlag = false;
      }
    });
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

  remarksalert() {
    if (this.optionSelected == "") {
      if (this.statusid == "3" || this.statusid == "10") {
        this.commonservice.presentToast(
          this.translate.instant("MAINTENANCEACCEPTMODAL.jobselectionmandatory")
        );
        return;
      }

      if (this.statusid == "2" || this.statusid == "4") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEACCEPTMODAL.workorderselectionmandatory"
          )
        );
        return;
      }
    }

    if (
      this.optionSelected == "Yes" &&
      (this.statusid == "2" || this.statusid == "4") &&
      this.screen == "ROUT"
    ) {
      if (this.conditionoptionSelected == "") {
        this.commonservice.presentToast(
          this.translate.instant("MAINTENANCEACCEPTMODAL.conditionmandatory")
        );
        return;
      }
    }

    if (
      this.optionSelected == "Yes" &&
      this.conditionoptionSelected == "Abnormal"
    ) {
      if (this.damagetypeid.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant("MAINTENANCEACCEPTMODAL.damagetypemandatory")
        );
        return;
      }
    }

    //let alertmessage = "Please enter Reason for Breakdown and Balance Crop";
    let alertmessage = this.translate.instant(
      "MAINTENANCEACCEPTMODAL.enterremark"
    );

    this.alertController
      .create({
        header: "",
        message: alertmessage,
        cssClass: "alertmessage",
        backdropDismiss: false,
        inputs: [
          {
            name: "remarks",
            type: "textarea",
            cssClass: "alertinput",
            placeholder: this.translate.instant(
              "MAINTENANCEACCEPTMODAL.optional"
            ),
          },
        ],
        buttons: [
          {
            text: this.translate.instant("GENERALBUTTON.cancelbutton"),
            role: "cancel",
            handler: (cancel) => {
              //console.log("Confirm Cancel");
            },
          },
          {
            text: this.translate.instant("GENERALBUTTON.okay"),
            handler: (data: any) => {
              this.save(data.remarks);
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  save(getremarks) {
    console.log("Test");

    if (this.optionSelected == "") {
      if (this.statusid == "3" || this.statusid == "10") {
        this.commonservice.presentToast(
          this.translate.instant("MAINTENANCEACCEPTMODAL.jobselectionmandatory")
        );
        return;
      }

      if (this.statusid == "2" || this.statusid == "4") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEACCEPTMODAL.workorderselectionmandatory"
          )
        );
        return;
      }
    }

    if (
      this.optionSelected == "No" &&
      (this.statusid == "3" || this.statusid == "10")
    ) {
      if (this.reasonid == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEACCEPTMODAL.reasonselectionmandatory"
          )
        );
        return;
      }
    }

    if (
      this.optionSelected == "Yes" &&
      (this.statusid == "2" || this.statusid == "4") &&
      this.screen == "ROUT"
    ) {
      if (this.conditionoptionSelected == "") {
        this.commonservice.presentToast(
          this.translate.instant("MAINTENANCEACCEPTMODAL.conditionmandatory")
        );
        return;
      }
    }

    if (
      this.optionSelected == "Yes" &&
      this.conditionoptionSelected == "Abnormal"
    ) {
      if (this.damagetypeid.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant("MAINTENANCEACCEPTMODAL.damagetypemandatory")
        );
        return;
      }
    }

    this.saveDisable = true;

    var req;

    if (this.statusid == "3" || this.statusid == "10") {
      req = {
        userid: this.userlist.userId,
        millcode: this.userlist.millcode,
        dept_id: this.userlist.dept_id,
        design_id: this.userlist.desigId,
        id: this.notificationid,
        acceptmaterial: this.optionSelected,
        reason_id: this.reasonid,
        workordercompleted: "",
        condition: "",
        damagetype: "",
        remarks: getremarks,
        language: this.languageService.selected,
      };
    } else {
      req = {
        userid: this.userlist.userId,
        millcode: this.userlist.millcode,
        dept_id: this.userlist.dept_id,
        design_id: this.userlist.desigId,
        id: this.notificationid,
        acceptmaterial: "",
        reason_id: "",
        workordercompleted: this.optionSelected,
        condition: this.conditionoptionSelected,
        damagetype: this.damagetypeidArr.join(","),
        remarks: getremarks,
        language: this.languageService.selected,
      };
    }

    console.log("Accept:", req);

    this.maintenanceservice.saveFitterAcceptNotification(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        this.saveDisable = false;
        this.commonservice.presentToast(
          this.translate.instant("MAINTENANCEACCEPTMODAL.success")
        );
        // console.log("Screen:", this.screen);
        // if (this.screen == "REPL") {
        //   this.commonservice.presentToast(
        //     this.translate.instant("MAINTENANCEACCEPTMODAL.replacementsuccess")
        //   );
        // }

        // if (this.screen == "CM") {
        //   this.commonservice.presentToast(
        //     this.translate.instant("MAINTENANCEACCEPTMODAL.correctivesuccess")
        //   );
        // }
        // if (this.screen == "ROUT") {
        //   this.commonservice.presentToast(
        //     this.translate.instant("MAINTENANCEACCEPTMODAL.routinesuccess")
        //   );
        // }

        this.modalController.dismiss({
          dismissed: true,
          screen: this.screen,
        });
      } else {
        this.saveDisable = false;

        this.commonservice.presentToast(
          this.translate.instant("MAINTENANCEACCEPTMODAL.failed")
        );
        // if (this.screen == "REPL") {
        //   this.commonservice.presentToast(
        //     this.translate.instant("MAINTENANCEACCEPTMODAL.replacementfailed")
        //   );
        // }

        // if (this.screen == "CM") {
        //   this.commonservice.presentToast(
        //     this.translate.instant("MAINTENANCEACCEPTMODAL.correctivefailed")
        //   );
        // }
        // if (this.screen == "ROUT") {
        //   this.commonservice.presentToast(
        //     this.translate.instant("MAINTENANCEACCEPTMODAL.routinefailed")
        //   );
        // }
      }
    });
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      screen: "",
    });
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  parseString(item) {
    return JSON.stringify(item);
  }
}
