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
  selector: "app-maintenance-notification-update-modal",
  templateUrl: "./maintenance-notification-update-modal.page.html",
  styleUrls: ["./maintenance-notification-update-modal.page.scss"],
})
export class MaintenanceNotificationUpdateModalPage implements OnInit {
  @ViewChild("pageTop") pageTop: IonContent;
  @ViewChild("damagetypeSelect", { static: false }) damagetypeRef: IonSelect;
  //@ViewChild("breakdowncausesSelect", { static: false }) breakdowncausesRef: IonSelect;
  @ViewChild("assignedtoSelect", { static: false }) assignedtoRef: IonSelect;

  userlist = JSON.parse(localStorage.getItem("userlist"));

  step1Form;

  params;

  title = this.translate.instant(
    "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.correctivemaintenance"
  );
  module = "";

  damageArr = [];
  activityArr = [];
  assignedtoArr = [];

  // Flags
  stepFlag = true;
  step1completedFlag = false;
  step2completedFlag = false;

  viewFlag = false;

  damagetypeFlag = false;
  activityFlag = false;
  otheractivityFlag = false;
  assignedtoFlag = false;

  confirmDisable = false;

  // Variables
  getnotificationid = "";
  getstationid = "";
  getstationname = "";

  getmachineid = "";
  getmachinename = "";

  getbreakdownid = "";
  getbreakdownvalue = "";

  getmaintenancetypeid = "";
  getmaintenancetypevalue = "";

  getactivityid = "";
  getactivityvalue = "";

  notificationno = "";
  breakdownid = "";
  breakdownvalue = "";

  maintenancetypeid = "";
  maintenancetypevalue = "";

  getpartdefectid = "";
  getpartdefectvalue = "";

  getbreakdowncausesid = "";
  getbreakdowncausesvalue = "";

  getbreakdownremarksvalue = "";

  damagetypeid = "";
  damagetypevalue = "";
  damagetypeidArr = [];
  damagetypevalueArr = [];

  activityid = "";
  activityvalue = "";
  machineresetvalue = "";
  machineresetflag = 0;
  activityvalidationflag = false;

  activityidArr = [];
  activityvalueArr = [];
  machineresetflagArr = [];

  assignedtoid = "";
  assignedtovalue = "";
  assignedtoidArr = [];
  assignedtovalueArr = [];

  // View the details
  view_activity = "";
  view_assignto = "";
  view_damage_type = "";

  // Ionic Select Header
  public maintenancetypeOptions: any = {
    header: this.translate.instant(
      "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.maintenancetype"
    ),
    cssClass: "multiselect",
  };

  public damagetypeOptions: any = {
    header: this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.damagetype"),
    cssClass: "multiselect",
  };

  /*public assignedtoOptions: any = {
    header:
      this.userlist.desigId == 4
        ? this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.fitterlist"
          )
        : this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.wiremanlist"
          ),
    cssClass: "multiselect",
  };*/

  public assignedtoOptions: any = {
    header: this.translate.instant(
      "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignto"
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

    this.title = this.params.stationname;
    this.module = navParams.get("module");

    //console.log(this.params);

    this.getstationid = this.params.stationid;
    this.getmachineid = this.params.machineid;

    this.getstationname = this.params.stationname;
    this.getmachinename = this.params.machinename;

    this.getnotificationid = this.params.id;
    this.getstationid = this.params.stationid;
    this.getmachineid = this.params.machineid;

    this.getbreakdownid = this.params.breakdowncodingid;
    this.getbreakdownvalue = this.params.breakdowncoding;

    this.getmaintenancetypeid = this.params.maintenancetypeid;
    this.getmaintenancetypevalue = this.params.maintenancetype;

    this.getpartdefectid = this.params.partdefectid;
    this.getpartdefectvalue = this.params.partdefect;

    this.getbreakdowncausesid = this.params.breakdowncausesid;
    this.getbreakdowncausesvalue = this.params.breakdowncauses;

    this.getbreakdownremarksvalue = this.params.breakdownremarks;

    this.step1Form = this.fb.group({
      select_breakdown: new FormControl(""),
      select_maintenancetype: new FormControl(""),
      select_damagetype: new FormControl(""),
      txt_activityname: new FormControl(""),
      select_assignedto: new FormControl("", Validators.required),
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

        this.damagetypeFlag = true;

        this.getAssignedTo();
      } else {
        this.damageArr = [];

        this.damagetypeFlag = true;

        this.getAssignedTo();
      }
    });
  }

  getAssignedTo() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      desig_id: this.userlist.desigId,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.maintenanceservice.getAssignedToList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.assignedtoArr = resultdata.data;

        let eachArr = [];

        for (let i = 0; i < this.assignedtoArr.length; i++) {
          let eachitem = this.assignedtoArr[i];
          let eachreq = {
            userId: eachitem.userId,
            name: eachitem.name,
            selected: 0,
          };
          eachArr.push(eachreq);

          if (this.assignedtoid != "") {
            if (eachitem.userId == this.assignedtoid) {
              eachArr[i]["selected"] = 1;
            }
          }
        }

        this.assignedtoArr = eachArr;

        this.activityFlag = true;

        this.assignedtoFlag = true;
      } else {
        this.assignedtoArr = [];

        this.activityFlag = true;

        this.assignedtoFlag = false;
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

  openAssignedTo() {
    this.assignedtoRef.open();
  }

  assignedtohandleChange(e) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];
      for (let i = 0; i < value.length; i++) {
        this.assignedtoidArr.push(JSON.parse(value[i]).userId);
        this.assignedtovalueArr.push(JSON.parse(value[i]).name);
      }

      this.assignedtoid = this.assignedtoidArr.join(",");
      this.assignedtovalue = this.nl2br(this.assignedtovalueArr.join(", "));

      this.step2completedFlag = true;
      this.getStatusColor("STEP2");
    } else {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];
      this.assignedtoid = "";
      this.assignedtovalue = "";

      this.step2completedFlag = false;
      this.getStatusColor("STEP2");
    }
  }

  btn_next(type) {
    if (type == "STEP1") {
      if (this.damagetypeidArr.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEACKNOWLEDGEMODAL.damagetypeselection"
          )
        );
        return;
      }

      if (this.getactivityid == "" || this.getactivityid == "0") {
        if (this.activityidArr.length <= 0) {
          this.commonservice.presentToast(
            this.translate.instant(
              "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitymandatory"
            )
          );
          return;
        }
      } else {
        this.activityidArr.push(this.getactivityid);
      }

      if (this.assignedtoArr.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignedtoselection"
          )
        );
        return;
      }

      this.view();
    }
  }

  btn_back() {
    this.stepFlag = true;
    this.viewFlag = false;
  }

  btn_add(type) {
    if (type == "Activity") {
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

      if (this.activityvalue.length > 0) {
        this.step2completedFlag = true;
        this.getStatusColor("STEP2");
      } else {
        if (this.activityvalue.length <= 0) {
          this.step2completedFlag = false;
          this.getStatusColor("STEP2");
        }
      }
    }
  }

  async callmodalcontroller(type) {
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

          console.log(this.params);

          if (this.params.machine_reset_flag == 1) {
            if (this.machineresetflagArr.length == 0) {
              this.activityvalidationflag = false;
            } else {
              if (this.machineresetflagArr.length > 0) {
                if (this.machineresetflagArr.includes(1)) {
                  this.activityvalidationflag = true;
                } else if (this.machineresetflagArr.includes(0)) {
                  this.activityvalidationflag = true;
                } else if (this.machineresetflagArr.includes(2)) {
                  this.activityvalidationflag = true;
                }
              }
            }
          } else {
            if (this.machineresetflagArr.length == 0) {
              this.activityvalidationflag = false;
            } else {
              if (this.machineresetflagArr.length > 0) {
                //console.log(this.machineresetflagArr.includes(1));

                if (this.machineresetflagArr.includes(1)) {
                  this.activityvalidationflag = true;
                } else {
                  this.activityvalidationflag = false;
                }
              }
            }
          }

          if (this.activityvalidationflag) {
            this.commonservice.presentToast(
              this.params.activity_name +
                this.translate.instant(
                  "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitynotallowed"
                )
            );
            return;
          }

          this.activityid = this.params.activity_id;
          this.activityvalue = this.params.activity_name;
          this.machineresetflag = this.params.machine_reset_flag;

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

              this.machineresetflagArr.push(this.machineresetflag);
            } else {
              this.commonservice.presentToast(
                this.activityvalue +
                  this.translate.instant(
                    "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.alreadyexist"
                  )
              );
            }
          }

          this.activityid = this.activityidArr.join(",");
          this.activityvalue = this.nl2br(this.activityvalueArr.join(", "));
          this.machineresetvalue = this.machineresetflagArr.join(",");

          if (this.activityvalue.length > 0) {
            this.step1completedFlag = true;
            this.getStatusColor("STEP1");
          } else {
            if (this.activityvalue.length <= 0) {
              this.step1completedFlag = false;
              this.getStatusColor("STEP1");
            }
          }
        }
      });

      return await activitymodal.present();
    }
  }

  clear(type) {
    if ("Activity") {
      this.activityidArr.splice(-1);
      this.activityvalueArr.splice(-1);
      this.machineresetflagArr.splice(-1);

      if (this.activityvalueArr.length > 0) {
        this.activityvalue = this.nl2br(this.activityvalueArr.join("\n"));
      } else {
        this.activityid = "";
        this.activityvalue = "";
        this.activityidArr = [];
        this.activityvalueArr = [];

        if (this.activityvalue.length <= 0) {
          this.step1completedFlag = false;
          this.getStatusColor("STEP1");
        }
      }
    }
  }

  view() {
    this.view_damage_type = this.damagetypevalueArr.join(", ");

    if (this.getactivityid == "" || this.getactivityid == "0") {
      this.view_activity = this.activityvalueArr.join(", ");
    } else {
      this.view_activity = this.getactivityvalue;
    }

    this.view_assignto = this.assignedtovalueArr.join(", ");

    /*this.stepFlag = false;

    this.viewFlag = true;

    this.pageTop.scrollToTop();*/

    this.showalert();
  }

  async showalert() {
    if (this.view_damage_type == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEACKNOWLEDGEMODAL.damagetypeselection"
        )
      );
      return;
    }

    if (this.view_activity == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitysmandatory"
        )
      );
      return;
    }

    if (this.view_assignto == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assigntomandatory"
        )
      );
      return;
    }

    /*const alert = await this.alertController.create({
      header: this.translate.instant(
        "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.header"
      ),
      cssClass: "alertmessage",
      message: this.translate.instant(
        "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assigncorrective"
      ),
      buttons: [
        {
          text: this.translate.instant("GENERALBUTTON.cancelbutton"),
          role: "cancel",
          cssClass: "secondary",
          handler: (cancel) => {},
        },
        {
          text: this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.sure"
          ),
          handler: () => {
            this.save();
          },
        },
      ],
    });

    await alert.present();*/

    this.save();
  }

  save() {
    let activityid = [];
    let activityname = [];

    if (this.getactivityid == "" || this.getactivityid == "0") {
      for (let i = 0; i < this.activityidArr.length; i++) {
        if (this.activityidArr[i] == 0) {
          activityname.push(this.activityvalueArr[i]);
        } else {
          activityid.push(this.activityidArr[i]);
        }
      }
    } else {
      activityid = this.activityidArr;
    }

    let partsstatus = [];

    let eachreq = {
      partid: this.getpartdefectid,
      part: this.getpartdefectvalue,
      damagetypeid: this.damagetypeid,
      damagetype: this.damagetypevalue,
      activityid: this.activityid,
      activity: this.activityvalue,
      machineresetflag: this.machineresetvalue,
    };

    partsstatus.push(eachreq);

    this.confirmDisable = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      id: this.getnotificationid,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      partsarray: JSON.stringify(partsstatus),
      assignedto: this.assignedtoidArr.join(","),
      pvflag: 2,
      completedflag: 1,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.maintenanceservice
      .saveMultiplePartMaintenanceNotification(req)
      .then((result) => {
        var resultdata: any;
        resultdata = result;
        if (resultdata.httpcode == 200) {
          this.confirmDisable = false;

          this.commonservice.presentToast(
            this.translate.instant(
              "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignsuccess"
            )
          );

          this.modalController.dismiss({
            dismissed: true,
            item: "Submitted",
          });
        } else {
          this.confirmDisable = false;

          this.commonservice.presentToast(
            this.translate.instant(
              "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignfailed"
            )
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
