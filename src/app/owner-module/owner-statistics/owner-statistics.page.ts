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
import { MaintenanceServiceService } from "../../services/maintenance-serivce/maintenance-service.service";
import { OwnerserviceService } from "src/app/services/owner-service/ownerservice.service";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexResponsive,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexGrid,
  ApexMarkers,
} from "ng-apexcharts";

export type ChartOptions = {
  chart: ApexChart;
  series: ApexAxisChartSeries | any[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  grid: ApexGrid;
  colors: any[];
  labels: any[];
  yaxis: ApexYAxis | ApexYAxis[];
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  markers: ApexMarkers;
  responsive: ApexResponsive[];
};

@Component({
  selector: "app-owner-statistics",
  templateUrl: "./owner-statistics.page.html",
  styleUrls: ["./owner-statistics.page.scss"],
})
export class OwnerStatisticsPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  pressstationreportForm;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");

  getDate;

  reportdate = "";
  reportdate1 = "";
  norecordsflag = false;
  pleasewaitflag = false;

  pressstationhourlyperformanceArr = [];

  yearbreakdown = [
    /*{
      data: {
        values: [null, 50, null, 60, null, 75, 34, 46, 54, 66, 31, 60],
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },*/
  ];

  BreakdwonArr = [];
  RoutineArr = [];
  ReplacementArr = [];
  BreakdownLabel = [];
  BreakdownValues = [];
  RoutineMaintenanceCreatedCount = [];
  RoutineMaintenanceCompletedCount = [];
  RoutineMaintenanceLabel = [];
  ReplacementMaintenanceCreatedCount = [];
  ReplacementMaintenanceCompletedCount = [];
  ReplacementMaintenanceLabel = [];

  public multilineOptions: Partial<ChartOptions>;
  public yearOptions: Partial<ChartOptions>;
  public routinechartOptions: Partial<ChartOptions>;

  routineGetDisable = false;
  replacementGetDisable = false;

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private screenOrientation: ScreenOrientation,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private service: OwnerserviceService
  ) {
    this.pressstationreportForm = this.fb.group({
      pickdate: new FormControl(this.reportdate),
      pickdate1: new FormControl(this.reportdate1),
    });

    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    this.pleasewaitflag = true;

    this.getBreakdownReport();

    this.getRoutineReport();

    this.getReplacementReport();

    this.yearbarchart();

    this.stackedchart();

    this.barchart();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {}

  ionViewDidEnter() {}

  ngOnDestroy() {
    /*this.screenOrientation.unlock();
    this.screenOrientation.lock(
      this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
    );*/
  }

  getBreakdownReport() {
    this.BreakdwonArr = [];
    this.BreakdownValues = [];
    this.BreakdownLabel = [];
    this.norecordsflag = false;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      type: 1,
      year: "",
      language: this.languageService.selected,
    };

    this.service.getBreakdownStatisticList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      console.log(resultdata);

      if (resultdata.httpcode == 200) {
        this.BreakdwonArr = resultdata.data;

        for (let i = 0; i < this.BreakdwonArr.length; i++) {
          //this.BreakdownLabel.push(String(this.BreakdwonArr[i].month));
          this.BreakdownValues.push(this.BreakdwonArr[i].completedcount);
        }

        this.norecordsflag = false;

        this.yearbarchart();
      } else {
        this.RoutineArr = [];

        this.norecordsflag = true;
      }
    });
  }
  getRoutineReport() {
    if (this.reportdate != "") {
      this.pressstationreportForm.controls.pickdate.setValue(this.reportdate);
      this.getDate = moment(this.pressstationreportForm.value.pickdate).format(
        "YYYY-MM"
      );
    } else {
      this.getDate = "";
    }

    this.routineGetDisable = true;
    this.clearpreviousdataRoutine();
    this.norecordsflag = false;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      type: 2,
      Fromdate: this.getDate,
      language: this.languageService.selected,
    };

    this.service.getRoutineStatisticList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (this.getDate == "") {
        this.reportdate = resultdata.fromdate;
      }
      if (resultdata.httpcode == 200) {
        this.RoutineArr = resultdata.data;

        for (let i = 0; i < this.RoutineArr.length; i++) {
          this.RoutineMaintenanceLabel.push(this.RoutineArr[i].stationname);
          this.RoutineMaintenanceCompletedCount.push(
            this.RoutineArr[i].completedcount
          );
          this.RoutineMaintenanceCreatedCount.push(
            this.RoutineArr[i].createdcount
          );
        }

        this.norecordsflag = false;

        this.routineGetDisable = false;

        this.stackedchart();
      } else {
        this.RoutineArr = [];

        this.norecordsflag = true;

        this.routineGetDisable = false;
      }
    });
  }

  getReplacementReport() {
    if (this.reportdate1 != "") {
      this.pressstationreportForm.controls.pickdate1.setValue(this.reportdate1);
      this.getDate = moment(this.pressstationreportForm.value.pickdate1).format(
        "YYYY-MM"
      );
    } else {
      this.getDate = "";
    }

    this.replacementGetDisable = true;
    this.clearpreviousdataReplacement();
    this.norecordsflag = false;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      type: 3,
      Fromdate: this.getDate,
      language: this.languageService.selected,
    };

    this.service.getRoutineStatisticList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      console.log("Barchart data:", resultdata);

      if (this.getDate == "") {
        this.reportdate1 = resultdata.fromdate;
      }

      if (resultdata.httpcode == 200) {
        this.ReplacementArr = resultdata.data;

        for (let i = 0; i < resultdata.data.length; i++) {
          this.ReplacementMaintenanceLabel.push(
            this.ReplacementArr[i].stationname
          );
          this.ReplacementMaintenanceCompletedCount.push(
            this.ReplacementArr[i].completedcount
          );
          this.ReplacementMaintenanceCreatedCount.push(
            this.ReplacementArr[i].createdcount
          );
        }
        this.norecordsflag = false;

        this.pleasewaitflag = false;

        this.replacementGetDisable = false;

        this.barchart();
      } else {
        this.norecordsflag = true;

        this.pleasewaitflag = false;

        this.replacementGetDisable = false;

        //this.barchart();
      }
    });
  }

  yearbarchart() {
    this.yearOptions = {
      series: [
        {
          name: this.translate.instant("OWNERSTATISTICS.breakdown"),
          type: "area",
          data: this.BreakdownValues,
          color: "#ffad33",
        },
      ],
      chart: {
        height: 190,
        type: "area",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },

      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          gradientToColors: ["#FDD835"],
          stops: [0, 80, 100],
        },
      },

      markers: {
        size: 1,
      },

      yaxis: [
        {
          title: {
            text: this.translate.instant(
              "OWNERSTATISTICS.numberofcorrectivemaintenance"
            ),
            style: {
              fontSize: "7px",
              color: "#ffffff",
            },
          },
          labels: {
            style: {
              colors: "white",
            },
          },
        },
      ],
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        title: {
          text: this.translate.instant("OWNERSTATISTICS.month"),
          style: {
            fontSize: "7px",
            color: "#ffffff",
          },
        },
        labels: {
          rotate: -45,
          style: {
            colors: "white",
            fontSize: "7px",
          },
        },
      },

      legend: {
        labels: {
          colors: "white",
        },
      },

      tooltip: {
        shared: true,
        intersect: false,
      },
    };
  }
  stackedchart() {
    this.routinechartOptions = {
      series: [
        {
          name: this.translate.instant("OWNERSTATISTICS.created"),
          data: this.RoutineMaintenanceCreatedCount, //this.createdcount,
          color: "rgb(203, 67, 53)",
        },
        {
          name: this.translate.instant("OWNERSTATISTICS.completed"),
          data: this.RoutineMaintenanceCompletedCount, // this.completedcount,
          color: "rgb(0, 128, 0)",
        },
      ],
      chart: {
        type: "bar",
        height: 200,
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        title: {
          text: this.translate.instant(
            "OWNERSTATISTICS.numberofpreventivemaintenance"
          ),
          style: {
            fontSize: "7px",
            color: "#ffffff",
          },
        },
        labels: {
          style: {
            colors: "white",
          },
        },
      },

      xaxis: {
        categories: this.RoutineMaintenanceLabel,
        title: {
          text: this.translate.instant("OWNERSTATISTICS.station"),
          style: {
            fontSize: "7px",
            color: "#ffffff",
          },
        },
        labels: {
          rotate: -45,
          style: {
            colors: "white",
            fontSize: "7px",
          },
        },
      },

      legend: {
        position: "top",
        labels: {
          colors: "#FFFFFF",
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    };
  }

  barchart() {
    this.multilineOptions = {
      series: [
        {
          name: this.translate.instant("OWNERSTATISTICS.created"),
          data: this.ReplacementMaintenanceCreatedCount,
          color: "rgb(203, 67, 53)",
        },
        {
          name: this.translate.instant("OWNERSTATISTICS.completed"),
          data: this.ReplacementMaintenanceCompletedCount,
          color: "rgb(0, 128, 0)",
        },
      ],
      chart: {
        type: "bar",
        height: 200,
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 5,
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        title: {
          text: this.translate.instant(
            "OWNERSTATISTICS.numberofpreventivemaintenance"
          ),
          style: {
            fontSize: "7px",
            color: "#ffffff",
          },
        },

        labels: {
          style: {
            colors: "white",
          },
        },
      },
      xaxis: {
        categories: this.ReplacementMaintenanceLabel,
        title: {
          text: this.translate.instant("OWNERSTATISTICS.station"),
          style: {
            fontSize: "7px",
            color: "#ffffff",
          },
        },
        labels: {
          rotate: -45,
          style: {
            colors: "white",
            fontSize: "7px",
          },
        },
      },

      legend: {
        position: "top",
        labels: {
          colors: "#FFFFFF",
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    };
  }

  clearpreviousdataRoutine() {
    this.RoutineMaintenanceCompletedCount = [];
    this.RoutineMaintenanceCreatedCount = [];
    this.RoutineMaintenanceLabel = [];
    this.RoutineArr = [];
  }

  clearpreviousdataReplacement() {
    this.ReplacementMaintenanceCompletedCount = [];
    this.ReplacementMaintenanceCreatedCount = [];
    this.ReplacementMaintenanceLabel = [];
    this.ReplacementArr = [];
  }
}
