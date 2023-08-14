import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { App, AppState } from "@capacitor/core";
import { AIREIService } from "src/app/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, AlertController } from "@ionic/angular";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

import { PressingsterilizerstationImageSliderPage } from "src/app/supervisor-module/pressingsterilizerstation-image-slider/pressingsterilizerstation-image-slider.page";

@Component({
  selector: "app-segregatenotificationalerts",
  templateUrl: "./segregatenotificationalerts.page.html",
  styleUrls: ["./segregatenotificationalerts.page.scss"],
})
export class SegregatenotificationalertsPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  departmentid = this.userlist.dept_id;
  designationid = this.userlist.desigId;

  todaysnotificationArr = [];
  oldernotificationArr = [];

  todaysnotificationcount = 0;
  oldernotificationcount = 0;

  todaysnotificationflag = false;
  oldernotificationflag = false;

  todaysnotificationclick = 0;
  oldernotificationclick = 0;

  filterstatus = 4;
  enableflag = false;
  isDisable = false;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private service: AIREIService,
    private activatedroute: ActivatedRoute,
    private alertController: AlertController,
    public modalController: ModalController,
    private router: Router,
    private location: Location
  ) {
    this.activatedroute.params.subscribe((val) => {
      if (this.designationid == "2") {
        this.getalert();
      } else {
        this.getNotification();
      }
    });
  }

  ngOnInit() {
    App.addListener("appStateChange", (state: AppState) => {
      if (state.isActive == true) {
        //this.getNotification();
        //this.router.navigate(["/segregatenotification"]);
        if (this.router.url == "/segregatenotificationalerts") {
          this.reloadCurrentPage();
        }
      }
    });
    //this.getNotification();
  }

  ngAfterViewInit(): void {
    //this.getNotification();
  }

  ionViewDidEnter() {
    if (this.designationid == "2") {
      this.getalert();
    } else {
      this.getNotification();
    }
  }

  reloadCurrentPage() {
    let currentUrl = this.router.url;

    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  geBorderColor(value) {
    let color;

    if (value == "") {
      color = "#ffffff";
    }

    // Sterilizer
    if (value == "1") {
      color = "#FF9800";
    }

    // Press
    if (value == "2") {
      color = "#03A9F4";
    }

    // Oil loss
    if (value == "3") {
      color = "#F44336";
    }

    // Grading
    if (value == "4") {
      color = "#4CAF50";
    }

    return color;
  }

  getBackgroundColor(value) {
    //console.log(value);

    let color;

    if (value == "") {
      color = "#ffffff";
    }

    // Sterilizer
    if (value == "1") {
      color = "#FFF3E0";
    }

    // Press
    if (value == "2") {
      color = "#E1F5FE";
    }

    // Oil loss
    if (value == "3") {
      color = "#FFEBEE";
    }

    // Grading
    if (value == "4") {
      color = "#E8F5E9";
    }

    return color;
  }

  getTextColor(value) {
    let color;

    color = "#ffffff";

    return color;
  }

  gettodaysnotification() {
    if (this.todaysnotificationclick == 0) {
      this.todaysnotificationclick = 1;
    } else {
      this.todaysnotificationclick = 0;
    }
    this.oldernotificationclick = 0;

    if (this.todaysnotificationclick == 1) {
      this.todaysnotificationflag = true;
    } else {
      this.todaysnotificationflag = false;
    }
    this.oldernotificationflag = false;
  }

  getoldernotification() {
    this.todaysnotificationclick = 0;
    if (this.oldernotificationclick == 0) {
      this.oldernotificationclick = 1;
    } else {
      this.oldernotificationclick = 0;
    }

    this.todaysnotificationflag = false;
    if (this.oldernotificationclick == 1) {
      this.oldernotificationflag = true;
    } else {
      this.oldernotificationflag = false;
    }
  }

  getalert() {
    const req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      millcode: this.userlist.millcode,
      filter: "4",
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.getalertnotification(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.todaysnotificationcount = resultdata.todaycount;
        this.oldernotificationcount = resultdata.oldercount;

        this.todaysnotificationArr = resultdata.data.today;
        this.oldernotificationArr = resultdata.data.older;

        if (this.todaysnotificationArr.length > 0) {
          let eachArr = [];

          for (let i = 0; i < this.todaysnotificationArr.length; i++) {
            let eachitem = this.todaysnotificationArr[i];
            let eachreq = {
              redirect: eachitem.redirect,
              rectify_status: eachitem.rectify_status,
              notification_date: eachitem.notification_date,
              rectify_remarks: eachitem.rectify_remarks,
              id: eachitem.id,
              baseid: eachitem.baseid,
              title: eachitem.title,
              notification_text: this.nl2br(eachitem.notification_text),
              status: eachitem.status,
              type: eachitem.type,
              images: eachitem.images,
            };

            eachArr.push(eachreq);
          }

          this.todaysnotificationArr = eachArr;
        }

        if (this.oldernotificationArr.length > 0) {
          let eachArr = [];

          for (let i = 0; i < this.oldernotificationArr.length; i++) {
            let eachitem = this.oldernotificationArr[i];
            let eachreq = {
              redirect: eachitem.redirect,
              rectify_status: eachitem.rectify_status,
              notification_date: eachitem.notification_date,
              rectify_remarks: eachitem.rectify_remarks,
              id: eachitem.id,
              baseid: eachitem.baseid,
              title: eachitem.title,
              notification_text: this.nl2br(eachitem.notification_text),
              status: eachitem.status,
              type: eachitem.type,
              images: eachitem.images,
            };

            eachArr.push(eachreq);
          }

          this.oldernotificationArr = eachArr;
        }

        this.enableflag = false;
      } else {
        this.todaysnotificationcount = 0;
        this.oldernotificationcount = 0;

        this.todaysnotificationArr = [];
        this.oldernotificationArr = [];

        this.enableflag = true;
      }
    });
  }

  getNotification() {
    const req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      filter: this.filterstatus,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getsegregatenotification(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.todaysnotificationcount = resultdata.todaycount;
        this.oldernotificationcount = resultdata.oldercount;

        this.todaysnotificationArr = resultdata.data.today;
        this.oldernotificationArr = resultdata.data.older;

        this.enableflag = false;
      } else {
        this.todaysnotificationcount = 0;
        this.oldernotificationcount = 0;

        this.todaysnotificationArr = [];
        this.oldernotificationArr = [];

        this.enableflag = true;
      }
    });
  }

  btn_rectify(value) {
    this.save("", "1", value.baseid, value.id, value.type);
  }

  btn_notrectify(value) {
    //let alertmessage = "Please enter Reason for Breakdown and Balance Crop";
    let alertmessage = this.translate.instant("ALERTACKNOWLEDGE.reasontitle");

    this.alertController
      .create({
        mode: "md",
        header: "",
        message: alertmessage,
        cssClass: "customalertmessagetwobuttons",
        backdropDismiss: false,
        inputs: [
          {
            name: "reason",
            type: "textarea",
            cssClass: "alertinput",
            placeholder: this.translate.instant(
              "ALERTACKNOWLEDGE.reasonplaceholder"
            ),
          },
        ],
        buttons: [
          {
            text: "",
            handler: (cancel) => {
              //console.log("Confirm Cancel");
            },
          },
          {
            text: "",
            handler: (data: any) => {
              if (data.reason != "") {
                this.save(data.reason, "2", value.baseid, value.id, value.type);
              } else {
                this.service.presentToast(
                  this.translate.instant("ALERTACKNOWLEDGE.reasonmandatory")
                );
                return false;
              }
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }

  save(getreason, getrectifystatus, getbaseid, getid, gettype) {
    var req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      baseid: getbaseid,
      id: getid,
      type: gettype,
      rectify_status: getrectifystatus,
      remarks: getreason,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.updatealertnotification(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        this.isDisable = false;

        this.service.presentToast(
          this.translate.instant("ALERTACKNOWLEDGE.acknowledgementsuccess")
        );

        this.getalert();
      } else {
        this.isDisable = false;

        this.service.presentToast(
          this.translate.instant("ALERTACKNOWLEDGE.acknowledgementfailed")
        );
      }
    });
  }

  updateNotification(value) {
    let req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      id: value.id,
      filter: this.filterstatus,
      language: this.languageService.selected,
    };

    //this.callmodalcontroller(value);

    this.service.deletedasboardnotification(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.callmodalcontroller(value);
      } else {
        this.service.presentToast(
          this.translate.instant("SEGREGATENOTIFICATION.message")
        );
      }
    });
  }

  async btn_ViewImages(images) {
    //console.log(images);
    if (images != "") {
      const modal = await this.modalController.create({
        component: PressingsterilizerstationImageSliderPage,
        componentProps: {
          from: "Alert",
          alertitem: images,
        },
      });

      modal.onDidDismiss().then((data) => {});

      return await modal.present();
    }
  }

  async callmodalcontroller(value) {
    if (this.designationid == "2") {
      this.getalert();
    } else {
      this.getNotification();
    }

    if (value.redirect == "HIGH OIL LOSS") {
      this.router.navigate(["/production-oilloss"]);
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  back() {
    this.location.back();
  }
}
