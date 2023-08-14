import { Component, OnInit, ViewChild } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
  IonContent,
} from "@ionic/angular";

// Custom Date Picker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { Plugins, KeyboardInfo } from "@capacitor/core";
const { Keyboard } = Plugins;
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";

import { MaintenanceMaterialsearchPage } from "src/app/maintenance-module/maintenance-materialsearch/maintenance-materialsearch.page";

@Component({
  selector: "app-production-machineshutdownalert-modal",
  templateUrl: "./production-machineshutdownalert-modal.page.html",
  styleUrls: ["./production-machineshutdownalert-modal.page.scss"],
})
export class ProductionMachineshutdownalertModalPage implements OnInit {
  @ViewChild("pageBottom") pageBottom: IonContent;
  @ViewChild("breakdowncausesSelect", { static: false })
  breakdowncausesRef: IonSelect;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  breakdownForm;

  params;
  module = "";
  millproductionFlag = "";
  title = "";

  breakdownArr = [];
  maintenancetypeArr = [];
  breakdowncausesArr = [];

  // Flags
  breakdownFlag = false;
  isDisabled = false;
  correctivemaintenanceraiseFlag = false;
  step1completedFlag = false;
  step2completedFlag = false;
  step3completedFlag = false;
  step4completedFlag = false;
  otherFlag = false;

  // Variables
  getstationid = "";
  getstationname = "";

  getmachineid = "";
  getmachinename = "";
  getmachinestatus = "";

  notificationno = "";
  breakdownid = "";
  breakdownvalue = "";

  maintenancetypeid = "";
  maintenancetypevalue = "";

  breakdowncausesid = "";
  breakdowncausesvalue = "";
  breakdowncausesidArr = [];
  breakdowncausesvalueArr = [];

  partid = "";
  partvalue = "";
  partidArr = [];
  partvalueArr = [];

  // Ionic Select Header
  public breakdownOptions: any = {
    header: this.translate.instant("SUPERVISORDASHBOARD.problem"),
    cssClass: "multiselect",
  };

  public maintenancetypeOptions: any = {
    header: this.translate.instant("SUPERVISORDASHBOARD.maintenancetype"),
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
    private alertController: AlertController,
    public modalController: ModalController,
    public partmodalController: ModalController,
    private fb: FormBuilder,
    public navParams: NavParams,
    private commonservice: AIREIService,
    private supervisorservice: SupervisorService
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
    this.module = navParams.get("module");
    this.millproductionFlag = navParams.get("millstatus");

    this.getstationid = this.params.stationid;
    this.getstationname = this.params.stationname;

    this.getmachineid = this.params.machineid;
    this.getmachinename = this.params.machinename;
    this.getmachinestatus = this.params.machinestatus;

    //console.log(this.getmachinestatus);

    this.title = this.getstationname;

    this.breakdownForm = this.fb.group({
      select_breakdown: new FormControl("", Validators.required),
      select_maintenancetype: new FormControl(""),
      txt_partname: new FormControl(""),
      select_breakdowncauses: new FormControl(""),
      ta_remarks: new FormControl(""),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getBreakdown();
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

  getBreakdown() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      type: this.millproductionFlag,
      machinestatus: this.getmachinestatus,
      language: this.languageService.selected,
    };

    console.log(req);

    this.supervisorservice.getBreakdownCodingList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.breakdownArr = resultdata.data;
        //console.log(resultdata.data);
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

        //console.log(this.breakdownArr);
      } else {
        this.breakdownArr = [];

        this.breakdownFlag = false;
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
    this.supervisorservice.getMaintenanceTypeList(req).then((result) => {
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
    this.supervisorservice.getBreakDownCausesList(req).then((result) => {
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

      if (this.breakdownid == "0") {
        this.step1completedFlag = false;
        this.correctivemaintenanceraiseFlag = false;
      } else {
        this.step1completedFlag = true;
        this.correctivemaintenanceraiseFlag = true;

        this.getMaintenancetype();
      }
    } else {
      this.breakdownid = "";
      this.breakdownvalue = "";

      this.step1completedFlag = false;
      this.correctivemaintenanceraiseFlag = false;
    }
  }

  onConditionOptionChange(value) {
    this.breakdownid = String(value.id);
    this.breakdownvalue = value.breakdownCoding;

    //console.log(this.breakdownid + "\n" + this.breakdownvalue);

    if (this.breakdownid == "0") {
      this.step1completedFlag = false;
      this.correctivemaintenanceraiseFlag = false;

      if (this.millproductionFlag == "1") {
        if (this.getmachinestatus == "0") {
          this.longtimenotinusealertmessage();
        } else {
          this.shottermnotinusealert();
        }
      } else {
        this.longtimenotinusealertmessage();
      }
    } else if (this.breakdownid == "3") {
      this.step1completedFlag = false;
      this.correctivemaintenanceraiseFlag = false;

      this.longtimenotinusealertmessage();
    } else {
      this.step1completedFlag = true;
      this.correctivemaintenanceraiseFlag = true;

      this.getMaintenancetype();
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

  async longtimenotinusealertmessage() {
    //console.log("breakdownid:", breakdown_id);

    let alertmessage = "";

    if (this.getmachinestatus == "0") {
      alertmessage =
        this.translate.instant("SUPERVISORDASHBOARD.turnonmachine") +
        this.getmachinename +
        "?";
    } else {
      alertmessage =
        this.translate.instant("SUPERVISORDASHBOARD.successfullyturnoff") +
        this.getmachinename +
        "?";
    }

    const alert = await this.alertController.create({
      mode: "md",
      header: "",
      cssClass: "customalertmessagetwobuttons",
      message: alertmessage,
      backdropDismiss: false,
      animated: true,
      buttons: [
        {
          text: "",
          cssClass: "cancelbutton",
          handler: () => {},
        },
        {
          text: "",
          cssClass: "okaybutton",
          handler: () => {
            this.save("");
          },
        },
      ],
    });

    await alert.present();
  }

  async shottermnotinusealert() {
    var alertmessage =
      this.translate.instant("SUPERVISORDASHBOARD.successfullyturnoff") +
      this.getmachinename +
      "?";
    this.alertController
      .create({
        mode: "md",
        header: "",
        cssClass: "customalertmessagetwobuttons",
        message: alertmessage,
        backdropDismiss: false,
        animated: true,
        inputs: [
          {
            name: "reason",
            type: "textarea",
            cssClass: "alertinput",
            placeholder:
              this.translate.instant("SUPERVISORDASHBOARD.enterremarks") +
              " (" +
              this.translate.instant("SUPERVISORDASHBOARD.optional") +
              ")",
          },
        ],
        buttons: [
          {
            text: "",
            cssClass: "cancelbutton",
            handler: () => {},
          },
          {
            text: "",
            handler: (data: any) => {
              if (data.reason != "") {
                this.save(data.reason);
              } else {
                /*this.commonservice.presentToast(
                  this.translate.instant("SUPERVISORDASHBOARD.remarksmandatory")
                );
                return false;*/
                this.save("");
              }
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  save(getremarks) {
    let partid = [];
    let partvalue = [];
    let otherpartname = [];

    if (this.correctivemaintenanceraiseFlag) {
      if (this.breakdownid == "") {
        this.commonservice.presentToast(
          this.translate.instant("SUPERVISORDASHBOARD.problemmandatory")
        );
        return;
      }

      if (this.breakdownForm.value.select_maintenancetype == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEACKNOWLEDGEMODAL.maintenancetypeselection"
          )
        );
        return;
      }

      if (this.partidArr.length <= 0) {
        if (this.module == "CM") {
          this.commonservice.presentToast(
            this.translate.instant(
              "MAINTENANCEACKNOWLEDGEMODAL.partdefectmandatory"
            )
          );
        } else if (this.module == "RoPM") {
          this.commonservice.presentToast(
            this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.partselection")
          );
        } else if (this.module == "RePM") {
          this.commonservice.presentToast(
            this.translate.instant(
              "MAINTENANCEACKNOWLEDGEMODAL.partreplacedselection"
            )
          );
        } else {
          this.commonservice.presentToast(
            this.translate.instant("MAINTENANCEACKNOWLEDGEMODAL.partselection")
          );
        }

        return;
      }

      if (this.breakdownForm.value.select_breakdowncauses == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEACKNOWLEDGEMODAL.breakdowncausesselection"
          )
        );
        return;
      }

      // Maintenance Type
      this.maintenancetypeid = JSON.parse(
        this.breakdownForm.value.select_maintenancetype
      ).id;

      this.maintenancetypevalue = JSON.parse(
        this.breakdownForm.value.select_maintenancetype
      ).maintanence_type;

      // Part
      for (let i = 0; i < this.partidArr.length; i++) {
        if (this.partidArr[i] == 0) {
          otherpartname.push(this.partvalueArr[i]);
        } else {
          partid.push(this.partidArr[i]);
        }
      }

      partvalue.push(this.partvalueArr);
    } else {
      if (this.breakdownid == "") {
        this.commonservice.presentToast(
          this.translate.instant("SUPERVISORDASHBOARD.problemmandatory")
        );
        return;
      }

      this.maintenancetypeid = "";
      this.maintenancetypevalue = "";

      partid = [];
      partvalue = [];
      otherpartname = [];

      this.breakdowncausesidArr = [];
      this.breakdowncausesvalueArr = [];
    }

    this.modalController.dismiss({
      dismissed: true,
      breakdown_id: this.breakdownid,
      maintenancetype_id: this.maintenancetypeid,
      part_id: partid.join(","),
      otherpart_name: otherpartname.join("~"),
      breakdowncauses_id: this.breakdowncausesidArr.join(","),
      breakdown_value: this.breakdownvalue,
      maintenancetype_value: this.maintenancetypevalue,
      breakdownremarks: this.breakdownForm.value.ta_remarks,
      notinuseremarks: getremarks,
    });
  }

  btn_add(type) {
    if (type == "Part") {
      if (this.breakdownForm.value.txt_partname == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "MAINTENANCEACKNOWLEDGEMODAL.partnamemandatory"
          )
        );
        return;
      }

      this.partid = "0";

      this.partidArr.push(this.partid);

      this.partvalueArr.push(this.breakdownForm.value.txt_partname);

      this.partvalue = this.nl2br(this.partvalueArr.join("\n"));

      this.otherFlag = false;

      this.breakdownForm.controls.txt_partname.setValue("");

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

  btn_back() {
    this.correctivemaintenanceraiseFlag = false;

    this.getBreakdown();
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
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
              this.breakdownForm.controls.txt_partname.setValue(
                modeldata.data.searchtext
              );
            }

            this.otherFlag = true;
          } else {
            let part_validate = false;

            this.otherFlag = false;

            this.breakdownForm.controls.txt_partname.setValue("");

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
          this.breakdownForm.controls.txt_partname.setValue("");
        }

        if (this.partvalue.length <= 0) {
          this.step3completedFlag = false;
          this.getStatusColor("STEP3");
        }
      }
    }
  }

  scrollbottom() {
    /*setTimeout(() => {
      this.pageBottom.scrollToBottom();
    }, 1000);*/

    Keyboard.addListener("keyboardWillShow", (info: KeyboardInfo) => {
      setTimeout(() => {
        this.pageBottom.scrollToPoint(
          0,
          document.getElementById("taremarks").offsetTop,
          10
        );
      }, 200);
    });

    Keyboard.addListener("keyboardDidShow", (info: KeyboardInfo) => {
      setTimeout(() => {
        this.pageBottom.scrollToPoint(
          0,
          document.getElementById("taremarks").offsetTop,
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
