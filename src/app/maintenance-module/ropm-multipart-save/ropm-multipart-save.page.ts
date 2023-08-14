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
import * as moment from "moment";

// Custom Date Picker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { Plugins } from "@capacitor/core";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-ropm-multipart-save",
  templateUrl: "./ropm-multipart-save.page.html",
  styleUrls: ["./ropm-multipart-save.page.scss"],
})
export class RopmMultipartSavePage implements OnInit {
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

  partid = "";
  partvalue = "";
  partidArr = [];
  partvalueArr = [];

  damagetypeid = "";
  damagetypevalue = "";
  damagetypeidArr = [];
  damagetypevalueArr = [];

  assignedtoid = "";
  assignedtovalue = "";
  assignedtoidArr = [];
  assignedtovalueArr = [];

  multipartsArr = [];

  goodFlag = false;
  abnormalFlag = false;
  pleasewaitflag = false;
  confirmDisable = false;

  getmaintenancetype;
  getmaintenancetypeid;
  getdamagetype;
  getdamagetypeid;
  getrecordstatus;

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

    this.getnotificationid = this.params.id;
    this.getstationid = this.params.stationid;
    this.getstationname = this.params.stationname;
    this.getmachineid = this.params.equipmentid;
    this.getmachinename = this.params.equipmentname;
    this.getactivityname = this.params.replacement_activityname;
    this.getstatusid = this.params.statusId;
    this.partdefectname = this.params.partdefect;
    this.partdefectid = this.params.partdefectid;

    this.assignForm = this.fb.group({
      select_parts: new FormControl(""),
      select_assignedto: new FormControl(""),
      select_maintenancetype: new FormControl(""),
      select_damagetype: new FormControl(""),
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

        this.getParts();
      } else {
        this.assignedtoArr = [];

        this.getParts();
      }
    });
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
      } else {
        this.multipartsArr = [];
      }
    });
  }

  openParts() {
    this.partsRef.open();
  }

  partshandleChange(e) {
    let value = e.detail.value;
    if (value.length > 0) {
      this.partidArr = [];
      this.partvalueArr = [];
      for (let i = 0; i < value.length; i++) {
        this.partidArr.push(JSON.parse(value[i]).partid);
        this.partvalueArr.push(JSON.parse(value[i]).partname);
      }

      this.partid = this.partidArr.join(",");
      this.partvalue = this.nl2br(this.partvalueArr.join(", "));
    } else {
      this.partidArr = [];
      this.partvalueArr = [];

      this.partid = "";
      this.partvalue = "";
    }
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

      if (this.partidArr.length > 1) {
        this.commonservice.presentToast(
          this.translate.instant(
            "PREVENTIVEMAINTENANCEASSIGN.onepartmaximumabnormal"
          )
        );
      }

      this.goodFlag = false;
      this.abnormalFlag = true;

      this.getMaintenancetype();
    } else {
      //this.resetdata();

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

  async savealert() {
    if (this.partidArr.length <= 0) {
      this.commonservice.presentToast(
        this.translate.instant("PREVENTIVEMAINTENANCEASSIGN.partnamemandatory")
      );
      return;
    }

    if (this.conditionoptionSelected == "Abnormal") {
      if (this.partidArr.length > 1) {
        this.commonservice.presentToast(
          this.translate.instant(
            "PREVENTIVEMAINTENANCEASSIGN.onepartmaximumabnormal"
          )
        );
        return;
      }
    }

    if (this.assignedtoidArr.length <= 0) {
      this.commonservice.presentToast(
        this.translate.instant("PREVENTIVEMAINTENANCEASSIGN.assigntomandatory")
      );
      return;
    }

    if (this.conditionoptionSelected == "") {
      this.commonservice.presentToast(
        this.translate.instant("MAINTENANCEACCEPTMODAL.conditionmandatory")
      );
      return;
    }

    let alertmessage = "";

    if (this.multipartsArr.length == this.partidArr.length) {
      this.btn_save();
    } else {
      let pendingparts = this.multipartsArr.length - this.partidArr.length;
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

    if (this.multipartsArr.length == this.partidArr.length) {
      completedFlag = 1;
    } else {
      completedFlag = 0;
    }

    if (this.conditionoptionSelected == "Good") {
      this.save(completedFlag);
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

      this.save(completedFlag);
    }
  }

  save(getcompletedflag) {
    let partsstatus = [];

    if (this.conditionoptionSelected == "Good") {
      for (let i = 0; i < this.partidArr.length; i++) {
        let eachreq = {
          partid: this.partidArr[i],
          condition: this.conditionoptionSelected,
          maintenancetypeid: "",
          damagetypeid: "",
        };

        partsstatus.push(eachreq);
      }
    } else {
      for (let i = 0; i < this.partidArr.length; i++) {
        let eachreq = {
          partid: this.partidArr[i],
          condition: this.conditionoptionSelected,
          maintenancetypeid: String(this.maintenancetypeid),
          damagetypeid: this.damagetypeidArr.join(","),
        };

        partsstatus.push(eachreq);
      }
    }

    this.pageTop.scrollToTop();

    this.confirmDisable = true;
    this.pleasewaitflag = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      id: this.getnotificationid,
      stationid: this.getstationid,
      equipment: this.getmachineid,
      partsarray: JSON.stringify(partsstatus),
      assignedto: this.assignedtoidArr.join(","),
      pvflag: 0,
      completedflag: getcompletedflag,
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

          this.pleasewaitflag = false;

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

          this.pleasewaitflag = false;

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

  resetdata() {
    this.maintenancetypeid = "";
    this.maintenancetypevalue = "";

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
    this.assignForm.controls.select_assignedto.setValue("");
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

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }
}
