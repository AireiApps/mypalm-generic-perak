import { Component, OnInit } from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AIREIService } from "src/app/api/api.service";
import { MaintenanceServiceService } from "../../services/maintenance-serivce/maintenance-service.service";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { FormBuilder, FormControl } from "@angular/forms";
import { LanguageService } from "src/app/services/language-service/language.service";
@Component({
  selector: "app-lab-oillossesreport",
  templateUrl: "./lab-oillossesreport.page.html",
  styleUrls: ["./lab-oillossesreport.page.scss"],
})
export class LabOillossesreportPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  oillossesForm;

  currentdate = new Date().toISOString();

  getDate;
  reportdate = "";
  monthlyaverage = "";
  mtd = "";
  oillossesArr = [];
  retrieveflag = false;
  norecordsflag = false;
  pleasewaitflag = false;

  constructor(
    private languageService: LanguageService,
    private activatedroute: ActivatedRoute,
    private screenOrientation: ScreenOrientation,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private service: MaintenanceServiceService
  ) {
    this.oillossesForm = this.fb.group({
      pickdate: new FormControl(""),
    });

    this.activatedroute.params.subscribe((val) => {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );

      this.getreport();
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    //this.getreport();
  }

  ngOnDestroy() {
    this.screenOrientation.unlock();
    this.screenOrientation.lock(
      this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
    );
  }

  btn_retrieve() {
    this.retrieveflag = true;

    this.getreport();
  }

  getreport() {
    if (this.reportdate != "") {
      if (this.retrieveflag) {
        this.oillossesForm.controls.pickdate.setValue(this.reportdate);

        this.getDate = moment(this.oillossesForm.value.pickdate).format(
          "YYYY-MM"
        );
      } else {
        this.getDate = "";
      }
    } else {
      this.getDate = "";
    }

    this.oillossesArr = [];
    this.norecordsflag = false;
    this.pleasewaitflag = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      Fromdate: this.getDate,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getoillossesreport(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      this.reportdate = resultdata.Fromdate;
      if (resultdata.httpcode == 200) {
        this.monthlyaverage = resultdata.monthlyaverage;
        this.mtd = resultdata.mtd;
        this.oillossesArr = resultdata.data;

        this.norecordsflag = false;

        this.pleasewaitflag = false;
      } else {
        this.monthlyaverage = "";
        this.mtd = "";
        this.oillossesArr = [];
        this.norecordsflag = true;
        this.pleasewaitflag = false;
        //this.commonservice.presentToast("No Record Found!");
      }
    });
  }

  goBack() {
    this.retrieveflag = false;

    this.getreport();
  }
}
