import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { appsettings } from "src/app/appsettings";
import { timeout } from "rxjs/operators";
import { AIREIService } from "src/app/api/api.service";

@Injectable({
  providedIn: "root",
})
export class WeighbridgeService {
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

  getweighbridgedetails(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getpendinggradinglist;
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
  saveweighbridgedetails(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.updategradingnetweight;
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
  getweighbridgereportdetails(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getweighbridgereport;
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
}
