import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AIREIService } from "src/app/api/api.service";
import {
  AlertController,
  Platform,
  Animation,
  AnimationController,
  ModalController,
  IonSlides,
} from "@ionic/angular";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

import { Market } from "@ionic-native/market/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";

import { WeighbridgeService } from "src/app/services/weighbridge-service/weighbridge.service";
import { WeighbridgeUpdateScreenPage } from "../weighbridge-update-screen/weighbridge-update-screen.page";
import * as moment from "moment";

// Custom Datepicker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

@Component({
  selector: "app-weighbridge-home-screen",
  templateUrl: "./weighbridge-home-screen.page.html",
  styleUrls: ["./weighbridge-home-screen.page.scss"],
})
export class WeighbridgeHomeScreenPage implements OnInit {
  @ViewChild("myElementRef", { static: false }) myElementRef: ElementRef;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;
  mill_name = this.nl2br(this.userlist.millname);

  count = 0;
  pendingcount = 0;
  pendingcountlength = 0;

  pleasewaitflag = false;
  norecordFlag = false;

  getplatform: string;

  weighbridgeArr = [];

  filterTerm: string;

  gradingForm;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");
  reportdate = "";
  getDate;

  newsize;
  newtotalpage;

  constructor(
    private zone: NgZone,
    private translate: TranslateService,
    private languageService: LanguageService,
    private alertController: AlertController,
    private notifi: AuthGuardService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private commonservice: AIREIService,
    private platform: Platform,
    private appVersion: AppVersion,
    private market: Market,
    private screenOrientation: ScreenOrientation,
    private service: WeighbridgeService,
    private animationCtrl: AnimationController,
    public modalController: ModalController,
    private fb: FormBuilder
  ) {
    this.gradingForm = this.fb.group({
      pickdate: new FormControl(this.reportdate),
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

      this.reportdate = "";

      this.getWeighbridgeDetails(true, "0");

      this.ionViewDidEnter();
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    const animation: Animation = this.animationCtrl
      .create()
      .addElement(this.myElementRef.nativeElement)
      .duration(2000)
      .fromTo("transform", "translateX(600px)", "translateX(0px)")
      .fromTo("opacity", "0", "1");

    animation.play();
  }

  ionViewDidEnter() {
    this.forceUpdated();

    this.getPendingCount();
  }

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem("badge_count"));
    });
  }

  getLiveNotification() {
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        this.updateNotification();

        this.getPendingCount();
      }
    );
  }

  btn_notification() {
    localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);
  }

  forceUpdated() {
    var app_version;

    this.appVersion.getVersionNumber().then(
      (versionNumber) => {
        app_version = versionNumber;

        console.log(app_version);

        let req = {
          user_id: this.userlist.userId,
          millcode: this.userlist.millcode,
          dept_id: this.userlist.dept_id,
          language: this.languageService.selected,
        };

        this.commonservice.getSettings(req).then((result) => {
          var resultdata: any;
          resultdata = result;
          let updateVersion = resultdata.appVersion;
          let logout = resultdata.islogOut;

          if (typeof logout !== "undefined" && logout !== null) {
            if (logout == 1) {
              this.notifi.logoutupdateNotification();
              localStorage.clear();
              this.router.navigate(["/login"], { replaceUrl: true });
            } else {
              if (updateVersion > app_version) {
                this.alertForce(updateVersion);
              }
            }
          } else {
            if (updateVersion > app_version) {
              this.alertForce(updateVersion);
            }
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async alertForce(app_version) {
    let alert = await this.alertController.create({
      header: this.translate.instant("FORCEUPDATE.header"),
      backdropDismiss: false,
      message: this.translate.instant("FORCEUPDATE.message") + app_version,
      buttons: [
        {
          text: this.translate.instant("FORCEUPDATE.button"),
          handler: () => {
            let appId;

            if (this.platform.is("android")) {
              appId = "com.airei.milltracking";
            } else {
              appId = "id1534533301";
            }

            this.market
              .open(appId)
              .then((response) => {
                /*this.notifi.logoutupdateNotification();
                localStorage.clear();
                this.router.navigate(["/login"], { replaceUrl: true });*/
              })
              .catch((error) => {
                console.warn(error);
              });
          },
        },
      ],
    });
    alert.present();
  }

  getPendingCount() {
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

  openDateTimePicker() {
    DatePicker.present({
      mode: "date",
      format: "dd-MM-yyyy",
      date: this.reportdate,
      max: this.currentdate,
      theme: "dark",
      doneText: this.translate.instant("GENERALBUTTON.done"),
      cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
    }).then(
      (val) => {
        if (val.value) {
          this.reportdate = val.value;
          this.gradingForm.controls.pickdate.setValue(this.reportdate);
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  getWeighbridgeDetails(pagerefresh: Boolean, pagenum: string) {
    if (this.reportdate != "") {
      this.getDate = moment(this.reportdate, "DD-MM-YYYY").format("YYYY-MM-DD");
    } else {
      this.getDate = "";
    }

    this.pleasewaitflag = true;

    if (pagerefresh == true) {
      this.weighbridgeArr = [];
    } else {
    }

    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      id: 0,
      page: parseInt(pagenum) + 1,
      fromdate: this.getDate,
      todate: this.getDate,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getweighbridgedetails(req).then((result) => {
      let resultdata: any;
      resultdata = result;

      this.newsize = parseInt(resultdata.size);

      this.newtotalpage = resultdata.total_page * this.newsize;

      if (this.getDate == "") {
        this.reportdate = moment(resultdata.Fromdate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );
        this.gradingForm.controls.pickdate.setValue(this.reportdate);
      }
      if (resultdata.httpcode == 200) {
        for (var i = 0; i < resultdata.data.length; i++) {
          this.weighbridgeArr.push(resultdata.data[i]);
        }

        this.pleasewaitflag = false;
        this.norecordFlag = false;
      } else {
        this.pleasewaitflag = false;

        if (this.weighbridgeArr.length > 0) {
          this.norecordFlag = false;
        } else {
          this.norecordFlag = true;
        }
      }
    });
  }

  async btn_update(value) {
    const weighbridgemodal = await this.modalController.create({
      component: WeighbridgeUpdateScreenPage,
      componentProps: {
        item: JSON.stringify(value),
        module: "HOME",
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ["ramppopup-modal"],
    });

    weighbridgemodal.onDidDismiss().then((modeldata) => {
      let getdata = modeldata["data"]["item"];

      if (getdata != "") {
        this.getWeighbridgeDetails(true, "0");
      }
    });

    return await weighbridgemodal.present();
  }

  newpagination(event) {
    setTimeout(() => {
      if (this.weighbridgeArr.length == this.newtotalpage) {
        event.target.complete();
        return;
      }

      event.target.complete();

      var z = Math.ceil(this.weighbridgeArr.length / this.newsize);

      console.log(z);

      if (this.weighbridgeArr.length < this.newtotalpage) {
        this.getWeighbridgeDetails(false, String(z));
      }
    }, 500);
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
