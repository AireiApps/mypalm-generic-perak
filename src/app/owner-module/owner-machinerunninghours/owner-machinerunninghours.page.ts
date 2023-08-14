import { Component, OnInit, ViewChild } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import {
  Platform,
  ModalController,
  AlertController,
  IonSelect,
  IonContent,
} from "@ionic/angular";
import { OwnerserviceService } from "src/app/services/owner-service/ownerservice.service";

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-owner-machinerunninghours",
  templateUrl: "./owner-machinerunninghours.page.html",
  styleUrls: ["./owner-machinerunninghours.page.scss"],
})
export class OwnerMachinerunninghoursPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  runninghoursForm;
  params;

  // Variables
  stationArr = [];
  stationid = "";
  stationvalue = "";

  machineArr = [];
  machineid = "";
  machinevalue = "";

  defaultstation = "";
  defaultmachine = "";

  runninghoursArr = [];

  enablemachineFlag = false;
  norecordsflag = false;
  pleasewaitflag = false;

  public stationOptions: any = {
    header: this.translate.instant("MACHINERUNNINGHOURS.station"),
    cssClass: "singleselect",
  };

  public machineOptions: any = {
    header: this.translate.instant("MACHINERUNNINGHOURS.machine"),
    cssClass: "singleselect",
  };

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private router: Router,
    private alertController: AlertController,
    public stationmodalController: ModalController,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private ownerservice: OwnerserviceService
  ) {
    this.runninghoursForm = this.fb.group({
      select_station: new FormControl("", Validators.required),
      select_machine: new FormControl(""),
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getStation();
  }

  getStation() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.ownerservice.getStationList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.stationArr = resultdata.data;

        if (this.stationArr.length > 0) {
          for (let i = 0; i < this.stationArr.length; i++) {
            this.defaultstation =
              this.stationArr[0].station_id +
              "~" +
              this.stationArr[0].station_name;

            break;
          }
        }
      } else {
        this.stationArr = [];
        this.defaultstation = "";
      }
    });
  }

  stationhandleChange(e) {
    let value = e.detail.value;
    if (value.length > 0) {
      //console.log(value);

      var splitdata = value.split("~");

      /*this.stationid = JSON.parse(value).station_id;
      this.stationvalue = JSON.parse(value).station_name;*/

      this.stationid = splitdata[0];
      this.stationvalue = splitdata[1];

      this.runninghoursForm.controls.select_machine.setValue("");
      this.runninghoursArr = [];

      this.getMachine(this.stationid);
    } else {
      this.stationid = "";
      this.stationvalue = "";
    }
  }

  getMachine(getstationid) {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      stationid: getstationid,
      language: this.languageService.selected,
    };

    this.ownerservice.getMachineList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.machineArr = resultdata.data;

        if (this.machineArr.length > 0) {
          for (let i = 0; i < this.machineArr.length; i++) {
            this.defaultmachine =
              this.machineArr[0].location_id +
              "~" +
              this.machineArr[0].location_name;

            this.machineid = this.machineArr[0].location_id;
            this.machinevalue = this.machineArr[0].location_name;

            break;
          }

          this.getreport();
        }

        this.enablemachineFlag = true;
      } else {
        this.machineArr = [];
        this.defaultmachine = "";
        this.enablemachineFlag = false;
      }
    });
  }

  machinehandleChange(e) {
    let value = e.detail.value;
    if (value.length > 0) {
      var splitdata = value.split("~");

      console.log(splitdata);

      /* this.machineid = JSON.parse(value).location_id;
      this.machinevalue = JSON.parse(value).location_name;*/

      this.machineid = splitdata[0];
      this.machinevalue = splitdata[1];

      this.getreport();
    } else {
      this.machineid = "";
      this.machinevalue = "";
    }
  }

  getreport() {
    this.runninghoursArr = [];
    this.norecordsflag = false;
    this.pleasewaitflag = true;

    var req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      stationid: this.stationid,
      locationid: this.machineid,
      millcode: this.userlist.millcode,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.ownerservice.getMachineRunningHoursList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        //console.log("Resuldata:", resultdata);

        this.norecordsflag = false;

        this.runninghoursArr = resultdata.data;

        this.pleasewaitflag = false;
      } else {
        this.runninghoursArr = [];
        this.norecordsflag = true;
        this.pleasewaitflag = false;
        //this.commonservice.presentToast("No Record Found!");
      }
    });
  }

  clear() {
    this.runninghoursForm.controls.select_machine.setValue("");
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  parseString(item) {
    return JSON.stringify(item);
  }
}
