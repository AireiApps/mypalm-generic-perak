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
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
  IonContent,
} from "@ionic/angular";

// Modal-Start
import { NotificationFormHistoryModalPage } from "src/app/scanner-module/notification-form-history-modal/notification-form-history-modal.page";
import { NotificationTimelineModalPage } from "src/app/scanner-module/notification-timeline-modal/notification-timeline-modal.page";
// Modal-End

@Component({
  selector: "app-notification-list-modal",
  templateUrl: "./notification-list-modal.page.html",
  styleUrls: ["./notification-list-modal.page.scss"],
})
export class NotificationListModalPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  millcode = this.userlist.millcode;
  userdesignation = this.userlist.desigId;

  historyForm;

  // Variable
  stationid = "";
  machineid = "";
  partid = "";
  tabs_segment;
  enableflag = false;
  pleasewaitflag = false;

  segment = "";
  stationname = "";
  machineryname = "";
  historyList = [];
  statusArr = [];

  size;
  totalpage;

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private zone: NgZone,
    private commonservice: AIREIService,
    private route: ActivatedRoute,
    private router: Router,
    private notifi: AuthGuardService,
    private maintenanceservice: MaintenanceServiceService,
    private fb: FormBuilder,
    public navParams: NavParams,
    public modalController: ModalController,
    public historymodalController: ModalController,
    public timelinemodalController: ModalController
  ) {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.modalController.getTop().then((modal) => {
        if (modal != null) {
          return;
        } // Don't go back if there's a modal opened
      });
    });

    this.stationid = navParams.get("station_id");
    this.machineid = navParams.get("machine_id");
    this.partid = navParams.get("part_id");

    this.historyForm = this.fb.group({
      select_status: new FormControl(""),
    });

    this.tabs_segment = "Routine Preventive Maintenance";
    this.segment = "RoPM";
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getMaintenanceStatus();
  }

  getBorderColor(type) {
    let color;

    /*if (type == "1") 
    {
      color = "#e74c3c";      
    } else if (type == "2") 
    {
      color = "#ffff00";      
    } else if (type == "3") 
    {
      color = "#3498db";      
    } else if (type == "4") 
    {
      color = "#9b59b6";    
    } else if (type == "5") 
    {
      color = "#f39c12";      
    }
    else if (type == "6") 
    {
      color = "#a52a2a";      
    }else if (type == "7") 
    {
      color = "#1abb9c";      
    }else if (type == "8") 
    {
      color = "#616161";      
    }else if (type == "9") 
    {
      color = "#e74c3c";      
    }else if (type == "10") 
    {
      color = "#c71585";      
    }else{
      color = "#ededed";
    }*/

    //color = "#3cd2a5";
    color = "#ff9f0c";

    return color;
  }

  gettextxolor(type) {
    let color;

    if (type == "1") {
      color = "#e74c3c";
    } else if (type == "2") {
      color = "#000000";
    } else if (type == "3") {
      color = "#3498db";
    } else if (type == "4") {
      color = "#9b59b6";
    } else if (type == "5") {
      color = "#f39c12";
    } else if (type == "6") {
      color = "#a52a2a";
    } else if (type == "7") {
      color = "#1abb9c";
    } else if (type == "8") {
      color = "#616161";
    } else if (type == "9") {
      color = "#e74c3c";
    } else if (type == "10") {
      color = "#c71585";
    } else {
      color = "#ededed";
    }
    return color;
  }

  getMaintenanceStatus() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.maintenanceservice.getMaintenanceStatusList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.statusArr = resultdata.data;

        this.getNotificationHistory(this.segment, true, "0");
      } else {
        this.statusArr = [];

        this.getNotificationHistory(this.segment, true, "0");
      }
    });
  }

  getNotificationHistory(value, pagerefresh: Boolean, pagenum: string) {
    let getstatus = this.historyForm.value.select_status;

    this.enableflag = false;
    this.pleasewaitflag = true;

    if (pagerefresh == true) {
      this.historyList = [];
    } else {
    }

    var req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      stationid: this.stationid,
      equipmentid: this.machineid,
      type: value,
      status: getstatus,
      page: parseInt(pagenum) + 1,
      language: this.languageService.selected,
    };

    console.log("REQ:", req);

    //alert("Parameter --->" + JSON.stringify(req));

    this.maintenanceservice
      .getNotificationHistoryDetails(req)
      .then((result) => {
        var resultdata: any;
        resultdata = result;

        this.size = parseInt(resultdata.size);

        this.totalpage = resultdata.total_page * this.size;

        if (resultdata.httpcode == 200) {
          this.stationname = resultdata.data.stationname;
          this.machineryname = resultdata.data.machineryname;
          //this.historyList = resultdata.data.histoydata;

          if (resultdata.data.histoydata.length > 0) {
            for (var i = 0; i < resultdata.data.histoydata.length; i++) {
              let eachitem = resultdata.data.histoydata[i];
              let eachreq = {
                damage: eachitem.damage,
                date: eachitem.date,
                equipmentid: eachitem.equipmentid,
                equipmentname: eachitem.equipmentname,
                frequency: eachitem.frequency,
                id: eachitem.id,
                notificationno: eachitem.notificationno,
                operationoractivity: eachitem.operationoractivity,
                partdefect: this.nl2br(eachitem.partdefect),
                runninghours: eachitem.runninghours,
                stationid: eachitem.stationid,
                stationname: eachitem.stationname,
                statusId: eachitem.statusId,
                statusName: eachitem.statusName,
              };
              this.historyList.push(eachreq);
            }
          }

          this.enableflag = false;

          this.pleasewaitflag = false;
        } else {
          this.stationname = resultdata.data.stationname;
          this.machineryname = resultdata.data.machineryname;

          if (this.historyList.length > 0) {
            this.enableflag = false;
          } else {
            this.enableflag = true;
          }

          this.pleasewaitflag = false;
        }
      });
  }

  onchagestatus() {
    this.getNotificationHistory(this.segment, true, "0");
  }

  segmentChanged(ev: any) {
    //console.log("Segment changed", ev.detail.value);
    if (ev.detail.value == "Corrective Maintenance") {
      this.segment = "CM";
      this.getNotificationHistory("CM", true, "0");
    }
    if (ev.detail.value == "Routine Preventive Maintenance") {
      this.segment = "RoPM";
      this.getNotificationHistory("RoPM", true, "0");
    }
    if (ev.detail.value == "Replacement Preventive Maintenance") {
      this.segment = "RePM";
      this.getNotificationHistory("RePM", true, "0");
    }
  }

  pagination(event) {
    setTimeout(() => {
      if (this.historyList.length == this.totalpage) {
        event.target.complete();
        return;
      }

      event.target.complete();

      var z = Math.ceil(this.historyList.length / this.size);

      if (this.historyList.length < this.totalpage) {
        this.getNotificationHistory(this.segment, false, String(z));
      }
    }, 500);
  }

  async getmaintenancesummary(value) {
    //console.log(this.segment);

    const historymodal = await this.historymodalController.create({
      component: NotificationFormHistoryModalPage,
      componentProps: {
        item: JSON.stringify(value),
        from: this.segment,
      },
      showBackdrop: true,
    });

    historymodal.onDidDismiss().then((data) => {
      //this.ionViewDidEnter();
    });

    return await historymodal.present();
  }

  async gettimeline(value) {
    const timelinemodal = await this.timelinemodalController.create({
      component: NotificationTimelineModalPage,
      componentProps: {
        item: JSON.stringify(value),
      },
      showBackdrop: true,
    });

    timelinemodal.onDidDismiss().then((data) => {
      //this.ionViewDidEnter();
    });

    return await timelinemodal.present();
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }
}
