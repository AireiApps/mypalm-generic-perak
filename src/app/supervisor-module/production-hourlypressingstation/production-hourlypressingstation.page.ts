import { Component, OnInit } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, AlertController } from "@ionic/angular";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

import { ProductionHourlypressingstationsavePage } from "src/app/supervisor-module/production-hourlypressingstationsave/production-hourlypressingstationsave.page";
import { ProductionHourlpressingstationAlertPage } from "src/app/supervisor-module/production-hourlpressingstation-alert/production-hourlpressingstation-alert.page";

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-production-hourlypressingstation",
  templateUrl: "./production-hourlypressingstation.page.html",
  styleUrls: ["./production-hourlypressingstation.page.scss"],
})
export class ProductionHourlypressingstationPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  pressingstationArr = [];
  pressstationalertArr = [];

  levelArr = [];
  //temperatureArr = [];
  digestordrainoilflowArr = [];
  fiberflowArr = [];
  //hydraulicpressureArr = [];
  //pressureampsArr = [];
  //digestorampsArr = [];

  temperature;
  digestormotoramps;
  level;
  digestordrainoilflow;
  pressmotoramps;
  pressoilflow;
  hydraulicpressure;
  dilutiontemperature;
  pressingstationalertflag = 0;

  recordstatus;
  norecordsflag = false;

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private commonservice: AIREIService,
    private supervisorservice: SupervisorService,
    private screenOrientation: ScreenOrientation
  ) {
    this.activatedroute.params.subscribe((val) => {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );

      this.getPressingStationStatus();
    });
  }

  ngOnInit() {}

  /*ngAfterViewInit(): void {
    this.getPressingStationStatus();
  }

  /*ionViewDidEnter() {
    this.getPressingStationStatus();
  }

  /*getPressStationAlertFlag() {
    const req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getPressSterilizerAlertFlag(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.pressingstationalertflag =
          resultdata.data[0].pressstationalertenableflag;

        if (this.pressingstationalertflag == 1) {
          this.getPressStationAlertData();
        } else {
          this.getPressingStationStatus();
        }
      } else {
        this.pressingstationalertflag = 0;
        this.getPressingStationStatus();
      }
    });
  }

  getPressStationAlertData() {
    const req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getPressStationAlertData(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.pressstationalertArr = resultdata.data;

        this.pressingstationalert();
      } else {
        this.pressstationalertArr = [];
        this.getPressingStationStatus();
      }
    });
  }*/

  getPressingStationStatus() {
    const req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      Screen: "PRESSING",
      language: this.languageService.selected,
    };

    //alert(req);

    this.supervisorservice.getPressingStationStatus(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.pressingstationArr = resultdata.data;

        this.norecordsflag = false;

        //console.log(this.pressingstationArr);
        this.getPercentageValue();
      } else {
        this.pressingstationArr = [];

        this.norecordsflag = true;

        this.getPercentageValue();
      }
    });
  }

  getPercentageValue() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getPercentageValue(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.levelArr = resultdata.data;

        this.getDigestorDrainPipe();
      } else {
        this.levelArr = [];

        this.getDigestorDrainPipe();
      }
    });
  }

  getDigestorDrainPipe() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getDigestorDrainPipeValue(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.digestordrainoilflowArr = resultdata.data;

        this.getFiberFlow();
      } else {
        this.digestordrainoilflowArr = [];

        this.getFiberFlow();
      }
    });
  }

  getFiberFlow() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getFiberFlowValue(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.fiberflowArr = resultdata.data;
      } else {
        this.fiberflowArr = [];
      }
    });
  }

  nodigestorpressalert(value) {
    if (value.digestortitle == "" || value.presstitle == "") {
      let alertmessage = "";

      if (value.digestortitle == "") {
        if (value.presstitle != "") {
          alertmessage =
            this.translate.instant("HOURLYPRESSSTATION.nodigestoralert") +
            value.presstitle +
            this.translate.instant("HOURLYPRESSSTATION.kindlyadd");
        } else {
          alertmessage = this.translate.instant(
            "HOURLYPRESSSTATION.alertmessage"
          );
        }
      } else if (value.presstitle == "") {
        if (value.digestortitle != "") {
          alertmessage =
            this.translate.instant("HOURLYPRESSSTATION.nopressalert") +
            value.digestortitle +
            this.translate.instant("HOURLYPRESSSTATION.addpress");
        } else {
          alertmessage = this.translate.instant(
            "HOURLYPRESSSTATION.alertmessage"
          );
        }
      }

      this.alertController
        .create({
          message: alertmessage,
          cssClass: "customalertmessageonebuttons",
          backdropDismiss: false,
          buttons: [
            {
              text: "",
              handler: () => {},
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    } else {
      let alertmessage =
        value.machine_name +
        this.translate.instant("HOURLYPRESSSTATION.switchon") +
        value.machine_name +
        this.translate.instant("HOURLYPRESSSTATION.tryagain");

      this.alertController
        .create({
          message: alertmessage,
          cssClass: "customalertmessageonebuttons",
          backdropDismiss: false,
          buttons: [
            {
              text: "",
              handler: () => {},
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    }
  }

  async callmodalcontroller(value) {
    const modal = await this.modalController.create({
      component: ProductionHourlypressingstationsavePage,
      componentProps: {
        item: value,
      },
    });

    modal.onDidDismiss().then((modeldata) => {
      this.temperature = String(modeldata["data"]["temperature"]);
      this.digestormotoramps = String(modeldata["data"]["digestormotoramps"]);
      this.level = modeldata["data"]["level"];
      this.digestordrainoilflow = modeldata["data"]["digestordrainoilflow"];
      this.pressmotoramps = String(modeldata["data"]["pressmotoramps"]);
      this.pressoilflow = modeldata["data"]["pressoilflow"];
      this.hydraulicpressure = String(modeldata["data"]["hydraulicpressure"]);
      this.dilutiontemperature = String(
        modeldata["data"]["dilutiontemperature"]
      );
      this.recordstatus = String(modeldata["data"]["recordstatus"]);

      /*alert(
        this.temperature +
          "\n" +
          this.digestormotoramps +
          "\n" +
          this.level +
          "\n" +
          this.digestordrainoilflow +
          "\n" +
          this.pressmotoramps +
          "\n" +
          this.pressoilflow +
          "\n" +
          this.hydraulicpressure +
          "\n" +
          this.recordstatus
      );*/

      if (
        this.temperature &&
        this.digestormotoramps &&
        this.level &&
        this.digestordrainoilflow &&
        this.pressmotoramps &&
        this.pressoilflow &&
        this.hydraulicpressure &&
        this.dilutiontemperature
      ) {
        const index = this.pressingstationArr.findIndex(
          (acc) => acc.machine_id === value.machine_id
        );
        this.pressingstationArr[index].temperature = this.temperature;
        this.pressingstationArr[index].digestormotoramps =
          this.digestormotoramps;
        this.pressingstationArr[index].level = JSON.parse(
          this.level
        ).percentage;
        this.pressingstationArr[index].digestordrainoilflow = JSON.parse(
          this.digestordrainoilflow
        ).digestordrainpipevalue;
        this.pressingstationArr[index].pressmotoramps = this.pressmotoramps;
        this.pressingstationArr[index].pressoilflow = JSON.parse(
          this.pressoilflow
        ).level;
        this.pressingstationArr[index].hydraulicpressure =
          this.hydraulicpressure;
        this.pressingstationArr[index].dilutiontemperature =
          this.dilutiontemperature;
        this.pressingstationArr[index].recordstatus = this.recordstatus;
      }
    });

    return await modal.present();
  }

  async pressingstationalert() {
    const modal = await this.modalController.create({
      component: ProductionHourlpressingstationAlertPage,
      componentProps: {
        item: this.pressstationalertArr,
      },
    });

    modal.onDidDismiss().then((data) => {
      this.getPressingStationStatus();
    });

    return await modal.present();
  }

  parseString(item) {
    return JSON.stringify(item);
  }
}
