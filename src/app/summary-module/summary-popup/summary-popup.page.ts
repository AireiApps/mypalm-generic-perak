import { Component, OnInit, ViewChild } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { Platform, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

@Component({
  selector: "app-summary-popup",
  templateUrl: "./summary-popup.page.html",
  styleUrls: ["./summary-popup.page.scss"],
})
export class SummaryPopupPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  title = "";
  buttonname = "";
  getplatform: string;

  summaryArr = [
    /*{
      mill_start_date: "13-04-2023",
      mill_stop_time: "",
      grading: [
        {
          loadreceiveddata: "-",
          parameters: [
            {
              title: "Hard Bunches(%)",
              average: "-",
            },
            {
              title: "Under Ripe Bunches(%)",
              average: "-",
            },
            {
              title: "Overall Ripeness(%)",
              average: "-",
            },
            {
              title: "Overdue(%)",
              average: "-",
            },
            {
              title: "Loose Fruits(%)",
              average: "-",
            },
          ],
          loadreceivedtitle: "No of loads received for the day",
        },
      ],
      production: [
        {
          sterilizerdata: [
            {
              title: "No of cycles completed",
              data: "10",
            },
          ],
          pressoillosses: [
            {
              title: "Press No 1",
              data: "4.5",
            },
            {
              title: "Press No 2",
              data: "4.5",
            },
            {
              title: "Press No 3",
              data: "4.5",
            },
          ],
        },
      ],
      breakdownflag: 1,
      millstopdatetime: "",
      title: "Status of data update for 15-04-2023",
      millstartdatetime: "13-04-2023 12:44",
      mill_stop_date: "",
      buttonname: "Acknowledge",
      mill_start_time: "12:44",
      maintenance: [
        {
          title: "Corrective",
          created: 1,
          completed: 0,
        },
        {
          title: "Routine Preventive",
          created: 11,
          completed: 0,
        },
        {
          title: "Replacement Preventive",
          created: 0,
          completed: 0,
        },
      ],
      status: "1",
    },*/
  ];

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    public modalController: ModalController,
    private platform: Platform,
    private commonservice: AIREIService
  ) {
    if (this.platform.is("android")) {
      this.getplatform = "android";
    } else if (this.platform.is("ios")) {
      this.getplatform = "ios";
    }
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getSummary();
  }

  getSummary() {
    let req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      designationid: this.userlist.desigId,
      departmentid: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    console.log(req);

    this.commonservice.getsummarypopup(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.summaryArr = resultdata.data;
        this.title = resultdata.data[0].title;
        console.log(this.title);
        this.buttonname = resultdata.data[0].buttonname;
      } else {
        this.summaryArr = [];
        this.buttonname = this.translate.instant("SUMMARYPOPUP.acknowledge");
      }
    });
  }

  acknowledge() {
    let req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.commonservice.updatesummarypopup(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.btn_close();
      } else {
        this.commonservice.presentToast(
          this.translate.instant("SUMMARYPOPUP.acknowledgementfailed")
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
}
