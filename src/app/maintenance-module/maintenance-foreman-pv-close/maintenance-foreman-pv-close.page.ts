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
import { MaintenanceActivitysearchPage } from "src/app/maintenance-module/maintenance-activitysearch/maintenance-activitysearch.page";

@Component({
  selector: "app-maintenance-foreman-pv-close",
  templateUrl: "./maintenance-foreman-pv-close.page.html",
  styleUrls: ["./maintenance-foreman-pv-close.page.scss"],
})
export class MaintenanceForemanPvClosePage implements OnInit {
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
  stepFlag = false;
  step1completedFlag = false;
  step2completedFlag = false;
  step3completedFlag = false;
  step4completedFlag = false;

  goodFlag = false;
  abnormalFlag = false;
  otheractivityFlag = false;
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
  conditionoptionSelected = "";

  breakdownid = "";
  breakdownvalue = "";

  maintenancetypeid = "";
  maintenancetypevalue = "";

  partid = "";
  partvalue = "";
  partidArr = [];
  partvalueArr = [];

  breakdowncausesid = "";
  breakdowncausesvalue = "";
  breakdowncausesidArr = [];
  breakdowncausesvalueArr = [];

  activityid = "";
  activityvalue = "";
  activityidArr = [];
  activityvalueArr = [];

  damagetypeid = "";
  damagetypevalue = "";
  damagetypeidArr = [];
  damagetypevalueArr = [];

  // View the details
  view_breakdown = "";
  view_maintenancetype = "";
  view_partdefect = "";
  view_breakdowncauses = "";
  view_activity = "";
  view_damage_type = "";

  // Notification View
  generalArr = [];

  // Flag
  otherFlag = false;
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

    //console.log(this.module);

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
      select_maintenancetype: new FormControl(""),
      txt_partname: new FormControl(""),
      select_breakdowncauses: new FormControl(""),
      txt_activityname: new FormControl(""),
      select_damagetype: new FormControl(""),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getNotificationView();
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

  onConditionOptionChange(value) {
    this.conditionoptionSelected = value;

    if (this.conditionoptionSelected == "Abnormal") {
      this.goodFlag = false;
      this.abnormalFlag = true;

      this.getMaintenancetype();
    } else {
      this.goodFlag = true;
      this.abnormalFlag = false;
    }
  }

  getMaintenancetype() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };
    this.maintenanceservice.getMaintenanceTypeList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.maintenancetypeArr = resultdata.data;

        let eachArr = [];

        for (let i = 0; i < this.maintenancetypeArr.length; i++) {
          let eachitem = this.maintenancetypeArr[i];
          let eachreq = {
            id: eachitem.id,
            maintanence_type: eachitem.maintanence_type,
            selected: 0,
          };
          eachArr.push(eachreq);

          if (this.maintenancetypeid != "") {
            if (eachitem.id == this.maintenancetypeid) {
              eachArr[i]["selected"] = 1;
            }
          }
        }

        this.maintenancetypeArr = eachArr;

        this.getBreakDownCauses();
      } else {
        this.maintenancetypeArr = [];

        this.getBreakDownCauses();
      }
    });
  }

  getBreakDownCauses() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };
    this.maintenanceservice.getBreakDownCausesList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.breakdowncausesArr = resultdata.data;

        let eachArr = [];

        for (let i = 0; i < this.breakdowncausesArr.length; i++) {
          let eachitem = this.breakdowncausesArr[i];
          let eachreq = {
            cause_id: eachitem.cause_id,
            BreakdownCause: eachitem.BreakdownCause,
            selected: 0,
          };
          eachArr.push(eachreq);

          if (this.breakdowncausesid != "") {
            if (eachitem.cause_id == this.breakdowncausesid) {
              eachArr[i]["selected"] = 1;
            }
          }
        }

        this.breakdowncausesArr = eachArr;

        this.getDamage();
      } else {
        this.breakdowncausesArr = [];

        this.getDamage();
      }
    });
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
      } else {
        this.damageArr = [];
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

        if (this.module == "RePM") {
          this.getMaintenancetype();
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

        if (this.module == "RePM") {
          this.getMaintenancetype();
        }
      }
    });
  }

  maintenancetypehandleChange(e) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.maintenancetypeid = JSON.parse(value).id;
      this.maintenancetypevalue = JSON.parse(value).maintanence_type;
    } else {
      this.maintenancetypeid = "";
      this.maintenancetypevalue = "";
    }
  }

  breakdowncauseshandleChange(e) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.breakdowncausesidArr = [];
      this.breakdowncausesvalueArr = [];
      for (let i = 0; i < value.length; i++) {
        this.breakdowncausesidArr.push(JSON.parse(value[i]).cause_id);
        this.breakdowncausesvalueArr.push(JSON.parse(value[i]).BreakdownCause);
      }

      this.breakdowncausesid = this.breakdowncausesidArr.join(",");
      this.breakdowncausesvalue = this.nl2br(
        this.breakdowncausesvalueArr.join(", ")
      );
    } else {
      this.breakdowncausesidArr = [];
      this.breakdowncausesvalueArr = [];
      this.breakdowncausesid = "";
      this.breakdowncausesvalue = "";
    }
  }

  openBreakdownCauses() {
    this.breakdowncausesRef.open();
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

  btn_add(type) {
    if (type == "Part") {
      if (this.step1Form.value.txt_partname == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEACKNOWLEDGEMODAL.partnamemandatory"
          )
        );
        return;
      }

      this.partid = "0";

      this.partidArr.push(this.partid);

      this.partvalueArr.push(this.step1Form.value.txt_partname);

      this.partvalue = this.nl2br(this.partvalueArr.join("\n"));

      this.otherFlag = false;

      this.step1Form.controls.txt_partname.setValue("");
    } else if (type == "Activity") {
      if (this.step1Form.value.txt_activityname == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitynamemandatory"
          )
        );
        return;
      }

      this.activityid = "0";

      this.activityidArr.push(this.activityid);

      this.activityvalueArr.push(this.step1Form.value.txt_activityname);

      this.activityvalue = this.nl2br(this.activityvalueArr.join(", "));

      this.otheractivityFlag = false;

      this.step1Form.controls.txt_activityname.setValue("");
    }
  }

  clear(type) {
    if (type == "Part") {
      this.partidArr.splice(-1);
      this.partvalueArr.splice(-1);

      if (this.partvalueArr.length > 0) {
        this.partvalue = this.nl2br(this.partvalueArr.join("\n"));
      } else {
        this.partid = "";
        this.partvalue = "";
        this.partidArr = [];
        this.partvalueArr = [];
        if (this.otherFlag) {
          this.otherFlag = false;
          this.step1Form.controls.txt_partname.setValue("");
        }
      }
    } else if (type == "Activity") {
      this.activityidArr.splice(-1);
      this.activityvalueArr.splice(-1);

      if (this.activityvalueArr.length > 0) {
        this.activityvalue = this.nl2br(this.activityvalueArr.join("\n"));
      } else {
        this.activityid = "";
        this.activityvalue = "";
        this.activityidArr = [];
        this.activityvalueArr = [];
      }
    }
  }

  btn_next(type) {
    if (type == "STEP1") {
      if (this.step1Form.value.select_maintenancetype == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.maintenancetypemandatory"
          )
        );
        return;
      }

      if (this.damagetypeidArr.length <= 0) {
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

  view() {
    this.view_maintenancetype = JSON.parse(
      this.step1Form.value.select_maintenancetype
    ).maintanence_type;
    this.view_damage_type = this.damagetypevalueArr.join(", ");

    //this.stepFlag = false;

    //this.pageTop.scrollToTop();

    this.showAuthorize();
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

    if (this.conditionoptionSelected == "" && this.module == "RoPM") {
      this.commonservice.presentToast(
        this.translate.instant("MAINTENANCEACCEPTMODAL.conditionmandatory")
      );
      return;
    }

    this.authorizecorrectivemaintenance();
  }

  authorizecorrectivemaintenance() {
    if (this.module == "RoPM") {
      /*let activityid = [];
      let activityname = [];

      for (let i = 0; i < this.activityidArr.length; i++) {
        if (this.activityidArr[i] == 0) {
          activityname.push(this.activityvalueArr[i]);
        } else {
          activityid.push(this.activityidArr[i]);
        }
      }*/

      this.confirmDisable = true;

      let req;
      if (this.abnormalFlag) {
        req = {
          user_id: this.userlist.userId,
          millcode: this.userlist.millcode,
          dept_id: this.userlist.dept_id,
          design_id: this.userlist.desigId,
          stationid: this.getstationid,
          equipment: this.getmachineid,
          maintanence_type: this.maintenancetypeid,
          part_defect: this.getpartdefectid,
          other_part_name: "",
          damage: this.damagetypeidArr.join(","),
          breakdown_cause: "",
          activity: "",
          other_activity_name: "",
          condition: this.conditionoptionSelected,
          cmflag: 0,
          id: this.getnotificationid,
        };
      } else {
        req = {
          user_id: this.userlist.userId,
          millcode: this.userlist.millcode,
          dept_id: this.userlist.dept_id,
          design_id: this.userlist.desigId,
          stationid: this.getstationid,
          equipment: this.getmachineid,
          maintanence_type: "",
          part_defect: this.getpartdefectid,
          other_part_name: "",
          damage: "",
          breakdown_cause: "",
          activity: "",
          other_activity_name: "",
          condition: this.conditionoptionSelected,
          cmflag: 0,
          id: this.getnotificationid,
        };
      }

      console.log(req);

      this.maintenanceservice
        .formanCorrectiveMaintenanceVerify(req)
        .then((result) => {
          var resultdata: any;
          resultdata = result;
          if (resultdata.httpcode == 200) {
            this.confirmDisable = false;

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
            this.confirmDisable = false;

            this.commonservice.presentToast(
              this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.closedfailed")
            );
          }
        });
    }
  }

  async callmodalcontroller(type) {
    if (type == "PartDefect") {
      const partmodal = await this.partmodalController.create({
        component: MaintenanceMaterialsearchPage,
        componentProps: {
          type: "0",
          station_id: this.getstationid,
          equipment_id: this.getmachineid,
          title: this.translate.instant(
            "MAINTENANCEACKNOWLEDGEMODAL.searchpartname"
          ),
        },
      });

      partmodal.onDidDismiss().then((modeldata) => {
        let viewform = modeldata.data.data;

        if (viewform != "") {
          this.params = JSON.parse(viewform);

          this.partid = this.params.item_id;
          this.partvalue = this.params.item_name;

          if (this.partid == "0") {
            this.otherFlag = true;
          } else {
            let part_validate = false;

            this.otherFlag = false;

            this.step1Form.controls.txt_partname.setValue("");

            if (this.partidArr.length > 0) {
              for (let i = 0; i < this.partidArr.length; i++) {
                if (this.partidArr[i] == this.partid) {
                  part_validate = true;
                }
              }
            }

            if (!part_validate) {
              if (this.partid != "") {
                this.partidArr.push(this.partid);
              }

              if (this.partvalue != "") {
                this.partvalueArr.push(this.partvalue);
              }
            } else {
              this.commonservice.presentToast(
                this.partvalue +
                  this.translate.instant(
                    "MAINTENANCEACKNOWLEDGEMODAL.alreadyexist"
                  )
              );
            }
          }
          this.partvalue = this.nl2br(this.partvalueArr.join("\n"));

          if (this.partvalue.length > 0) {
            this.step2completedFlag = true;
            this.getStatusColor("STEP2");
          } else {
            if (this.partvalue.length <= 0) {
              this.step2completedFlag = false;
              this.getStatusColor("STEP2");
            }
          }
        }
      });

      return await partmodal.present();
    }

    if (type == "Activity") {
      const activitymodal = await this.activitymodalController.create({
        component: MaintenanceActivitysearchPage,
        componentProps: {
          type: "0",
          station_id: this.getstationid,
          equipment_id: this.getmachineid,
        },
      });

      activitymodal.onDidDismiss().then((modeldata) => {
        let viewform = modeldata.data.data;

        if (viewform != "") {
          this.params = JSON.parse(viewform);

          this.activityid = this.params.activity_id;
          this.activityvalue = this.params.activity_name;

          if (this.activityid == "0") {
            if (modeldata.data.searchtext != "") {
              this.step1Form.controls.txt_activityname.setValue(
                modeldata.data.searchtext
              );
            }

            this.otheractivityFlag = true;
          } else {
            let activity_validate = false;
            this.otheractivityFlag = false;

            this.step1Form.controls.txt_activityname.setValue("");

            if (this.activityidArr.length > 0) {
              for (let i = 0; i < this.activityidArr.length; i++) {
                if (this.activityidArr[i] == this.activityid) {
                  activity_validate = true;
                }
              }
            }

            if (!activity_validate) {
              if (this.activityid != "") {
                this.activityidArr.push(this.activityid);
              }

              if (this.activityvalue != "") {
                this.activityvalueArr.push(this.activityvalue);
              }
            } else {
              this.commonservice.presentToast(
                this.activityvalue +
                  this.translate.instant(
                    "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.alreadyexist"
                  )
              );
            }
          }
          this.activityvalue = this.nl2br(this.activityvalueArr.join(", "));
        }
      });

      return await activitymodal.present();
    }
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
