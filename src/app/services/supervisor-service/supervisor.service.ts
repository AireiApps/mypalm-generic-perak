import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { appsettings } from "src/app/appsettings";
import { timeout } from "rxjs/operators";
import { AIREIService } from "src/app/api/api.service";

@Injectable({
  providedIn: "root",
})
export class SupervisorService {
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

  getBreakdownCodingList(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.breakdowncodinglist;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getMaintenanceTypeList(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.maintenancetypelist;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getDamageList(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.damagelist;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getBreakDownCausesList(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.breakdowncauseslist;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getSequenceNumber(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.sequencenumber;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  saveMaintenanceNotification(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.savemaintenancenotification;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getMaintenanceStatusList(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.maintenancestatuslist;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getNotificationList(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getmaintenancenotificationlist;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getActivityList(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.activitylist;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getCarryOutByList(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.carryoutbylist;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  /*getNotificationView(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getmaintenancenotificationview;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }*/

  getNotificationView(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getmaintenancenotificationview +
      "?" +
      "user_id=" +
      params.user_id +
      "&" +
      "dept_id=" +
      params.dept_id +
      "&" +
      "millcode=" +
      params.millcode +
      "&" +
      "id=" +
      params.id +
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

  getNotificationQRcodeScanDetails(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getnotificationqrcodescandetails;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);

          reject(error);
        }
      );
    });
  }
  getNotificationTimelineScanDetails(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getnotificationtimeline;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);

          reject(error);
        }
      );
    });
  }

  getNotificationListReport(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getmaintenancenotificationlistreport;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getPerformanceDetails(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getdb1performancedetails;
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

  getDB2MonthlyMillPerformanceDetails(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getdb2performancedetails;
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

  saveffbcages(params) {
    /*if (params.isrefresh == "0") {
      this.commonservice.startLoading();
    }*/

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.saveallffbcages;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          /*if (params.isrefresh == "0") {
            this.commonservice.stopLoading();
          }*/
          console.log(data);
          resolve(data);
        },
        (error) => {
          /*if (params.isrefresh == "0") {
            this.commonservice.stopLoading();
          }*/
          console.log(error);

          reject(error);
        }
      );
    });
  }

  startstopProduction(params) {
    this.commonservice.startLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.savestartstopproduction;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          this.commonservice.stopLoading();
          console.log(data);
          resolve(data);
        },
        (error) => {
          this.commonservice.stopLoading();
          console.log(error);

          reject(error);
        }
      );
    });
  }

  startstopProductionStation(params) {
    this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.savestartstopproductionstation;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          this.commonservice.dimmissLoading();
          console.log(data);
          resolve(data);
        },
        (error) => {
          this.commonservice.dimmissLoading();
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

  getMachineStartStopStatus(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getmachinestartstopstatus;
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

  getProductionDashboardDetails(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getproductiondashboarddetails;
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

  saveMachineStatus(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.savemachinestatus;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getPressSterilizerAlertFlag(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getpresssterilizerstationalertflag;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getPressStationAlertData(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getpressingstationalertdata;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getDoorOpenLaterData(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getdooroopenlaterdata;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getSterilizerStationAlertData(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getsterilizerstationalertdata;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getSettings(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.getsettings;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getPressingStationStatus(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getpressingstationstatus;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getPercentageValue(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.getpercentagevalue;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getTemperature(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.gettemperaturevalue;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getDigestorDrainPipeValue(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getdigestordrainpipevalue;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getFiberFlowValue(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.getfiberflowvalue;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getHydraulicPressureValue(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.gethydraulicpressurevalue;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getPressureAmpsValue(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getpressureampsvalue;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getDigestorPressureAmpsValue(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getdigestorpressureampsvalue;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  saveHourlyPressingStation(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.savehourlypressingstation;
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(api, reqOpts)
        .pipe(timeout(15000))
        .subscribe(
          (data) => {
            console.log(data);
            resolve(data);
          },
          (error) => {
            console.log(error);
            if (error.name == "TimeoutError" || error.status == 500) {
              this.commonservice.presentToast("Something went wrong...!");
            }
            reject(error);
          }
        );
    });
  }

  getSterilizerStationStatus(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getsterilizerstationstatus;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  saveHourlySterilizerStation(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.savehourlysterilizerstation;
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(api, reqOpts)
        .pipe(timeout(15000))
        .subscribe(
          (data) => {
            console.log(data);
            resolve(data);
          },
          (error) => {
            console.log(error);
            if (error.name == "TimeoutError" || error.status == 500) {
              this.commonservice.presentToast("Something went wrong...!");
            }
            reject(error);
          }
        );
    });
  }

  getoillossesreport(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.oillossereport;
    console.log(api, reqOpts);
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

  getmachinerierunninghoursvalue(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.get_machineries_running_hour;
    console.log(api, reqOpts);
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

  getsterilizervalue(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.get_sterilizer_hourly_performance_new;
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

  getPressStationvalues(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.get_pressstation_performance_new;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);

          reject(error);
        }
      );
    });
  }

  getCycleNoValue(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.getcycleno;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getLastDoorOpenTime(params) {
    //var newurl = appsettings.chatapi + "?" + "msg=" + params;
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getsterilizerdooropentime +
      "?" +
      "userid=" +
      params.userid +
      "&" +
      "departmentid=" +
      params.departmentid +
      "&" +
      "designationid=" +
      params.designationid +
      "&" +
      "millcode=" +
      params.millcode +
      "&" +
      "sterilizerid=" +
      params.sterilizerid +
      "&" +
      "stationid=" +
      params.stationid +
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

  getSterilizersValue(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.getsterilizers;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getFruitTypeValue(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.getfruittype;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  saveName(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.saverunningusers;
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

  saveBreakDownStatus(params) {
    this.commonservice.startLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.savebreakdownstatus;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          this.commonservice.stopLoading();
          console.log(data);
          resolve(data);
        },
        (error) => {
          this.commonservice.stopLoading();
          console.log(error);
          reject(error);
        }
      );
    });
  }

  saveMillStartStopDateTime(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.savemillstartstopdatetime;

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

  getlogsheetpressstation(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.logsheetpressstation;
    console.log(api, reqOpts);
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

  getlogsheetsterilizationstation(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.logsheetsterilizationstation;
    console.log(api, reqOpts);
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

  saveDilutionTemperature(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.savedilutiontemperature;

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

  updatenotificationremarks(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.updatenotificationremarks;
    console.log(api, reqOpts);
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

  /*getProductionStaions(params) {
    if (
      params.designationid != 1 &&
      params.designationid != 2 &&
      params.designationid != 4 &&
      params.designationid != 5 &&
      params.designationid != 6 &&
      params.designationid != 7 &&
      params.designationid != 8
    ) {
      this.commonservice.startLoading();
    }

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getproductionstations;

    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //this.commonservice.dimmissLoading();

          if (
            params.designationid != 1 &&
            params.designationid != 2 &&
            params.designationid != 4 &&
            params.designationid != 5 &&
            params.designationid != 6 &&
            params.designationid != 7 &&
            params.designationid != 8
          ) {
            this.commonservice.stopLoading();
          }

          console.log(data);
          resolve(data);
        },
        (error) => {
          //this.commonservice.dimmissLoading();

          if (
            params.designationid != 1 &&
            params.designationid != 2 &&
            params.designationid != 4 &&
            params.designationid != 5 &&
            params.designationid != 6 &&
            params.designationid != 7 &&
            params.designationid != 8
          ) {
            this.commonservice.stopLoading();
          }

          console.log(error);

          reject(error);
        }
      );
    });
  }*/

  getProductionStaions(params) {
    /*if (
      params.designationid != 1 &&
      params.designationid != 2 &&
      params.designationid != 4 &&
      params.designationid != 5 &&
      params.designationid != 6 &&
      params.designationid != 7 &&
      params.designationid != 8
    ) {
      this.commonservice.startLoading();
    }*/

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
          /*if (
            params.designationid != 1 &&
            params.designationid != 2 &&
            params.designationid != 4 &&
            params.designationid != 5 &&
            params.designationid != 6 &&
            params.designationid != 7 &&
            params.designationid != 8
          ) {
            this.commonservice.stopLoading();
          }*/

          resolve(data);
        },
        (error) => {
          /*if (
            params.designationid != 1 &&
            params.designationid != 2 &&
            params.designationid != 4 &&
            params.designationid != 5 &&
            params.designationid != 6 &&
            params.designationid != 7 &&
            params.designationid != 8
          ) {
            this.commonservice.stopLoading();
          }*/

          console.log(error);

          reject(error);
        }
      );
    });
  }

  previousProductionHistory(params) {
    //this.commonservice.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.getpreviousproductionhistory;
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

  getOillossesvalues(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.get_oilloss_prediction;
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(api, reqOpts)
        .pipe(timeout(15000))
        .subscribe(
          (data) => {
            console.log(data);
            resolve(data);
          },
          (error) => {
            console.log(error);
            if (error.name == "TimeoutError" || error.status == 500) {
              this.commonservice.presentToast("Something went wrong...!");
            }
            reject(error);
          }
        );
    });
  }

  saveDoorOpenTimeLater(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.savedooropenlater;
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(api, reqOpts)
        .pipe(timeout(15000))
        .subscribe(
          (data) => {
            console.log(data);
            resolve(data);
          },
          (error) => {
            console.log(error);
            if (error.name == "TimeoutError" || error.status == 500) {
              this.commonservice.presentToast("Something went wrong...!");
            }
            reject(error);
          }
        );
    });
  }

  getMultiPartDefectViewList(params) {
    //var newurl = appsettings.chatapi + "?" + "msg=" + params;
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getmultipartdefectviewlist +
      "?" +
      "userid=" +
      params.userid +
      "&" +
      "departmentid=" +
      params.departmentid +
      "&" +
      "designationid=" +
      params.designationid +
      "&" +
      "millcode=" +
      params.millcode +
      "&" +
      "id=" +
      params.id +
      "&" +
      "stationid=" +
      params.stationid +
      "&" +
      "equipment=" +
      params.equipment +
      "&" +
      "partdefectid=" +
      params.partdefectid +
      "&" +
      "pvflag=" +
      params.pvflag +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient
        .get(newurl)
        .pipe(timeout(15000))
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            console.log(error);
            if (error.name == "TimeoutError" || error.status == 500) {
              this.commonservice.presentToast("Something went wrong...!");
            }
            reject(error);
          }
        );
    });
  }
  getAbnormalReport(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.getabnormalreport;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          console.log(data);
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
