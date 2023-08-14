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
  selector: "app-maintenance-engineer-notification-modal",
  templateUrl: "./maintenance-engineer-notification-modal.page.html",
  styleUrls: ["./maintenance-engineer-notification-modal.page.scss"],
})
export class MaintenanceEngineerNotificationModalPage implements OnInit {
  @ViewChild("pageTop") pageTop: IonContent;
  //@ViewChild("damagetypeSelect", { static: false }) damagetypeRef: IonSelect;
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
  activityArr = [];
  assignedtoArr = [];

  // Flags
  stepFlag = true;
  step1completedFlag = false;
  step2completedFlag = false;
  step3completedFlag = false;
  step4completedFlag = false;

  otherFlag = false;

  viewFlag = false;

  breakdownFlag = false;

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

  // View the details
  view_breakdown = "";
  view_maintenancetype = "";
  view_partdefect = "";
  view_breakdowncauses = "";

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

    console.log(this.params);

    this.getstationid = this.params.stationid;
    this.getmachineid = this.params.machineid;

    this.getstationname = this.params.stationname;
    this.getmachinename = this.params.machinename;

    this.step1Form = this.fb.group({
      select_breakdown: new FormControl("", Validators.required),
      select_maintenancetype: new FormControl("", Validators.required),
      txt_partname: new FormControl(""),
      select_breakdowncauses: new FormControl("", Validators.required),
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
    } else if (type == "STEP4") {
      if (!this.step4completedFlag) {
        color = "#CB4335";
      } else if (this.step4completedFlag) {
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
      } else {
        this.breakdowncausesArr = [];
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

      this.step4completedFlag = true;
      this.getStatusColor("STEP4");
    } else {
      this.breakdowncausesidArr = [];
      this.breakdowncausesvalueArr = [];
      this.breakdowncausesid = "";
      this.breakdowncausesvalue = "";

      this.step4completedFlag = false;
      this.getStatusColor("STEP4");
    }
  }

  openBreakdownCauses() {
    this.breakdowncausesRef.open();
  }

  btn_next(type) {
    if (type == "STEP1") {
      if (this.step1Form.value.select_breakdown == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.problemmandatory"
          )
        );
        return;
      }

      if (this.step1Form.value.select_maintenancetype == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.maintenancetypemandatory"
          )
        );
        return;
      }

      if (this.partvalueArr.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.partdefectmandatory"
          )
        );
        return;
      }

      if (this.breakdowncausesid.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.breakdowncausesmandatory"
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
            if (modeldata.data.searchtext != "") {
              this.step1Form.controls.txt_partname.setValue(
                modeldata.data.searchtext
              );
            }

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
    }
  }

  view() {
    this.view_breakdown = JSON.parse(
      this.step1Form.value.select_breakdown
    ).breakdownCoding;

    this.view_maintenancetype = JSON.parse(
      this.step1Form.value.select_maintenancetype
    ).maintanence_type;

    this.view_partdefect = this.partvalueArr.join(", ");
    this.view_breakdowncauses = this.breakdowncausesvalueArr.join(", ");

    /*console.log(
      this.view_breakdown +
        "\n" +
        this.view_maintenancetype +
        "\n" +
        this.view_partdefect +
        "\n" +
        this.view_breakdowncauses +
        "\n" +
        this.view_activity +
        "\n" +
        this.view_assignto
    );*/

    /*this.stepFlag = false;

    this.viewFlag = true;

    this.pageTop.scrollToTop();*/

    this.showalert();
  }

  async showalert() {
    if (this.view_breakdown == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.breakdownmandatory"
        )
      );
      return;
    }

    if (this.view_maintenancetype == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.maintenancetypemandatory"
        )
      );
      return;
    }

    if (this.view_partdefect == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.partdefectmandatory"
        )
      );
      return;
    }

    if (this.view_breakdowncauses == "") {
      this.commonservice.presentToast(
        this.translate.instant(
          "MAINTENANCEENGINEERINGNOTIFICATIONMODAL.breakdowncausesmandatory"
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
    let partid = [];
    let partvalue = [];
    let otherpartname = [];
    for (let i = 0; i < this.partidArr.length; i++) {
      if (this.partidArr[i] == 0) {
        otherpartname.push(this.partvalueArr[i]);
      } else {
        partid.push(this.partidArr[i]);
      }
    }

    partvalue.push(this.partvalueArr);

    this.confirmDisable = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      id: 0,
      stationid: String(this.getstationid),
      equipment: String(this.getmachineid),
      problem: "",
      notificationnumber: this.notificationno,
      malfunctionstarttime: "",
      malfunctionstoptime: "",
      notificationtype: "",
      breakdown_coding: this.breakdownid,
      maintanence_type: this.maintenancetypeid,
      part_defect: partid.join(","),
      other_partdefectflag: "",
      other_part_name: otherpartname.join("~"),
      damage: "",
      breakdown_cause: this.breakdowncausesidArr.join(","),
      activity: "",
      other_activity_name: "",
      operation: "",
      carryoutby: "",
      materialid: "",
      quantity: "",
      assignedto: "",
      pvflag: 0,
      remarks: this.step1Form.value.ta_remarks,
      ffbcagestatus: this.ffbcageflag,
      language: this.languageService.selected,
    };

    console.log(req);

    this.maintenanceservice.saveMaintenanceNotification(req).then((result) => {
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

        if (this.module == "PRODUCTION") {
          this.router.navigate(["/report-production-maintenance-notification"]);
        }
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
