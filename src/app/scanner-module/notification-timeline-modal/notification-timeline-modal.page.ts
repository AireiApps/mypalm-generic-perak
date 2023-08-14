import { Component, OnInit } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import * as moment from "moment";
import { MaintenanceServiceService } from "src/app/services/maintenance-serivce/maintenance-service.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { LanguageService } from "src/app/services/language-service/language.service";
import { ModalController, NavParams } from "@ionic/angular";

@Component({
  selector: "app-notification-timeline-modal",
  templateUrl: "./notification-timeline-modal.page.html",
  styleUrls: ["./notification-timeline-modal.page.scss"],
})
export class NotificationTimelineModalPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  today = new Date().toISOString();
  startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  mainenance_notification_no = "";
  historyForm;
  historyList = [
    // {
    //   date: "03-11-2022",
    //   insertuser: "1",
    //   runninghours: "",
    //   heading: "Yesterday",
    //   time:"19:30",
    //   username: "Fitter",
    //   assigned: "",
    //   id: "161",
    //   insertby: "17",
    //   content: "Created Maintenance Notification",
    //   status: "1",
    //   frequency: ""
    // },
    // {
    //   date: "03-11-2022",
    //   insertuser: "1",
    //   runninghours: "",
    //   heading: "Yesterday",
    //   time:"20:16",
    //   username: "Salleh",
    //   assigned: "Fitter",
    //   id: "163",
    //   insertby: "7",
    //   content: "Updated maintenance notification and assigned work order to",
    //   status: "10",
    //   frequency: ""
    // }
  ];
  stationid = "";
  equipmentid = "";
  partid = "";
  params;
  enableflag = false;
  notificationid = "";

  constructor(
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    private maintenanceservice: MaintenanceServiceService,
    private commonservice: AIREIService,
    public modalController: ModalController,
    public navParams: NavParams
  ) {
    /*this.stationid = navParams.get("station_id");
      this.equipmentid = navParams.get("equipment_id");
      this.partid = navParams.get("part_id");*/

    let viewform = navParams.get("item");

    this.params = JSON.parse(viewform);
    this.notificationid = this.params.id;
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.callAPI();
  }

  callAPI() {
    this.getNotificationHistory();
  }

  getStatusColor(type) {
    let color;

    if (type == "1") {
      color = "#F9D6D2";
    } else if (type == "2") {
      color = "#ffffcc";
    } else if (type == "3") {
      color = "#d4e9f7";
    } else if (type == "4") {
      color = "#eadcef";
    } else if (type == "5") {
      color = "#fcebcf";
    } else if (type == "6") {
      color = "#f5d6d6";
    } else if (type == "7") {
      color = "#d2f9f1";
    } else if (type == "8") {
      color = "#e6e6e6";
    } else if (type == "9") {
      color = "#f9d6d2";
    } else if (type == "10") {
      color = "#fad1eb";
    } else {
      color = "#ededed";
    }
    return color;
  }

  getBorderColor(type) {
    let color;

    if (type == "1") {
      color = "#e74c3c";
    } else if (type == "2") {
      color = "#ffff00";
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

  getNotificationHistory() {
    var req = {
      userId: this.userlist.userId,
      millcode: this.userlist.millcode,
      id: this.notificationid,
      language: this.languageService.selected,
    };

    console.log(req);

    this.maintenanceservice
      .getNotificationTimelineScanDetails(req)
      .then((result) => {
        var resultdata: any;
        resultdata = result;
        if (resultdata.httpcode == 200) {
          this.historyList = resultdata.data.details;
          this.mainenance_notification_no = resultdata.data.notificationno;
          this.enableflag = false;
        } else {
          this.historyList = [];
          this.enableflag = true;
        }
      });
  }
  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }
}
