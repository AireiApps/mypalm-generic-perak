import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AIREIService } from "src/app/api/api.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import {
  AlertController,
  Platform,
  Animation,
  AnimationController,
  ModalController,
} from "@ionic/angular";

import { MaintenanceServiceService } from "src/app/services/maintenance-serivce/maintenance-service.service";
import * as moment from "moment";

import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

import { Market } from "@ionic-native/market/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";

// Custom Datepicker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

@Component({
  selector: "app-lab-oillosses-dashboard",
  templateUrl: "./lab-oillosses-dashboard.page.html",
  styleUrls: ["./lab-oillosses-dashboard.page.scss"],
})
export class LabOillossesDashboardPage implements OnInit {
  @ViewChild("myElementRef", { static: false }) myElementRef: ElementRef;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;
  mill_name = this.nl2br(this.userlist.millname);

  oillossesForm;

  count = 0;
  pendingcount = 0;
  pendingcountlength = 0;

  /*currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");
  currenttime = moment(new Date().toISOString()).format("HH:mm");

  selectoillossesdate = moment(new Date().toISOString()).format("DD-MM-YYYY");
  samplecollectionfromtime = moment(new Date().toISOString()).format("HH:mm");*/

  currentdate = new Date().toISOString();
  currenttime = new Date().toISOString();

  // Variables
  showFlag = false;
  oillossalertFlag = false;
  isDisabled = false;

  detailsArr = [];
  pressArr = [];
  pressidArr = [];
  oillossvaluearr = [];

  oillossthreshold_max = "";
  oillossthreshold_min = "";
  oillossalerttitle = "";
  oillossalertmessage = "";
  oermtdflag = 0;
  oeroillossflag = 0;

  getplatform: string;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private alertController: AlertController,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private platform: Platform,
    private appVersion: AppVersion,
    private market: Market,
    private animationCtrl: AnimationController,
    private maintenanceservice: MaintenanceServiceService,
    private screenOrientation: ScreenOrientation
  ) {
    this.oillossesForm = this.fb.group({
      txt_date: new FormControl(this.currentdate),
      txt_fromtime: new FormControl(this.currenttime),
      txt_oer: new FormControl("", Validators.required),
      txt_mtd: new FormControl(""),
      pressRows: this.fb.array([]),
    });

    this.activatedroute.params.subscribe((val) => {
      if (this.platform.is("android")) {
        this.getplatform = "android";
      } else if (this.platform.is("ios")) {
        this.getplatform = "ios";
      }

      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );

      PushNotifications.removeAllDeliveredNotifications();

      this.count = parseInt(localStorage.getItem("badge_count"));
      this.notifi.updateNotification();
      this.updateNotification();
      this.getLiveNotification();
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    const animation: Animation = this.animationCtrl
      .create()
      .addElement(this.myElementRef.nativeElement)
      .duration(1000)
      .fromTo("opacity", "0", "1");

    animation.play();

    this.oillossesForm.controls.txt_oer.setValue("");
    this.oillossesForm.controls.txt_mtd.setValue("");

    (<FormArray>this.oillossesForm.get("pressRows")).clear();

    this.getDetails();
  }

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem("badge_count"));

      this.getMaintenancePendingCount();
    });
  }

  getLiveNotification() {
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        this.updateNotification();
      }
    );
  }

  btn_notification() {
    localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);
  }

  getMaintenancePendingCount() {
    let req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    console.log(req);

    this.commonservice.getmaintenancependingcount(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.pendingcount = resultdata.count;
        this.pendingcountlength = this.pendingcount.toString().length;
      } else {
        this.pendingcount = 0;
        this.pendingcountlength = this.pendingcount.toString().length;
      }
    });
  }

  add() {
    const control = new FormControl(null);
    (<FormArray>this.oillossesForm.get("pressRows")).push(control);
  }

  getDetails() {
    const req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      language: this.languageService.selected,
      id: 0,
    };

    this.maintenanceservice.getOilLossPressDetails(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.oillossalerttitle = resultdata.oillossthreshold_alerttitle;
        this.oillossalertmessage = resultdata.oillossthreshold_alertmessage;
        this.oillossthreshold_max = resultdata.oillossthreshold_max;
        this.oillossthreshold_min = resultdata.oillossthreshold_min;
        this.oermtdflag = resultdata.oermtdflag;
        this.oeroillossflag = resultdata.oeroillossflag;

        this.detailsArr = resultdata.data;

        for (let i = 0; i < this.detailsArr.length; i++) {
          this.pressidArr.push(this.detailsArr[i].pressid);
          this.pressArr.push(this.detailsArr[i].pressname);
        }

        for (let i = 0; i < resultdata.totalpress; i++) {
          //console.log(i);
          this.add();
        }

        this.showFlag = true;
      } else {
        this.oermtdflag = 0;
        this.oeroillossflag = 0;
        this.detailsArr = [];
        this.pressidArr = [];
        this.pressidArr = [];
        this.showFlag = false;
      }
    });
  }

  async showalert() {
    if (this.oeroillossflag == 1) {
      if (this.oillossesForm.valid) {
        //console.log(this.oillossesForm.value.txt_mtd);

        this.oillossvaluearr = [];
        var novalues = 0;
        var pressvalidationflag = 0;

        if (
          this.oillossesForm.value.txt_oer == "" ||
          this.oillossesForm.value.txt_oer == null
        ) {
          this.commonservice.presentToast(
            this.translate.instant("OILLOSSESSREPORT.oermandatory")
          );
          return;
        }

        if (
          (this.oillossesForm.value.txt_mtd == "" ||
            this.oillossesForm.value.txt_mtd == null) &&
          this.oermtdflag == 1
        ) {
          this.commonservice.presentToast(
            this.translate.instant("OILLOSSESSREPORT.mtdmandatory")
          );
          return;
        }

        const rowcontrol = this.oillossesForm.get("pressRows");
        for (let i = 0; i < rowcontrol.length; i++) {
          const controlsub = <FormArray>(
            this.oillossesForm.get(["pressRows", i])
          );

          if (controlsub.value != null && controlsub.value != "") {
            this.oillossvaluearr.push(String(controlsub.value));
            /*if (
            controlsub.value >= this.oillossthreshold_min &&
            controlsub.value <= this.oillossthreshold_max
          ) {
            this.oillossvaluearr.push(String(controlsub.value));
          } else {
            this.oillossalertFlag = true;
            this.oillossvaluearr.push(String(controlsub.value));
          }*/

            if (controlsub.value > 100) {
              pressvalidationflag = 1;
            }
          } else {
            this.oillossvaluearr.push("~");
            novalues = novalues + 1;
          }
        }

        if (rowcontrol.length == novalues) {
          this.commonservice.presentToast(
            this.translate.instant("OILLOSSESSREPORT.mandatory")
          );
          return;
        }

        if (
          this.oillossesForm.value.txt_oer > 100 ||
          pressvalidationflag == 1
        ) {
          this.commonservice.presentToast(
            this.translate.instant("GRADINGHOME.percentagevalidation")
          );
          return;
        }

        if (
          this.oermtdflag == 1 &&
          (this.oillossesForm.value.txt_oer > 100 ||
            this.oillossesForm.value.txt_mtd > 100 ||
            pressvalidationflag == 1)
        ) {
          this.commonservice.presentToast(
            this.translate.instant("GRADINGHOME.percentagevalidation")
          );
          return;
        }

        const alert = await this.alertController.create({
          mode: "md",
          header: "",
          cssClass: "customalertmessagetwobuttons",
          message: this.translate.instant("OILLOSSESSREPORT.savealert"),
          buttons: [
            {
              text: "",
              handler: (cancel) => {},
            },
            {
              text: "",
              handler: () => {
                this.save(1);
              },
            },
          ],
        });

        await alert.present();
      } else {
        this.commonservice.presentToast(
          this.translate.instant("GENERALBUTTON.pleasefilltheform")
        );
      }
    } else {
      if (this.oillossesForm.valid) {
        console.log(this.oillossesForm.value.txt_mtd);

        this.oillossvaluearr = [];
        var novalues = 0;
        var pressvalidationflag = 0;

        const rowcontrol = this.oillossesForm.get("pressRows");
        for (let i = 0; i < rowcontrol.length; i++) {
          const controlsub = <FormArray>(
            this.oillossesForm.get(["pressRows", i])
          );

          if (controlsub.value != null && controlsub.value != "") {
            this.oillossvaluearr.push(String(controlsub.value));

            if (controlsub.value > 100) {
              pressvalidationflag = 1;
            }
          } else {
            this.oillossvaluearr.push("~");
            novalues = novalues + 1;
          }
        }

        if (rowcontrol.length == novalues) {
          if (
            this.oillossesForm.value.txt_oer == "" ||
            this.oillossesForm.value.txt_oer == null
          ) {
            this.commonservice.presentToast(
              this.translate.instant("OILLOSSESSREPORT.oermandatory")
            );
            return;
          }

          if (
            (this.oillossesForm.value.txt_mtd == "" ||
              this.oillossesForm.value.txt_mtd == null) &&
            this.oermtdflag == 1
          ) {
            this.commonservice.presentToast(
              this.translate.instant("OILLOSSESSREPORT.mtdmandatory")
            );
            return;
          }

          if (this.oermtdflag == 0 && this.oillossesForm.value.txt_oer > 100) {
            this.commonservice.presentToast(
              this.translate.instant("GRADINGHOME.percentagevalidation")
            );
            return;
          }

          if (
            this.oermtdflag == 1 &&
            (this.oillossesForm.value.txt_oer > 100 ||
              this.oillossesForm.value.txt_mtd > 100)
          ) {
            this.commonservice.presentToast(
              this.translate.instant("GRADINGHOME.percentagevalidation")
            );
            return;
          }

          const alert = await this.alertController.create({
            mode: "md",
            header: "",
            cssClass: "customalertmessagetwobuttons",
            message: this.translate.instant("OILLOSSESSREPORT.saveoeralert"),
            buttons: [
              {
                text: "",
                handler: (cancel) => {},
              },
              {
                text: "",
                handler: () => {
                  this.save(0);
                },
              },
            ],
          });

          await alert.present();
        } else {
          if (
            this.oillossesForm.value.txt_oer == "" ||
            this.oillossesForm.value.txt_oer == null
          ) {
            this.commonservice.presentToast(
              this.translate.instant("OILLOSSESSREPORT.oermandatory")
            );
            return;
          }

          if (
            (this.oillossesForm.value.txt_mtd == "" ||
              this.oillossesForm.value.txt_mtd == null) &&
            this.oermtdflag == 1
          ) {
            this.commonservice.presentToast(
              this.translate.instant("OILLOSSESSREPORT.mtdmandatory")
            );
            return;
          }

          if (
            this.oermtdflag == 0 &&
            (this.oillossesForm.value.txt_oer > 100 || pressvalidationflag == 1)
          ) {
            this.commonservice.presentToast(
              this.translate.instant("GRADINGHOME.percentagevalidation")
            );
            return;
          }

          if (
            this.oermtdflag == 1 &&
            (this.oillossesForm.value.txt_oer > 100 ||
              this.oillossesForm.value.txt_mtd > 100 ||
              pressvalidationflag == 1)
          ) {
            this.commonservice.presentToast(
              this.translate.instant("GRADINGHOME.percentagevalidation")
            );
            return;
          }

          const alert = await this.alertController.create({
            mode: "md",
            header: "",
            cssClass: "customalertmessagetwobuttons",
            message: this.translate.instant("OILLOSSESSREPORT.savealert"),
            buttons: [
              {
                text: "",
                handler: (cancel) => {},
              },
              {
                text: "",
                handler: () => {
                  this.save(1);
                },
              },
            ],
          });

          await alert.present();
        }
      } else {
        this.commonservice.presentToast(
          this.translate.instant("GENERALBUTTON.pleasefilltheform")
        );
      }
    }
  }

  async thresholdalert(alerttitle, alertmessage) {
    const alert = await this.alertController.create({
      mode: "md",
      header: alerttitle,
      cssClass: "thresholdalertmessage",
      message: alertmessage,
      buttons: [
        {
          text: this.translate.instant("GENERALBUTTON.okay"),
          handler: () => {
            this.save(1);
          },
        },
      ],
    });

    await alert.present();
  }

  save(option) {
    var req;

    let getdate = moment(this.oillossesForm.value.txt_date).format(
      "YYYY-MM-DD"
    );

    if (this.oeroillossflag == 0) {
      if (option == 0) {
        var getmtd = "";

        if (
          this.oillossesForm.value.txt_mtd == "" &&
          this.oillossesForm.value.txt_mtd == null
        ) {
          getmtd = "";
        } else {
          getmtd = this.oillossesForm.value.txt_mtd;
        }

        req = {
          userid: this.userlist.userId,
          millcode: this.userlist.millcode,
          dept_id: this.userlist.dept_id,
          id: 0,
          date: getdate,
          time: "",
          to_time: "",
          oer: this.oillossesForm.value.txt_oer,
          mtd: getmtd,
          pressvalue: this.oillossvaluearr.join(","),
          pressid: this.pressidArr.join(","),
          language: this.languageService.selected,
        };

        console.log(req);

        this.isDisabled = true;

        this.maintenanceservice.saveOilLosses(req).then((result) => {
          var resultdata: any;
          resultdata = result;

          if (resultdata.httpcode == 200) {
            this.oillossesForm.reset();
            this.oillossesForm.controls.txt_oer.setValue("");
            this.oillossesForm.controls.txt_mtd.setValue("");

            this.isDisabled = false;

            this.oillossesForm.controls.txt_date.setValue(this.currentdate);
            this.oillossesForm.controls.txt_fromtime.setValue(this.currenttime);

            this.commonservice.presentToast(
              this.translate.instant("OILLOSSESSREPORT.insertedsuccessfully")
            );

            //this.router.navigate(["/lab-oillosses-list", { reportdate: "" }]);
          } else {
            this.isDisabled = false;

            this.commonservice.presentToast(
              this.translate.instant("OILLOSSESSREPORT.insertedfailed")
            );
          }
        });
      } else {
        let getfromtime = moment(this.oillossesForm.value.txt_fromtime).format(
          "HH:mm"
        );

        req = {
          userid: this.userlist.userId,
          millcode: this.userlist.millcode,
          dept_id: this.userlist.dept_id,
          id: 0,
          date: getdate,
          time: getfromtime,
          to_time: "",
          oer: this.oillossesForm.value.txt_oer,
          mtd: this.oillossesForm.value.txt_mtd,
          pressvalue: this.oillossvaluearr.join(","),
          pressid: this.pressidArr.join(","),
          language: this.languageService.selected,
        };

        console.log(req);

        this.isDisabled = true;

        this.maintenanceservice.saveOilLosses(req).then((result) => {
          var resultdata: any;
          resultdata = result;

          if (resultdata.httpcode == 200) {
            this.oillossesForm.reset();
            this.oillossesForm.controls.txt_oer.setValue("");
            this.oillossesForm.controls.txt_mtd.setValue("");

            this.isDisabled = false;

            this.oillossesForm.controls.txt_date.setValue(this.currentdate);
            this.oillossesForm.controls.txt_fromtime.setValue(this.currenttime);

            this.commonservice.presentToast(
              this.translate.instant("OILLOSSESSREPORT.insertedsuccessfully")
            );

            //this.router.navigate(["/lab-oillosses-list", { reportdate: "" }]);
          } else {
            this.isDisabled = false;

            this.commonservice.presentToast(
              this.translate.instant("OILLOSSESSREPORT.insertedfailed")
            );
          }
        });
      }
    } else {
      let getfromtime = moment(this.oillossesForm.value.txt_fromtime).format(
        "HH:mm"
      );

      req = {
        userid: this.userlist.userId,
        millcode: this.userlist.millcode,
        dept_id: this.userlist.dept_id,
        id: 0,
        date: getdate,
        time: getfromtime,
        to_time: "",
        oer: this.oillossesForm.value.txt_oer,
        mtd: this.oillossesForm.value.txt_mtd,
        pressvalue: this.oillossvaluearr.join(","),
        pressid: this.pressidArr.join(","),
        language: this.languageService.selected,
      };

      console.log(req);

      this.isDisabled = true;

      this.maintenanceservice.saveOilLosses(req).then((result) => {
        var resultdata: any;
        resultdata = result;

        if (resultdata.httpcode == 200) {
          this.oillossesForm.reset();
          this.oillossesForm.controls.txt_oer.setValue("");
          this.oillossesForm.controls.txt_mtd.setValue("");

          this.isDisabled = false;

          this.oillossesForm.controls.txt_date.setValue(this.currentdate);
          this.oillossesForm.controls.txt_fromtime.setValue(this.currenttime);

          this.commonservice.presentToast(
            this.translate.instant("OILLOSSESSREPORT.insertedsuccessfully")
          );

          //this.router.navigate(["/lab-oillosses-list", { reportdate: "" }]);
        } else {
          this.isDisabled = false;

          this.commonservice.presentToast(
            this.translate.instant("OILLOSSESSREPORT.insertedfailed")
          );
        }
      });
    }
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
