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
import { Plugins, KeyboardInfo } from "@capacitor/core";
const { Keyboard } = Plugins;
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

import { MaintenanceMaterialsearchPage } from "src/app/maintenance-module/maintenance-materialsearch/maintenance-materialsearch.page";
import { MaintenanceActivitysearchPage } from "src/app/maintenance-module/maintenance-activitysearch/maintenance-activitysearch.page";

@Component({
  selector: "app-maintenance-notification-modal",
  templateUrl: "./maintenance-notification-modal.page.html",
  styleUrls: ["./maintenance-notification-modal.page.scss"],
})
export class MaintenanceNotificationModalPage implements OnInit {
  @ViewChild("pageTop") pageTop: IonContent;
  @ViewChild("damagetypeSelect", { static: false }) damagetypeRef: IonSelect;
  @ViewChild("breakdowncausesSelect", { static: false })
  breakdowncausesRef: IonSelect;
  @ViewChild("assignedtoSelect", { static: false }) assignedtoRef: IonSelect;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  designationid = this.userlist.desigId;

  step1Form;

  params;

  title = this.translate.instant(
    "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.correctivemaintenance"
  );
  module = "";

  breakdownArr = [];
  maintenancetypeArr = [];
  breakdowncausesArr = [];
  damageArr = [];
  activityArr = [];
  assignedtoArr = [];
  addnewrowArr = [];

  // Flags
  stepFlag = true;
  step1completedFlag = false;
  step2completedFlag = false;
  step3completedFlag = false;
  step4completedFlag = false;
  step5completedFlag = false;
  step6completedFlag = false;
  otherFlag = false;

  viewFlag = false;

  breakdownFlag = false;
  activityFlag = false;
  otheractivityFlag = false;
  assignedtoFlag = false;

  addDisable = false;
  confirmDisable = false;

  // Variables
  getstationid = "";
  getstationname = "";

  getmachineid = "";
  getmachinename = "";

  notificationno = "";
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
  view_breakdown = "";
  view_maintenancetype = "";
  view_partdefect = "";
  view_breakdowncauses = "";
  view_damage_type = "";
  view_activity = "";
  view_assignto = "";

  ffbcageflag = "";

  // Ionic Select Header
  public breakdownOptions: any = {
    header: this.translate.instant(
      "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.problem"
    ),
    cssClass: "singleselect",
  };

  public maintenancetypeOptions: any = {
    header: this.translate.instant(
      "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.maintenancetype"
    ),
    cssClass: "multiselect",
  };

  public breakdowncausesOptions: any = {
    header: this.translate.instant(
      "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.breakdowncauses"
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
    this.ffbcageflag = this.params.ffbcageflag;
    this.title = this.params.stationname;
    this.module = navParams.get("module");

    this.getstationid = this.params.stationid;
    this.getmachineid = this.params.machineid;

    this.getstationname = this.params.stationname;
    this.getmachinename = this.params.machinename;

    this.step1Form = this.fb.group({
      select_breakdown: new FormControl("", Validators.required),
      select_maintenancetype: new FormControl("", Validators.required),
      txt_partname: new FormControl(""),
      //select_breakdowncauses: new FormControl("", Validators.required),
      select_damagetype: new FormControl("", Validators.required),
      txt_activityname: new FormControl("", Validators.required),
      select_assignedto: new FormControl("", Validators.required),
      ta_remarks: new FormControl(""),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getNotificationNumber();
  }

  getStatusColor(type) {
    let color;

    if (type == "STEP1") {
      if (!this.step1completedFlag) {
        color = "#CB4335";
      } else if (this.step1completedFlag) {
        color = "#008000";
      } else {
        color = "#CB4335";
      }
    } else if (type == "STEP2") {
      if (!this.step2completedFlag) {
        color = "#CB4335";
      } else if (this.step2completedFlag) {
        color = "#008000";
      } else {
        color = "#CB4335";
      }
    } else if (type == "STEP3") {
      if (!this.step3completedFlag) {
        color = "#CB4335";
      } else if (this.step3completedFlag) {
        color = "#008000";
      } else {
        color = "#CB4335";
      }
    } else {
      color = "#CB4335";
    }

    return color;
  }

  getNotificationNumber() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };
    this.maintenanceservice.getSequenceNumber(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.notificationno = resultdata.data[0].workorder;

        this.getBreakdown();
      } else {
        this.getBreakdown();
      }
    });
  }

  getBreakdown() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      type: 2,
      language: this.languageService.selected,
    };

    this.maintenanceservice.getBreakdownCodingList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.breakdownArr = resultdata.data;

        let eachArr = [];

        for (let i = 0; i < this.breakdownArr.length; i++) {
          let eachitem = this.breakdownArr[i];
          let eachreq = {
            id: eachitem.id,
            breakdownCoding: eachitem.breakdownCoding,
            selected: 0,
          };
          eachArr.push(eachreq);

          if (this.breakdownid != "") {
            if (eachitem.id == this.breakdownid) {
              eachArr[i]["selected"] = 1;
            }
          }
        }

        this.breakdownArr = eachArr;

        this.breakdownFlag = true;

        this.getMaintenancetype();
      } else {
        this.breakdownArr = [];

        this.breakdownFlag = false;

        this.getMaintenancetype();
      }
    });
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

        this.getAssignedTo();
      } else {
        this.damageArr = [];

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

  breakdownhandleChange(e) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.breakdownid = JSON.parse(value).id;
      this.breakdownvalue = JSON.parse(value).breakdownCoding;

      this.step1completedFlag = true;
      this.getStatusColor("STEP1");
    } else {
      this.breakdownid = "";
      this.breakdownvalue = "";

      this.step1completedFlag = false;
      this.getStatusColor("STEP1");
    }
  }

  maintenancetypehandleChange(e) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.maintenancetypeid = JSON.parse(value).id;
      this.maintenancetypevalue = JSON.parse(value).maintanence_type;

      this.step2completedFlag = true;
      this.getStatusColor("STEP2");
    } else {
      this.maintenancetypeid = "";
      this.maintenancetypevalue = "";

      this.step2completedFlag = false;
      this.getStatusColor("STEP2");
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

  openBreakdownCauses() {
    this.breakdowncausesRef.open();
  }

  openDamageType() {
    this.damagetypeRef.open();
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

      this.step3completedFlag = true;
      this.getStatusColor("STEP3");
    } else {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];
      this.assignedtoid = "";
      this.assignedtovalue = "";
      this.step3completedFlag = false;
      this.getStatusColor("STEP3");
    }
  }

  btn_back() {
    this.stepFlag = true;
    this.viewFlag = false;
  }

  btn_add(type) {
    if (type == "Part") {
      if (this.step1Form.value.txt_partname == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.partnamemandatory"
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

      if (this.partvalue.length > 0) {
        this.step3completedFlag = true;
        this.getStatusColor("STEP3");
      } else {
        if (this.partvalue.length <= 0) {
          this.step3completedFlag = false;
          this.getStatusColor("STEP3");
        }
      }
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
            this.partid = "";
            this.partvalue = "";
            this.partidArr = [];
            this.partvalueArr = [];

            if (modeldata.data.searchtext != "") {
              this.step1Form.controls.txt_partname.setValue("");

              this.step1Form.controls.txt_partname.setValue(
                modeldata.data.searchtext
              );
            }

            this.otherFlag = true;
          } else {
            this.partidArr = [];
            this.partvalueArr = [];

            this.otherFlag = false;

            this.step1Form.controls.txt_partname.setValue("");

            if (this.partid != "") {
              this.partidArr.push(this.partid);
            }

            if (this.partvalue != "") {
              this.partvalueArr.push(this.partvalue);
            }
          }
          this.partvalue = this.nl2br(this.partvalueArr.join("\n"));

          if (this.partvalue.length > 0) {
            this.step3completedFlag = true;
            this.getStatusColor("STEP3");
          } else {
            if (this.partvalue.length <= 0) {
              this.step3completedFlag = false;
              this.getStatusColor("STEP3");
            }
          }
        }
      });

      return await partmodal.present();
    } else if (type == "Activity") {
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

          /*console.log(
            this.activityid +
              "\n" +
              this.activityvalue +
              "\n" +
              this.machineresetvalue
          );*/

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
      });

      return await activitymodal.present();
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

        if (this.partvalue.length <= 0) {
          this.step3completedFlag = false;
          this.getStatusColor("STEP3");
        }
      }
    } else if (type == "Activity") {
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
          this.step2completedFlag = false;
          this.getStatusColor("STEP2");
        }
      }
    }
  }

  addNewRow() {
    let mismatchproblemflag = false;
    let mismatchmaintenancetypeflag = false;
    let partexistflag = false;

    if (this.breakdownid == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.problemmandatory"
        )
      );
      return;
    }

    if (this.maintenancetypeid == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.maintenancetypemandatory"
        )
      );
      return;
    }

    if (this.partid == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.partdefectmandatory"
        )
      );
      return;
    }

    if (this.addnewrowArr.length > 0) {
      for (let i = 0; i < this.addnewrowArr.length; i++) {
        //console.log(this.addnewrowArr[i].addpartid);

        if (this.partid == this.addnewrowArr[i].partid && this.partid != "0") {
          partexistflag = true;
        }

        if (
          this.partvalue.toLowerCase() ==
            this.addnewrowArr[i].part.toLowerCase() &&
          this.partid == "0"
        ) {
          partexistflag = true;
        }

        if (this.breakdownid != this.addnewrowArr[i].problemid) {
          mismatchproblemflag = true;
        }

        if (this.maintenancetypeid != this.addnewrowArr[i].maintenancetypeid) {
          mismatchmaintenancetypeflag = true;
        }
      }
    }

    if (mismatchproblemflag) {
      this.commonservice.presentToast("Please Select a Valid Problem");
      return;
    }

    if (mismatchmaintenancetypeflag) {
      this.commonservice.presentToast("Please Select a Valid Maintenance Type");
      return;
    }

    if (partexistflag) {
      this.commonservice.presentToast(
        this.partvalue +
          this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.alreadyexist")
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

    if (this.activityidArr.length <= 0) {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitymandatory"
        )
      );
      return;
    }

    this.addDisable = true;

    let eachreq = {
      problemid: this.breakdownid,
      problem: this.breakdownvalue,
      maintenancetypeid: this.maintenancetypeid,
      maintenancetype: this.maintenancetypevalue,
      partid: Number(this.partid),
      part: this.partvalue,
      damagetypeid: this.damagetypeid,
      damagetype: this.damagetypevalue,
      activityid: this.activityid,
      activity: this.activityvalue,
      machineresetflag: this.machineresetvalue,
    };

    this.addnewrowArr.push(eachreq);

    //console.log(this.addnewrowArr);

    if (this.addnewrowArr.length > 0) {
      this.reset_data();
    }
  }

  deleteRow(index: number) {
    this.addnewrowArr.splice(index, 1);
  }

  reset_data() {
    // Parts
    this.partidArr = [];
    this.partvalueArr = [];
    this.partid = "";
    this.partvalue = "";

    // Damage Type
    this.damagetypeidArr = [];
    this.damagetypevalueArr = [];
    this.damagetypeid = "";
    this.damagetypevalue = "";
    this.step1Form.controls.select_damagetype.setValue("");

    // Activity
    this.activityidArr = [];
    this.activityvalueArr = [];
    this.activityid = "";
    this.activityvalue = "";
    this.machineresetflag = 0;
    this.machineresetvalue = "";
    this.machineresetflagArr = [];

    this.addDisable = false;
  }

  async showalert() {
    if (this.assignedtoidArr.length <= 0) {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignedtoselection"
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
        "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.alertmessage"
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
    this.confirmDisable = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      id: 0,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      breakdown_coding: this.breakdownid,
      maintanence_type: this.maintenancetypeid,
      partsarray: JSON.stringify(this.addnewrowArr),
      assignedto: this.assignedtoidArr.join(","),
      pvflag: 2,
      completedflag: 1,
      remarks: this.step1Form.value.ta_remarks,
      ffbcagestatus: this.ffbcageflag,
      language: this.languageService.selected,
    };

    console.log(req);

    this.maintenanceservice
      .saveMultiplePartMaintenanceNotification(req)
      .then((result) => {
        var resultdata: any;
        resultdata = result;
        if (resultdata.httpcode == 200) {
          this.confirmDisable = false;

          this.commonservice.presentToast(
            this.translate.instant(
              "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.success"
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
              "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.failed"
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

  scrollbottom() {
    Keyboard.addListener("keyboardWillShow", (info: KeyboardInfo) => {
      setTimeout(() => {
        this.pageTop.scrollToPoint(
          0,
          document.getElementById("ta_remarks").offsetTop,
          10
        );
      }, 200);
    });

    Keyboard.addListener("keyboardDidShow", (info: KeyboardInfo) => {
      setTimeout(() => {
        this.pageTop.scrollToPoint(
          0,
          document.getElementById("ta_remarks").offsetTop,
          10
        );
      }, 200);
    });
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  parseString(item) {
    return JSON.stringify(item);
  }
}
