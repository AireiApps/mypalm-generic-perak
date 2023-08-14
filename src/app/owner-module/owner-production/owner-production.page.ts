import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { FormBuilder, FormControl } from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { App, AppState } from "@capacitor/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, AlertController, IonList } from "@ionic/angular";
import { OwnerserviceService } from "src/app/services/owner-service/ownerservice.service";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";
import { Platform, Animation, AnimationController } from "@ionic/angular";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

// Custom Datepicker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

import { PressingsterilizerstationImageSliderPage } from "src/app/supervisor-module/pressingsterilizerstation-image-slider/pressingsterilizerstation-image-slider.page";

@Component({
  selector: "app-owner-production",
  templateUrl: "./owner-production.page.html",
  styleUrls: ["./owner-production.page.scss"],
})
export class OwnerProductionPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  mill_name = this.nl2br(this.userlist.millname);
  millcode = this.userlist.millcode;

  productionForm;

  count = 0;

  productioncount = 0;
  productioncountlength = 0;

  maintenancecount = 0;
  maintenancecountlength = 0;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  getFromDate;
  getToDate;
  fromdate = "";
  todate = "";

  historyflag = false;
  norecordsflag = false;
  pleasewaitflag = false;
  getscreenorientation = "landscape";

  productionArr = [
    /*{
      start_time: "19:09:07",
      stop_time: "12:45:40",
      start_date: "30-04-2023",
      stop_date: "02-05-2023",
      startedby: "Suresh",
      alertdata: [
        {
          alerttime: "02-05-2023 10:20",
          station: "Station 1",
          parameters:
            "Sewaktu menjalankan pemeriksaan pada komponen di atas, periksa komponen berikut:\r\nPeriksa keadaan conveyor body untuk sebarang tanda berikut:\r\n - conveyor body untuk sebarang kebocoran\r\n - conveyor body untuk sebarang tanda keretakan, bengkok, dan karat",
          attendedby: "suresh",
          attendedtime: "11:00",
          attendedstatus: 0,
          images: "",
        },
        {
          alerttime: "02-05-2023 11:20",
          station: "Station 2",
          parameters:
            "Sewaktu menjalankan pemeriksaan pada komponen di atas, periksa komponen berikut:\r\nPeriksa keadaan conveyor body untuk sebarang tanda berikut:\r\n - conveyor body untuk sebarang kebocoran\r\n - conveyor body untuk sebarang tanda keretakan, bengkok, dan karat",
          attendedby: "suresh",
          attendedtime: "12:00",
          attendedstatus: 1,
          images:
            "http://demo.mypalm.com.my/java/generic_upload/1014-generic9886-1682898158471.jpg~http://demo.mypalm.com.my/java/generic_upload/1014-generic6405-1682898212726.jpg",
        },
      ],
    },*/
  ];

  getplatform: string;

  constructor(
    private zone: NgZone,
    private languageService: LanguageService,
    private translate: TranslateService,
    private notifi: AuthGuardService,
    private activatedroute: ActivatedRoute,
    public modalController: ModalController,
    private platform: Platform,
    private router: Router,
    private screenOrientation: ScreenOrientation,
    private commonservice: AIREIService,
    private fb: FormBuilder,
    private service: OwnerserviceService
  ) {
    this.getscreenorientation = this.screenOrientation.type;

    this.productionForm = this.fb.group({
      from_date: new FormControl(this.fromdate),
      to_date: new FormControl(this.todate),
    });

    this.screenOrientation.onChange().subscribe(() => {
      this.getscreenorientation = this.screenOrientation.type;
    });

    this.activatedroute.params.subscribe((val) => {
      if (this.platform.is("android")) {
        this.getplatform = "android";
      } else if (this.platform.is("ios")) {
        this.getplatform = "ios";
      }

      if (
        this.screenOrientation.type == "portrait" ||
        this.screenOrientation.type == "portrait-primary" ||
        this.screenOrientation.type == "portrait-secondary"
      ) {
        this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY
        );
      }

      this.getNotificationCount();
    });

    //alert(this.getscreenorientation);
  }

  ngOnInit() {
    App.addListener("appStateChange", (state: AppState) => {
      if (state.isActive == true) {
        if (this.router.url == "/tabs/tabproduction") {
          this.getNotificationCount();
        }
      }
    });
  }

  ngAfterViewInit(): void {}

  ionViewDidEnter() {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    this.getreport();
  }

  ionViewDidLeave() {
    if (
      this.screenOrientation.type == "landscape" ||
      this.screenOrientation.type == "landscape-primary" ||
      this.screenOrientation.type == "landscape-secondary"
    ) {
      this.screenOrientation.unlock();
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );
    }
  }

  btn_notification(value) {
    localStorage.setItem("badge_count", "0");
    //this.router.navigate(["/segregatenotification"]);

    if (value == "Production") {
      this.router.navigate(["/tabs/tabproduction"]);
    } else {
      this.router.navigate(["/tabs/tabmaintenance"]);
    }
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
        // alert('Push received: ' + JSON.stringify(notification));
        this.updateNotification();

        this.getNotificationCount();
      }
    );
  }

  getNotificationCount() {
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
        this.productioncount = resultdata.productioncount;
        this.productioncountlength = this.productioncount.toString().length;

        this.maintenancecount = resultdata.maintenancecount;
        this.maintenancecountlength = this.maintenancecount.toString().length;
      } else {
        this.productioncount = 0;
        this.productioncountlength = this.productioncount.toString().length;

        this.maintenancecount = 0;
        this.maintenancecountlength = this.maintenancecount.toString().length;
      }
    });
  }

  openFromDateTimePicker() {
    DatePicker.present({
      mode: "date",
      format: "dd-MM-yyyy",
      date: this.fromdate,
      max: this.currentdate,
      theme: "dark",
      doneText: this.translate.instant("GENERALBUTTON.done"),
      cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
    }).then(
      (val) => {
        if (val.value) {
          this.fromdate = val.value;
          this.productionForm.controls.from_date.setValue(this.fromdate);
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  openToDateTimePicker() {
    DatePicker.present({
      mode: "date",
      format: "dd-MM-yyyy",
      date: this.todate,
      max: this.currentdate,
      theme: "dark",
      doneText: this.translate.instant("GENERALBUTTON.done"),
      cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
    }).then(
      (val) => {
        if (val.value) {
          this.todate = val.value;
          this.productionForm.controls.to_date.setValue(this.todate);
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  btn_history() {
    this.historyflag = true;

    this.getreport();
  }

  getreport() {
    if (this.fromdate != "" && this.todate != "") {
      this.getFromDate = moment(this.fromdate, "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      this.getToDate = moment(this.todate, "DD-MM-YYYY").format("YYYY-MM-DD");
    } else {
      this.getFromDate = "";
      this.getToDate = "";
    }

    this.productionArr = [];
    this.norecordsflag = false;
    this.pleasewaitflag = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      Fromdate: this.getFromDate,
      Todate: this.getToDate,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.getProductionData(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (this.getFromDate == "" && this.getToDate == "") {
        this.fromdate = moment(resultdata.fromdate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );

        this.productionForm.controls.from_date.setValue(this.fromdate);

        this.todate = moment(resultdata.todate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );

        this.productionForm.controls.to_date.setValue(this.todate);
      }

      if (resultdata.httpcode == 200) {
        this.productionArr = resultdata.data;

        if (this.productionArr.length > 0) {
          let eachArr = [];

          for (let i = 0; i < this.productionArr.length; i++) {
            let eachalertArr = [];
            if (this.productionArr[i].alertdata.length) {
              let alertdata = this.productionArr[i].alertdata;

              for (let j = 0; j < alertdata.length; j++) {
                let eachalertitem = alertdata[j];

                let eachalertreq = {
                  alerttime: eachalertitem.alerttime,
                  station: eachalertitem.station,
                  parameters: this.nl2br(eachalertitem.parameters),
                  attendedby: eachalertitem.attendedby,
                  attendedtime: eachalertitem.attendedtime,
                  attendedstatus: eachalertitem.attendedstatus,
                  remarks: eachalertitem.remarks,
                  images: eachalertitem.images,
                };

                eachalertArr.push(eachalertreq);
              }
            }

            let eachitem = this.productionArr[i];
            let eachreq = {
              start_date: eachitem.start_date,
              stop_date: eachitem.stop_date,
              startedby: eachitem.startedby,
              alertdata: eachalertArr,
            };

            eachArr.push(eachreq);
          }

          this.productionArr = eachArr;
        }

        this.norecordsflag = false;

        this.pleasewaitflag = false;
      } else {
        this.productionArr = [];
        this.norecordsflag = true;
        this.pleasewaitflag = false;
      }
    });
  }

  async btn_ViewImages(images) {
    if (images != "") {
      const modal = await this.modalController.create({
        component: PressingsterilizerstationImageSliderPage,
        componentProps: {
          from: "Alert",
          alertitem: images,
        },
      });

      modal.onDidDismiss().then((data) => {
        /*this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.LANDSCAPE
        );*/
      });

      return await modal.present();
    }
  }

  goBack() {
    this.historyflag = false;

    this.getreport();
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
