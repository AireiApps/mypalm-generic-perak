import { Component, OnInit, ViewChild } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { Router } from "@angular/router";
import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
  IonContent,
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

// Model
import { MaintenanceActivitysearchPage } from "src/app/maintenance-module/maintenance-activitysearch/maintenance-activitysearch.page";

@Component({
  selector: "app-cm-multipart-save",
  templateUrl: "./cm-multipart-save.page.html",
  styleUrls: ["./cm-multipart-save.page.scss"],
})
export class CmMultipartSavePage implements OnInit {
  @ViewChild("pageTop") pageTop: IonContent;
  @ViewChild("partsSelect", { static: false }) partsRef: IonSelect;
  @ViewChild("damagetypeSelect", { static: false }) damagetypeRef: IonSelect;
  @ViewChild("assignedtoSelect", { static: false }) assignedtoRef: IonSelect;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  getlanguage = this.userlist.language;

  assignForm;

  params;

  maintenancetypeArr = [];
  damageArr = [];
  activityArr = [];
  assignedtoArr = [];

  // Variables
  title = "";
  module = "";

  getnotificationid = "";

  getstationid = "";
  getstationname = "";

  getmachineid = "";
  getmachinename = "";

  getbreakdownid = "";
  getbreakdownvalue = "";

  getmaintenancetypeid = "";
  getmaintenancetypevalue = "";

  partdefectname = "";
  partdefectid = "";

  getbreakdowncausesid = "";
  getbreakdowncausesvalue = "";

  getbreakdownremarksvalue = "";

  getstatusid = "";

  partid = "";
  partvalue = "";
  //partidArr = [];
  //partvalueArr = [];

  activityid = "";
  activityvalue = "";
  machineresetvalue = "";
  machineresetflag = 0;
  activityvalidationflag = false;

  activityidArr = [];
  activityvalueArr = [];
  machineresetflagArr = [];

  damagetypeid = "";
  damagetypevalue = "";
  damagetypeidArr = [];
  damagetypevalueArr = [];

  assignedtoid = "";
  assignedtovalue = "";
  assignedtoidArr = [];
  assignedtovalueArr = [];

  multipartsArr = [];
  addnewrowArr = [];

  pleasewaitflag = false;
  otheractivityFlag = false;

  addDisable = false;
  saveDisable = false;

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

  public partsOptions: any = {
    header: this.translate.instant("PREVENTIVEMAINTENANCEASSIGN.partname"),
    cssClass: "singleselect",
  };

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

    this.title = this.params.stationname;
    this.module = navParams.get("module");

    this.getnotificationid = this.params.id;

    this.getstationid = this.params.stationid;
    this.getstationname = this.params.stationname;

    this.getmachineid = this.params.equipmentid;
    this.getmachinename = this.params.equipmentname;

    this.getbreakdownid = this.params.breakdowncodingid;
    this.getbreakdownvalue = this.params.breakdowncoding;

    this.getmaintenancetypeid = this.params.maintenancetypeid;
    this.getmaintenancetypevalue = this.params.maintenancetype;

    this.partdefectname = this.params.partdefect;
    this.partdefectid = this.params.partdefectid;

    this.getbreakdowncausesid = this.params.breakdowncausesid;
    this.getbreakdowncausesvalue = this.params.breakdowncauses;

    this.getbreakdownremarksvalue = this.params.breakdownremarks;

    this.getstatusid = this.params.statusId;

    this.assignForm = this.fb.group({
      select_parts: new FormControl(""),
      select_assignedto: new FormControl(""),
      txt_activityname: new FormControl("", Validators.required),
      select_damagetype: new FormControl(""),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getParts();
  }

  getParts() {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      id: this.getnotificationid,
      partdefectid: this.partdefectid,
      language: this.languageService.selected,
    };

    this.maintenanceservice.getMultiPartDefectList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.multipartsArr = resultdata.data;

        this.getAssignedTo();
      } else {
        this.multipartsArr = [];

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

        this.getDamage();
      } else {
        this.assignedtoArr = [];

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

  openParts() {
    this.partsRef.open();
  }

  partshandleChange(e) {
    let value = e.detail.value;

    if (value.length > 0) {
      /*this.partidArr = [];
      this.partvalueArr = [];

      for (let i = 0; i < value.length; i++) {
        this.partidArr.push(JSON.parse(value[i]).partid);
        this.partvalueArr.push(JSON.parse(value[i]).partname);
      }

      this.partid = this.partidArr.join(",");
      this.partvalue = this.nl2br(this.partvalueArr.join(", "));*/

      this.partid = JSON.parse(value).partid;
      this.partvalue = JSON.parse(value).partname;
    } else {
      //this.partidArr = [];
      //this.partvalueArr = [];

      this.partid = "";
      this.partvalue = "";
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

  openDamageType() {
    this.damagetypeRef.open();
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
      this.activityid = this.activityidArr.join(",");

      this.activityvalueArr.push(this.assignForm.value.txt_activityname);

      this.activityvalue = this.nl2br(this.activityvalueArr.join(", "));

      this.machineresetflag = 0;

      this.machineresetflagArr.push(this.machineresetflag);
      this.machineresetvalue = this.machineresetflagArr.join(",");

      this.otheractivityFlag = false;

      this.assignForm.controls.txt_activityname.setValue("");
    }
  }

  clear(type) {
    if (type == "Activity") {
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
      }
    }
  }

  addNewRow() {
    let partexistflag = false;

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
        if (this.partid == this.addnewrowArr[i].partid) {
          partexistflag = true;
        }
      }
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
      partid: this.partid,
      part: this.partvalue,
      damagetypeid: this.damagetypeid,
      damagetype: this.damagetypevalue,
      activityid: this.activityid,
      activity: this.activityvalue,
      machineresetflag: this.machineresetvalue,
    };

    this.addnewrowArr.push(eachreq);

    console.log(this.addnewrowArr);

    if (this.addnewrowArr.length > 0) {
      this.reset_data();
    }
  }

  deleteRow(index: number) {
    this.addnewrowArr.splice(index, 1);
  }

  async savealert() {
    if (this.assignedtoidArr.length <= 0) {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assigntomandatory"
        )
      );
      return;
    }

    let alertmessage = "";

    if (this.multipartsArr.length == this.addnewrowArr.length) {
      this.btn_save();
    } else {
      let pendingparts = this.multipartsArr.length - this.addnewrowArr.length;
      let parttext = "";

      if (pendingparts == 1) {
        parttext = " Part";
      } else {
        parttext = " Parts";
      }

      if (this.getlanguage == "English") {
        alertmessage =
          pendingparts +
          parttext +
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.multiplepartalertmessage"
          );
      } else {
        alertmessage =
          pendingparts +
          " bahagian" +
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.multiplepartalertmessage"
          );
      }

      const alert = await this.alertController.create({
        mode: "md",
        header: this.translate.instant(
          "SUPERVISORDASHBOARD.alreadybreakdownalerttitle"
        ),
        cssClass: "customalertmessagetwobuttons",
        message: alertmessage,
        buttons: [
          {
            text: "",
            cssClass: "cancelbutton",
            handler: () => {},
          },
          {
            text: "",
            handler: () => {
              this.btn_save();
            },
          },
        ],
      });

      await alert.present();
    }
  }

  btn_save() {
    var completedFlag;

    if (this.multipartsArr.length == this.addnewrowArr.length) {
      completedFlag = 1;
    } else {
      completedFlag = 0;
    }

    this.pageTop.scrollToTop();

    this.saveDisable = true;
    this.pleasewaitflag = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      id: this.getnotificationid,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      partsarray: JSON.stringify(this.addnewrowArr),
      assignedto: this.assignedtoidArr.join(","),
      pvflag: 2,
      completedflag: completedFlag,
      language: this.languageService.selected,
    };

    console.log(req);

    this.maintenanceservice
      .saveMultiplePartMaintenanceNotification(req)
      .then((result) => {
        var resultdata: any;
        resultdata = result;
        if (resultdata.httpcode == 200) {
          this.saveDisable = false;

          this.pleasewaitflag = false;

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
          this.saveDisable = false;

          this.pleasewaitflag = false;

          this.commonservice.presentToast(
            this.translate.instant(
              "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.assignfailed"
            )
          );
        }
      });
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
        }
      });

      return await activitymodal.present();
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  parseString(item) {
    return JSON.stringify(item);
  }

  reset_data() {
    // Parts
    //this.partidArr = [];
    //this.partvalueArr = [];
    this.partid = "";
    this.partvalue = "";
    this.assignForm.controls.select_parts.setValue("");

    // Damage Type
    this.damagetypeidArr = [];
    this.damagetypevalueArr = [];
    this.damagetypeid = "";
    this.damagetypevalue = "";
    this.assignForm.controls.select_damagetype.setValue("");

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

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }
}
