import { Component, OnInit } from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AIREIService } from "src/app/api/api.service";
import { SupervisorService } from "../../services/supervisor-service/supervisor.service";
import { ModalController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { FormBuilder, FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

import { PressingsterilizerstationImageSliderPage } from "src/app/supervisor-module/pressingsterilizerstation-image-slider/pressingsterilizerstation-image-slider.page";

// Custom Datepicker
import { Plugins } from "@capacitor/core";

import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;
import { LanguageService } from "src/app/services/language-service/language.service";

@Component({
  selector: "app-report-pressstationhourlyperformance",
  templateUrl: "./report-pressstationhourlyperformance.page.html",
  styleUrls: ["./report-pressstationhourlyperformance.page.scss"],
})
export class ReportPressstationhourlyperformancePage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  pressstationreportForm;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  getDate;

  reportdate = "";

  norecordsflag = false;
  pleasewaitflag = false;

  pressstationhourlyperformanceArr = [];

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private screenOrientation: ScreenOrientation,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private service: SupervisorService
  ) {
    /*this.reportdate = this.route.snapshot.paramMap.get("reportdate");

    if (this.reportdate == "") {
      this.reportdate = "";
    } else {
      this.reportdate = moment(this.reportdate, "YYYY-MM-DD").format(
        "DD-MM-YYYY"
      );
    }*/

    this.pressstationreportForm = this.fb.group({
      pickdate: new FormControl(this.reportdate),
    });

    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getreport();
  }

  ngOnDestroy() {
    this.screenOrientation.unlock();
    this.screenOrientation.lock(
      this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
    );
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
          this.pressstationreportForm.controls.pickdate.setValue(
            this.reportdate
          );
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  async btn_ViewImages(
    temperatureimages,
    motorimages,
    levelimages,
    digestorimages,
    pressmotorimages,
    fibreflowimages,
    hydraulicpressureimages
  ) {
    if (
      temperatureimages != "" ||
      motorimages != "" ||
      levelimages != "" ||
      digestorimages != "" ||
      pressmotorimages != "" ||
      fibreflowimages != "" ||
      hydraulicpressureimages != ""
    ) {
      /*this.screenOrientation.unlock();
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );*/

      const modal = await this.modalController.create({
        component: PressingsterilizerstationImageSliderPage,
        componentProps: {
          from: "Press",
          temperatureitem: temperatureimages,
          motoritem: motorimages,
          levelitem: levelimages,
          digestoritem: digestorimages,
          pressmotoritem: pressmotorimages,
          fibreflowitem: fibreflowimages,
          hydraulicpressureitem: hydraulicpressureimages,
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

  getreport() {
    if (this.reportdate != "") {
      this.getDate = moment(this.reportdate, "DD-MM-YYYY").format("YYYY-MM-DD");
    } else {
      this.getDate = "";
    }

    this.pressstationhourlyperformanceArr = [];
    this.norecordsflag = false;
    this.pleasewaitflag = true;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      Fromdate: this.getDate,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.getPressStationvalues(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (this.getDate == "") {
        this.reportdate = moment(resultdata.Fromdate, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        );

        this.pressstationreportForm.controls.pickdate.setValue(this.reportdate);
      }

      if (resultdata.httpcode == 200) {
        this.pressstationhourlyperformanceArr = resultdata.data;

        this.norecordsflag = false;

        this.pleasewaitflag = false;
      } else {
        this.pressstationhourlyperformanceArr = [];

        this.norecordsflag = true;

        this.pleasewaitflag = false;
      }
    });
  }
}
