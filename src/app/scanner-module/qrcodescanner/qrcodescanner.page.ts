import { Component, OnInit, NgZone } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { FormControl, FormBuilder, Validators } from "@angular/forms";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
import { MaintenanceServiceService } from "src/app/services/maintenance-serivce/maintenance-service.service";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";
import { ModalController } from "@ionic/angular";

// Modal-Start
import { NotificationListModalPage } from "src/app/scanner-module/notification-list-modal/notification-list-modal.page";
import { NotificationFormHistoryModalPage } from "src/app/scanner-module/notification-form-history-modal/notification-form-history-modal.page";
import { NotificationTimelineModalPage } from "src/app/scanner-module/notification-timeline-modal/notification-timeline-modal.page";
// Modal-End

const { PushNotifications } = Plugins;

import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: "app-qrcodescanner",
  templateUrl: "./qrcodescanner.page.html",
  styleUrls: ["./qrcodescanner.page.scss"],
})
export class QrcodescannerPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  millcode = this.userlist.millcode;
  userdesignation = this.userlist.desigId;
  oillossnotificationflag = this.userlist.oilloss_notification_flag;

  uiEnable = false;

  qrcode;
  departmentid = "";
  stationid = "";
  equipmentid = "";
  partid = "";
  barcodelength = 0;
  count = 0;
  historyForm;
  stationname = "";
  machineryname = "";
  historyList = [];
  tabs_segment;
  enableflag = false;

  segment = "";
  statusArr = [];
  mill_name = this.nl2br(this.userlist.millname);

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private zone: NgZone,
    private commonservice: AIREIService,
    private route: ActivatedRoute,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    private notifi: AuthGuardService,
    private maintenanceservice: MaintenanceServiceService,
    private fb: FormBuilder,
    public modalController: ModalController
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();
    //this.scanqrcode();
  }

  ionViewWillEnter() {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();
    //this.scanqrcode();
  }

  btn_notification() {
    localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);
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
      }
    );
  }

  scanqrcode() {
    /*this.uiEnable = true;
    this.stationid = "1";
    this.equipmentid = "3";
    this.partid = "0";

    this.callmodalcontroller(this.stationid, this.equipmentid, this.partid);*/

    this.uiEnable = false;

    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: this.translate.instant("QRCODESCANNER.prompt"),
      resultDisplayDuration: 500,
      formats: "QR_CODE",
      orientation: "portrait",
    };

    this.barcodeScanner
      .scan(options)
      .then((barcodeData) => {
        if (!barcodeData.cancelled) {
          this.qrcode = barcodeData.text;

          var tiltsplit = this.qrcode.split("~");

          this.barcodelength = tiltsplit.length;

          if (tiltsplit.length == 2) {
            var station = tiltsplit[0];
            var equipment = tiltsplit[1];

            var stationhypensplit = station.split("-");
            this.stationid = stationhypensplit[0];

            var equipmenthypensplit = equipment.split("-");
            this.equipmentid = equipmenthypensplit[0];

            this.partid = "0";

            this.callmodalcontroller(
              this.stationid,
              this.equipmentid,
              this.partid
            );
          } else if (tiltsplit.length == 3) {
            var station = tiltsplit[0];
            var equipment = tiltsplit[1];
            var part = tiltsplit[2];

            var stationhypensplit = station.split("-");
            this.stationid = stationhypensplit[0];

            var equipmenthypensplit = equipment.split("-");
            this.equipmentid = equipmenthypensplit[0];

            var parthypensplit = part.split("-");
            this.partid = parthypensplit[0];

            this.callmodalcontroller(
              this.stationid,
              this.equipmentid,
              this.partid
            );
          } else {
            this.uiEnable = false;
            this.commonservice.presentToast(
              this.translate.instant("QRCODESCANNER.notvalidbarcode")
            );
          }
        } else {
          this.uiEnable = false;
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }

  async callmodalcontroller(getstationid, getmachineid, getpartid) {
    const modal = await this.modalController.create({
      component: NotificationListModalPage,
      componentProps: {
        station_id: getstationid,
        machine_id: getmachineid,
        part_id: getpartid,
      },
      showBackdrop: true,
    });

    modal.onDidDismiss().then((data) => {
      //this.ionViewDidEnter();
    });

    return await modal.present();
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
