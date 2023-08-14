import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { appsettings } from "src/app/appsettings";
import { AIREIService } from "src/app/api/api.service";

@Injectable({
  providedIn: "root",
})
export class OwnerserviceService {
  constructor(
    public httpClient: HttpClient,
    private commonservice: AIREIService
  ) {}

  formParams(params) {
    let postData = new FormData();
    if (params) {
      for (let k in params) {
        postData.append(k, params[k]);
      }
    }
    return postData;
  }

  getStationList(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.stationlist;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //this.commonservice.dimmissLoading();
          console.log(data);
          resolve(data);
        },
        (error) => {
          //this.commonservice.dimmissLoading();
          console.log(error);

          reject(error);
        }
      );
    });
  }

  getProductionStartStopStatus(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getproductionstartstopstatus;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //this.commonservice.dimmissLoading();
          //console.log(data);
          resolve(data);
        },
        (error) => {
          //this.commonservice.dimmissLoading();
          //console.log(error);

          reject(error);
        }
      );
    });
  }

  getProductionStaions(params) {
    if (
      params.designationid != 1 &&
      params.designationid != 12 &&
      params.designationid != 13 &&
      params.designationid != 14
    ) {
      this.commonservice.startLoading();
    }

    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getproductionstations +
      "?" +
      "millcode=" +
      params.millcode +
      "&" +
      "userid=" +
      params.userid +
      "&" +
      "departmentid=" +
      params.departmentid +
      "&" +
      "designationid=" +
      params.designationid +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          if (
            params.designationid != 1 &&
            params.designationid != 12 &&
            params.designationid != 13 &&
            params.designationid != 14
          ) {
            this.commonservice.stopLoading();
          }
          console.log(data);
          resolve(data);
        },
        (error) => {
          if (
            params.designationid != 1 &&
            params.designationid != 12 &&
            params.designationid != 13 &&
            params.designationid != 14
          ) {
            this.commonservice.stopLoading();
          }

          console.log(error);

          reject(error);
        }
      );
    });
  }

  getMaintenanceData(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.ownermaintenancedata +
      "?" +
      "millcode=" +
      params.millcode +
      "&" +
      "userid=" +
      params.userid +
      "&" +
      "departmentid=" +
      params.departmentid +
      "&" +
      "designationid=" +
      params.designationid +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          console.log(error);

          reject(error);
        }
      );
    });
  }

  getProductionData(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.ownerproductiondata +
      "?" +
      "millcode=" +
      params.millcode +
      "&" +
      "userid=" +
      params.userid +
      "&" +
      "departmentid=" +
      params.departmentid +
      "&" +
      "designationid=" +
      params.designationid +
      "&" +
      "fromdate=" +
      params.Fromdate +
      "&" +
      "todate=" +
      params.Todate +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          console.log(error);

          reject(error);
        }
      );
    });
  }

  getOillossesReportList(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.oillosses_report_list +
      "?" +
      "millcode=" +
      params.millcode +
      "&" +
      "fromdate=" +
      params.Fromdate +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getRoutineStatisticList(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getstationwisepm +
      "?" +
      "userid=" +
      params.userid +
      "&" +
      "millcode=" +
      params.millcode +
      "&" +
      "type=" +
      params.type +
      "&" +
      "fromdate=" +
      params.Fromdate +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getBreakdownStatisticList(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getbreakdown +
      "?" +
      "userid=" +
      params.userid +
      "&" +
      "millcode=" +
      params.millcode +
      "&" +
      "type=" +
      params.type +
      "&" +
      "year=" +
      params.year +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getMachineList(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.machinelist;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //this.commonservice.dimmissLoading();
          console.log(data);
          resolve(data);
        },
        (error) => {
          //this.commonservice.dimmissLoading();
          console.log(error);

          reject(error);
        }
      );
    });
  }

  getMachineRunningHoursList(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.machine_runninghours_list +
      "?" +
      "userid=" +
      params.userid +
      "&" +
      "departmentid=" +
      params.departmentid +
      "&" +
      "design_id=" +
      params.design_id +
      "&" +
      "stationid=" +
      params.stationid +
      "&" +
      "locationid=" +
      params.locationid +
      "&" +
      "millcode=" +
      params.millcode +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getDailylabOillossList(params) {
    //console.log("API:", appsettings.getdailylaboillosslist);
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getdailylaboillosslist +
      "?" +
      "millcode=" +
      params.millcode +
      "&" +
      "fromdate=" +
      params.Fromdate +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getMonthlylabOillossList(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getmonthlylaboillosslist +
      "?" +
      "userid=" +
      params.userid +
      "&" +
      "millcode=" +
      params.millcode +
      "&" +
      "type=" +
      params.type +
      "&" +
      "year=" +
      params.year +
      "&" +
      "pressid=" +
      params.pressid +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }
  getPressMonthlyOillossList(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getpresswiselabaverage +
      "?" +
      "userid=" +
      params.userid +
      "&" +
      "millcode=" +
      params.millcode +
      "&" +
      "year=" +
      params.year +
      "&" +
      "pressid=" +
      params.pressid +
      "&" +
      "language=" +
      params.language;

    console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }
}
