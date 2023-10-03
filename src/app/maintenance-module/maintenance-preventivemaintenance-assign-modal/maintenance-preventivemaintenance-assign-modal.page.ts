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
import * as moment from "moment";

// Custom Date Picker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { Plugins } from "@capacitor/core";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

// Modal
import { MaintenanceActivitysearchPage } from "src/app/maintenance-module/maintenance-activitysearch/maintenance-activitysearch.page";

@Component({
  selector: "app-maintenance-preventivemaintenance-assign-modal",
  templateUrl: "./maintenance-preventivemaintenance-assign-modal.page.html",
  styleUrls: ["./maintenance-preventivemaintenance-assign-modal.page.scss"],
})
export class MaintenancePreventivemaintenanceAssignModalPage implements OnInit {
  @ViewChild("damagetypeSelect", { static: false }) damagetypeRef: IonSelect;
  @ViewChild("assignedtoSelect", { static: false }) assignedtoRef: IonSelect;

  userlist = JSON.parse(localStorage.getItem("userlist"));

  assignForm;

  params;

  maintenancetypeArr = [];
  damageArr = [];
  activityArr = [];
  assignedtoArr = [];

  // Variables
  title = "";
  module = "";
  extendrunninghoursFlag = "";
  machinereplacementFlag = "";

  getnotificationid = "";
  getstationid = "";
  getstationname = "";
  getmachineid = "";
  getmachinename = "";
  getactivityname = "";
  getstatusid = "";
  partdefectname = "";
  partdefectid = "";
  lifetimerunninghours = "";
  currentrunninghours = "";

  conditionoptionSelected = "";
  conditionactivitySelected = "";

  maintenancetypeid = "";
  maintenancetypevalue = "";

  activityid = "";
  activityvalue = "";
  activityidArr = [];
  activityvalueArr = [];

  damagetypeid = "";
  damagetypevalue = "";
  damagetypeidArr = [];
  damagetypevalueArr = [];

  assignedtoid = "";
  assignedtovalue = "";
  assignedtoidArr = [];
  assignedtovalueArr = [];

  // View the details
  view_station = "";
  view_machine = "";
  view_partdefect = "";
  view_assignto = "";

  viewFlag = false;
  goodFlag = false;
  abnormalFlag = false;
  servicedFlag = false;
  replacedFlag = false;
  otheractivityFlag = false;
  confirmDisable = false;

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
    this.extendrunninghoursFlag = navParams.get("flag");
    this.machinereplacementFlag = this.params.machinereplacement;

    console.log(this.params);

    this.getnotificationid = this.params.id;
    this.getstationid = this.params.stationid;
    this.getstationname = this.params.stationname;
    this.getmachineid = this.params.equipmentid;
    this.getmachinename = this.params.equipmentname;
    this.getactivityname = this.params.replacement_activityname;
    this.getstatusid = this.params.statusId;
    this.partdefectname = this.params.partdefect;
    this.partdefectid = this.params.partdefectid;

    //console.log("param:", this.params);

    this.assignForm = this.fb.group({
      select_maintenancetype: new FormControl(""),
      select_damagetype: new FormControl(""),
      txt_activityname: new FormControl(""),
      select_assignedto: new FormControl(""),
      txt_extendlifetimehours: new FormControl(""),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getAssignedTo();
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
      } else {
        this.assignedtoArr = [];
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
    } else {
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];
      this.assignedtoid = "";
      this.assignedtovalue = "";
    }
  }

  onConditionOptionChange(value) {
    this.conditionoptionSelected = value;

    if (this.conditionoptionSelected == "Abnormal") {
      //this.resetdata();

      this.goodFlag = false;
      this.abnormalFlag = true;

      this.getMaintenancetype();
    } else {
      //this.resetdata();

      this.goodFlag = true;
      this.abnormalFlag = false;
    }
  }

  onConditionActivityChange(value) {
    this.conditionactivitySelected = value;

    if (this.conditionactivitySelected == "Replaced") {
      this.resetdata();

      this.servicedFlag = false;
      this.replacedFlag = true;
    } else {
      this.resetdata();

      this.servicedFlag = true;
      this.replacedFlag = false;

      if (this.extendrunninghoursFlag == "1") {
        this.getDetails();
      }
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

        this.getDamage();
      } else {
        this.maintenancetypeArr = [];

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

  getDetails() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      desig_id: this.userlist.desigId,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      part_id: this.partdefectid,
      language: this.languageService.selected,
    };

    this.maintenanceservice.getPartsDetails(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.lifetimerunninghours = resultdata.lifetimehours;
        this.currentrunninghours = resultdata.machinerunninghours;
      } else {
        this.lifetimerunninghours = "0";
        this.currentrunninghours = "0";
      }
    });
  }

  btn_add(type) {
    if (type == "Activity") {
      if (this.assignForm.value.txt_activityname == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.activitynamemandatory"
          )
        );
        return;
      }

      this.activityid = "0";

      this.activityidArr.push(this.activityid);

      this.activityvalueArr.push(this.assignForm.value.txt_activityname);

      this.activityvalue = this.nl2br(this.activityvalueArr.join(", "));

      this.otheractivityFlag = false;

      this.assignForm.controls.txt_activityname.setValue("");
    }
  }

  clear(type) {
    if (type == "Activity") {
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

  btn_next() {
    if (this.module == "RoPM") {
      if (this.assignedtoidArr.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant(
            "PREVENTIVEMAINTENANCEASSIGN.assigntomandatory"
          )
        );
        return;
      }

      if (this.conditionoptionSelected == "") {
        this.commonservice.presentToast(
          this.translate.instant("MAINTENANCEACCEPTMODAL.conditionmandatory")
        );
        return;
      }

      if (this.conditionoptionSelected == "Good") {
        this.showalert();
      } else {
        if (this.maintenancetypeid == "") {
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

        this.showalert();
      }
    } else {
      if (this.assignedtoidArr.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant(
            "PREVENTIVEMAINTENANCEASSIGN.assigntomandatory"
          )
        );
        return;
      }

      if (this.conditionactivitySelected == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "PREVENTIVEMAINTENANCEASSIGN.activitymandatory"
          )
        );
        return;
      }

      if (this.conditionactivitySelected == "Replaced") {
        this.showalert();
      } else {
        if (
          (this.assignForm.value.txt_extendlifetimehours == 0 ||
            this.assignForm.value.txt_extendlifetimehours == "") &&
          this.extendrunninghoursFlag == "1"
        ) {
          this.commonservice.presentToast(
            this.translate.instant(
              "PREVENTIVEMAINTENANCEASSIGN.extendhoursmandatory"
            )
          );
          return;
        }

        this.showalert();
      }
    }
  }

  btn_back() {
    this.viewFlag = false;
  }

  async showalert() {
    /*const alert = await this.alertController.create({
      header: this.translate.instant("PREVENTIVEMAINTENANCEASSIGN.alert"),
      cssClass: "alertmessage",
      message: this.translate.instant(
        "PREVENTIVEMAINTENANCEASSIGN.alertmessage"
      ),
      buttons: [
        {
          text: this.translate.instant("GENERALBUTTON.cancelbutton"),
          role: "cancel",
          cssClass: "secondary",
          handler: (cancel) => {},
        },
        {
          text: this.translate.instant("GENERALBUTTON.sure"),
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
    if (this.machinereplacementFlag == "0") {
      let partsstatus = [];
      let setpvflag = 0;

      if (this.goodFlag) {
        setpvflag = 0;
        let eachreq = {
          partid: this.partdefectid,
          condition: this.conditionoptionSelected,
          maintenancetypeid: "",
          damagetypeid: "",
        };

        partsstatus.push(eachreq);
      } else if (this.abnormalFlag) {
        setpvflag = 0;
        let eachreq = {
          partid: this.partdefectid,
          condition: this.conditionoptionSelected,
          maintenancetypeid: String(this.maintenancetypeid),
          damagetypeid: this.damagetypeidArr.join(","),
        };

        partsstatus.push(eachreq);
      } else if (this.replacedFlag) {
        setpvflag = 1;
        let eachreq = {
          partid: this.partdefectid,
          replacestatus: this.conditionactivitySelected,
          lifetimerunninghours: "",
          currentrunninghours: "",
          extendedmaxrunninghours: "",
        };

        partsstatus.push(eachreq);
      } else if (this.servicedFlag) {
        setpvflag = 1;
        if (this.extendrunninghoursFlag == "1") {
          let eachreq = {
            partid: this.partdefectid,
            replacestatus: this.conditionactivitySelected,
            lifetimerunninghours: this.lifetimerunninghours,
            currentrunninghours: this.currentrunninghours,
            extendedmaxrunninghours: String(
              this.assignForm.value.txt_extendlifetimehours
            ),
          };

          partsstatus.push(eachreq);
        } else {
          let eachreq = {
            partid: this.partdefectid,
            replacestatus: this.conditionactivitySelected,
            lifetimerunninghours: "",
            currentrunninghours: "",
            extendedmaxrunninghours: "",
          };

          partsstatus.push(eachreq);
        }
      }

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
        pvflag: setpvflag,
        completedflag: 1,
        extendrunninghoursflag: this.extendrunninghoursFlag,
        machinereplacementflag: this.machinereplacementFlag,
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

            if (this.module == "RoPM") {
              this.commonservice.presentToast(
                this.translate.instant(
                  "PREVENTIVEMAINTENANCEASSIGN.routinesuccess"
                )
              );
            }

            if (this.module == "RePM") {
              this.commonservice.presentToast(
                this.translate.instant(
                  "PREVENTIVEMAINTENANCEASSIGN.replacementsuccess"
                )
              );
            }

            this.modalController.dismiss({
              dismissed: true,
              item: "Submitted",
            });
          } else {
            this.confirmDisable = false;

            if (this.module == "RoPM") {
              this.commonservice.presentToast(
                this.translate.instant(
                  "PREVENTIVEMAINTENANCEASSIGN.routinefailed"
                )
              );
            }

            if (this.module == "RePM") {
              this.commonservice.presentToast(
                this.translate.instant(
                  "PREVENTIVEMAINTENANCEASSIGN.replacementfailed"
                )
              );
            }
          }
        });
    } else {
      var machinereq;
      let setpvflag = 0;
      if (this.replacedFlag) {
        setpvflag = 1;

        machinereq = {
          userid: this.userlist.userId,
          millcode: this.userlist.millcode,
          dept_id: this.userlist.dept_id,
          id: this.getnotificationid,
          stationid: this.getstationid,
          equipment: this.getmachineid,
          replacestatus: this.conditionactivitySelected,
          assignedto: this.assignedtoidArr.join(","),
          pvflag: setpvflag,
          completedflag: 1,
          extendrunninghoursflag: this.extendrunninghoursFlag,
          machinereplacementflag: this.machinereplacementFlag,
          language: this.languageService.selected,
        };
      } else if (this.servicedFlag) {
        setpvflag = 1;
        if (this.extendrunninghoursFlag == "1") {
          machinereq = {
            userid: this.userlist.userId,
            millcode: this.userlist.millcode,
            dept_id: this.userlist.dept_id,
            id: this.getnotificationid,
            stationid: this.getstationid,
            equipment: this.getmachineid,
            replacestatus: this.conditionactivitySelected,
            assignedto: this.assignedtoidArr.join(","),
            lifetimerunninghours: this.lifetimerunninghours,
            currentrunninghours: this.currentrunninghours,
            extendedmaxrunninghours: String(
              this.assignForm.value.txt_extendlifetimehours
            ),
            pvflag: setpvflag,
            completedflag: 1,
            extendrunninghoursflag: this.extendrunninghoursFlag,
            machinereplacementflag: this.machinereplacementFlag,
            language: this.languageService.selected,
          };
        } else {
          machinereq = {
            userid: this.userlist.userId,
            millcode: this.userlist.millcode,
            dept_id: this.userlist.dept_id,
            id: this.getnotificationid,
            stationid: this.getstationid,
            equipment: this.getmachineid,
            replacestatus: this.conditionactivitySelected,
            assignedto: this.assignedtoidArr.join(","),
            lifetimerunninghours: "",
            currentrunninghours: "",
            extendedmaxrunninghours: "",
            pvflag: setpvflag,
            completedflag: 1,
            extendrunninghoursflag: this.extendrunninghoursFlag,
            machinereplacementflag: this.machinereplacementFlag,
            language: this.languageService.selected,
          };
        }
      }

      console.log(machinereq);

      this.maintenanceservice
        .saveMultiplePartMaintenanceNotification(machinereq)
        .then((result) => {
          var resultdata: any;
          resultdata = result;
          if (resultdata.httpcode == 200) {
            this.confirmDisable = false;

            if (this.module == "RoPM") {
              this.commonservice.presentToast(
                this.translate.instant(
                  "PREVENTIVEMAINTENANCEASSIGN.routinesuccess"
                )
              );
            }

            if (this.module == "RePM") {
              this.commonservice.presentToast(
                this.translate.instant(
                  "PREVENTIVEMAINTENANCEASSIGN.replacementsuccess"
                )
              );
            }

            this.modalController.dismiss({
              dismissed: true,
              item: "Submitted",
            });
          } else {
            this.confirmDisable = false;

            if (this.module == "RoPM") {
              this.commonservice.presentToast(
                this.translate.instant(
                  "PREVENTIVEMAINTENANCEASSIGN.routinefailed"
                )
              );
            }

            if (this.module == "RePM") {
              this.commonservice.presentToast(
                this.translate.instant(
                  "PREVENTIVEMAINTENANCEASSIGN.replacementfailed"
                )
              );
            }
          }
        });
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

          this.activityid = this.params.activity_id;
          this.activityvalue = this.params.activity_name;

          if (this.activityid == "0") {
            if (modeldata.data.searchtext != "") {
              this.assignForm.controls.txt_activityname.setValue(
                modeldata.data.searchtext
              );
            }

            this.otheractivityFlag = true;
          } else {
            let activity_validate = false;
            this.otheractivityFlag = false;

            this.assignForm.controls.txt_activityname.setValue("");

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

  resetdata() {
    if (this.module == "RoPM") {
      this.maintenancetypeid = "";
      this.maintenancetypevalue = "";

      this.activityid = "";
      this.activityvalue = "";
      this.activityidArr = [];
      this.activityvalueArr = [];

      this.damagetypeid = "";
      this.damagetypevalue = "";
      this.damagetypeidArr = [];
      this.damagetypevalueArr = [];

      this.assignedtoid = "";
      this.assignedtovalue = "";
      this.assignedtoidArr = [];
      this.assignedtovalueArr = [];

      this.assignForm.controls.select_maintenancetype.setValue("");
      this.assignForm.controls.select_damagetype.setValue("");
      this.assignForm.controls.txt_activityname.setValue("");
      this.assignForm.controls.select_assignedto.setValue("");
    } else {
      this.lifetimerunninghours = "";
      this.currentrunninghours = "";

      this.assignForm.controls.txt_extendlifetimehours.setValue("");
    }
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }

  numberFilter(event: any) {
    const reg = /^[1-9][0-9]{0,5}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  parseString(item) {
    return JSON.stringify(item);
  }
}
