import { Component, OnInit } from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AIREIService } from "src/app/api/api.service";
import { SupervisorService } from "../../services/supervisor-service/supervisor.service";
import { ModalController, Platform } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
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
  selector: "app-owner-oillosses-dataanalysis",
  templateUrl: "./owner-oillosses-dataanalysis.page.html",
  styleUrls: ["./owner-oillosses-dataanalysis.page.scss"],
})
export class OwnerOillossesDataanalysisPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  pressstationreportForm;

  currentdate = moment(new Date().toISOString()).format("DD-MM-YYYY");
  currentyear = moment(new Date().toISOString()).format("YYYY");

  getDate;
  getYear;
  getYear1;
  pressstationreportmonth = "";
  pressstationreportyear = "";
  labreportyear = "";

  selected_qualitycheck_pressstation = "";
  orientation = "";
  getplatform: string;

  pressGetDisable = false;
  presslabGetDisable = false;
  presslaboillossGetDisable = false;

  norecordsflag = false;
  pleasewaitflag = false;

  dailyoillossArr = [];
  dailyoillossLabelArr = [];
  dailyoillossaverageArr = [];
  dailyoillossoer = [];
  dailyoillossbaseline = [];

  monthlyoillossArr = [];
  monthlyoillossLabelArr = [];
  monthlyoillossaverageArr = [];
  monthlyoillossoer = [];

  monthlypresslapgeneralArr = [];
  monthlypresslapLabelArr = [];
  seriesArr = [];
  colorsArr = [
    "#99c2ff",
    "#e96363",
    "#3cd2a5",
    "#f985b0",
    "#a14bc9",
    "#ffad33",
    "#eedf98",
    "#a6ff4d",
    "#fde28c",
    "#99c2ff",
  ];
  overdatalength = 0;
  pressdatalength = 0;
  currentindex = 0;
  //eachArr = [];

  public multilineOptions: Partial<ChartOptions>;
  public linebarOptions: Partial<ChartOptions>;
  public barOptions: Partial<ChartOptions>;

  iconname = "phone-landscape-outline";

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private screenOrientation: ScreenOrientation,
    private fb: FormBuilder,
    private platform: Platform,
    private commonservice: AIREIService,
    private service: OwnerserviceService
  ) {
    this.orientation = this.screenOrientation.type;
    if (this.platform.is("android")) {
      this.getplatform = "android";
    } else if (this.platform.is("ios")) {
      this.getplatform = "ios";
    }

    this.pressstationreportForm = this.fb.group({
      pickpressmonth: new FormControl(this.pressstationreportmonth),
      pickyear: new FormControl(this.currentyear),
      picklabyear: new FormControl(this.labreportyear),
    });
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    this.pleasewaitflag = true;

    this.getPressReport();
    this.getMonthWiseAverage();
    //this.getPressMonthWiseAverage();

    this.mixedchart();
    this.mixedoillosschart();
    //this.mixedlabchart();
  }
  ngOnInit() {}

  ngAfterViewInit(): void {}

  ionViewDidEnter() {}

  ngOnDestroy() {
    // this.screenOrientation.unlock();
    // this.screenOrientation.lock(
    //   this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
    // );
  }

  btn_orientation() {
    if (
      this.screenOrientation.type == "portrait" ||
      this.screenOrientation.type == "portrait-primary" ||
      this.screenOrientation.type == "portrait-secondary"
    ) {
      this.iconname = "phone-portrait-outline";
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE
      );
    } else if (
      this.screenOrientation.type == "landscape" ||
      this.screenOrientation.type == "landscape-primary" ||
      this.screenOrientation.type == "landscape-secondary"
    ) {
      this.iconname = "phone-landscape-outline";
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );
    }
  }

  getPressReport() {
    if (this.pressstationreportmonth != "") {
      this.pressstationreportForm.controls.pickpressmonth.setValue(
        this.pressstationreportmonth
      );
      this.getDate = moment(
        this.pressstationreportForm.value.pickpressmonth
      ).format("YYYY-MM");
    } else {
      this.getDate = "";
    }

    this.pressGetDisable = true;
    this.clearpreviousdataPress();
    this.norecordsflag = false;

    var req = {
      millcode: this.userlist.millcode,
      Fromdate: this.getDate,
      language: this.languageService.selected,
    };

    this.service.getDailylabOillossList(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (this.getDate == "") {
        this.pressstationreportmonth = resultdata.fromdate;
      }

      if (resultdata.httpcode == 200) {
        //console.log(resultdata.data);
        this.dailyoillossArr = resultdata.data;

        for (let i = 0; i < resultdata.data.length; i++) {
          this.dailyoillossLabelArr.push(this.dailyoillossArr[i].date);
          this.dailyoillossaverageArr.push(this.dailyoillossArr[i].labvalue);
          this.dailyoillossoer.push(this.dailyoillossArr[i].oervalue);
          this.dailyoillossbaseline.push(resultdata.oer_baseline);
        }

        this.norecordsflag = false;

        this.pressGetDisable = false;

        this.mixedchart();
      } else {
        this.norecordsflag = true;

        this.pressGetDisable = false;

        //this.barchart();
      }
    });
  }
  getMonthWiseAverage() {
    if (this.pressstationreportyear != "") {
      this.getYear = moment(this.pressstationreportForm.value.pickyear).format(
        "YYYY"
      );
    } else {
      this.getYear = "";
    }

    this.presslabGetDisable = true;
    this.clearpreviousdata();
    this.norecordsflag = false;

    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      type: 1,
      year: this.getYear,
      language: this.languageService.selected,
      pressid: "",
    };

    this.service.getMonthlylabOillossList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (this.getYear == "") {
        this.pressstationreportyear = resultdata.year;
      }

      if (resultdata.httpcode == 200) {
        this.monthlyoillossArr = resultdata.data;

        for (let i = 0; i < resultdata.data.length; i++) {
          this.monthlyoillossLabelArr.push(this.monthlyoillossArr[i].month);
          this.monthlyoillossaverageArr.push(this.monthlyoillossArr[i].oilloss);
          this.monthlyoillossoer.push(this.monthlyoillossArr[i].oerdata);
        }

        this.norecordsflag = false;

        this.pleasewaitflag = false;

        this.presslabGetDisable = false;

        this.mixedoillosschart();
      } else {
        this.norecordsflag = true;

        this.pleasewaitflag = false;

        this.presslabGetDisable = false;

        //this.barchart();
      }
    });
  }
  //This code commented said by veda sir on 19-06-2023
  /*getPressMonthWiseAverage() {
    if (this.labreportyear != "") {
      this.getYear1 = moment(
        this.pressstationreportForm.value.picklabyear
      ).format("YYYY");
    } else {
      this.getYear1 = "";
    }

    this.presslaboillossGetDisable = true;
    this.clearpreviousdataPresslab();
    this.norecordsflag = false;

    this.seriesArr = [];
    var req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      year: this.getYear1,
      language: this.languageService.selected,
      pressid: "",
    };

    this.service.getPressMonthlyOillossList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      console.log(resultdata);

      if (this.getYear1 == "") {
        this.pressstationreportForm.controls.picklabyear.setValue(
          resultdata.year
        );
        this.labreportyear = resultdata.year;
      }

      if (resultdata.httpcode == 200) {
        this.monthlypresslapgeneralArr = resultdata.data;

        for (let i = 0; i < resultdata.data.length; i++) {
          this.monthlypresslapLabelArr.push(
            this.monthlypresslapgeneralArr[i].month
          );
        }
        if (
          this.monthlypresslapgeneralArr.length > 0 &&
          this.monthlypresslapgeneralArr[0].pressvalue.length > 0
        ) {
          this.overdatalength = this.monthlypresslapgeneralArr.length;
          this.pressdatalength =
            this.monthlypresslapgeneralArr[0].pressvalue.length;
          this.currentindex = 0;

          for (let i = 0; i < this.pressdatalength; i++) {
            this.currentindex = i;
            this.seriesArr.push(this.getdata(this.currentindex));
          }
        }
        this.norecordsflag = false;
        this.pleasewaitflag = false;
        this.presslaboillossGetDisable = false;
        this.mixedlabchart();
      } else {
        this.norecordsflag = true;
        this.pleasewaitflag = false;
        this.presslaboillossGetDisable = false;
      }
    });
  }
  getdata(getindex) {
    var pressdataArr;
    let currentpressid = 0;
    let valueArr = [];
    for (let i = 0; i < this.overdatalength; i++) {
      pressdataArr = this.monthlypresslapgeneralArr[i].pressvalue;
      let pressname = pressdataArr[getindex].press;
      let pressid = pressdataArr[getindex].pressid;
      let color = this.colorsArr[getindex];
      if (currentpressid == 0) {
        currentpressid = pressid;
        valueArr.push(pressdataArr[getindex].value);
      } else if (currentpressid == pressid) {
        valueArr.push(pressdataArr[getindex].value);
      }
      if (i == this.overdatalength - 1) {
        let eachreq = {
          name: pressname,
          data: valueArr,
          color: color,
        };
        currentpressid = 0;
        valueArr = [];
        return eachreq;
      }
    }
  }*/
  mixedchart() {
    this.multilineOptions = {
      series: [
        {
          name: "Average Oil Losses (%)",
          data: this.dailyoillossaverageArr,
          color: "#3cd2a5",
          type: "bar",
        },
        {
          name: "OER (%)",
          data: this.dailyoillossoer,
          type: "line",
          color: "#ffad33",
        },
        {
          name: "OER Baseline (%)",
          data: this.dailyoillossbaseline,
          type: "line",
          color: "#fff300",
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

      stroke: {
        width: [2, 5, 1],
        dashArray: [0, 0, 5],
      },

      plotOptions: {
        bar: {
          borderRadius: 1,
          dataLabels: {
            position: "bottom", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: false,
      },

      yaxis: [
        {
          min: 0,
          max: 8,
          tickAmount: 5,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#ffffff",
          },
          labels: {
            // formatter: (value) => {
            //   return value.toFixed(0)
            // },
            style: {
              colors: "#ffffff",
            },
          },
          title: {
            text: "Oil Lossess in Press Machines(%)",
            style: {
              fontSize: "8px",
              color: "#ffffff",
            },
          },
        },
        {
          min: 0,
          max: 24,
          tickAmount: 5,
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#ffffff",
          },
          title: {
            text: "OER(%)",
            style: {
              fontSize: "8px",
              color: "#ffffff",
            },
          },
          labels: {
            style: {
              colors: "#ffffff",
            },
          },
        },
        {
          min: 0,
          max: 24,
          tickAmount: 5,
          opposite: true,
          floating: true,
          axisTicks: {
            show: false,
          },

          axisBorder: {
            show: false,
            color: "#ffffff",
          },

          labels: {
            show: false,
            style: {
              colors: "#ffffff",
            },
          },

          title: {
            text: "OER Baseline(%)",
            style: {
              fontSize: "8px",
              color: "#ffffff",
            },
          },
        },
      ],

      xaxis: {
        categories: this.dailyoillossLabelArr,
        title: {
          text: "Process Date",
          style: {
            fontSize: "8px",
            color: "#ffffff",
          },
        },
        labels: {
          rotate: -90,
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

  mixedoillosschart() {
    this.linebarOptions = {
      series: [
        {
          name: "Average Oil Losses (%)",
          data: this.monthlyoillossaverageArr,
          color: "#3cd2a5",
          type: "bar",
        },
        {
          name: "OER (%)",
          data: this.monthlyoillossoer,
          type: "line",
          color: "#ffad33",
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
      stroke: {
        width: [2, 5, 1],
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
          dataLabels: {
            position: "bottom", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: false,
      },

      yaxis: [
        {
          min: 0,
          max: 8,
          tickAmount: 5,

          axisTicks: {
            show: true,
          },

          axisBorder: {
            show: true,
            color: "#ffffff",
          },

          labels: {
            // formatter: (value) => {
            //   return value.toFixed(0)
            // },
            style: {
              colors: "#ffffff",
            },
          },
          title: {
            text: "Oil Losses(%)",
            style: {
              fontSize: "8px",
              color: "#ffffff",
            },
          },
        },
        {
          min: 0,
          max: 24,
          tickAmount: 5,
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#ffffff",
          },
          labels: {
            // formatter: (value) => {
            //   return value.toFixed(0)
            // },
            style: {
              colors: "#ffffff",
            },
          },
          title: {
            text: "OER(%)",
            style: {
              fontSize: "8px",
              color: "#ffffff",
            },
          },
        },
      ],
      xaxis: {
        categories: this.monthlyoillossLabelArr,
        title: {
          text: "Month",
          style: {
            fontSize: "8px",
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

  mixedlabchart() {
    console.log("Series Arr:", this.seriesArr);
    this.barOptions = {
      series: this.seriesArr,
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
          borderRadius: 1,
          columnWidth: "90%",
        },
      },
      stroke: {
        colors: ["transparent"],
        width: 5,
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#ffffff",
          },
          labels: {
            // formatter: (value) => {
            //   return value.toFixed(0)
            // },
            style: {
              colors: "#ffffff",
            },
          },
          title: {
            text: "Oil Lossess(%)",
            style: {
              fontSize: "8px",
              color: "#ffffff",
            },
          },
        },
      ],

      xaxis: {
        categories: this.monthlypresslapLabelArr,
        title: {
          text: "Month",
          style: {
            fontSize: "8px",
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
  clearpreviousdataPress() {
    this.dailyoillossArr = [];
    this.dailyoillossLabelArr = [];
    this.dailyoillossaverageArr = [];
    this.dailyoillossoer = [];
    this.dailyoillossbaseline = [];
  }
  clearpreviousdata() {
    this.monthlyoillossArr = [];
    this.monthlyoillossLabelArr = [];
    this.monthlyoillossaverageArr = [];
    this.monthlyoillossoer = [];
  }
  clearpreviousdataPresslab() {
    this.monthlypresslapgeneralArr = [];
    this.monthlypresslapLabelArr = [];
    this.seriesArr = [];
    this.overdatalength = 0;
    this.pressdatalength = 0;
    this.currentindex = 0;
  }
  changeorientation() {
    if (
      this.screenOrientation.type == "landscape" ||
      this.screenOrientation.type == "landscape-primary" ||
      this.screenOrientation.type == "landscape-secondary"
    ) {
      this.orientation = "portrait";
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );
    } else {
      this.orientation = "landscape";
      console.log(this.screenOrientation.type);
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY
      );
    }
  }
}
