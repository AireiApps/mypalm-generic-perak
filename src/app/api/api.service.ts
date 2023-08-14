import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { appsettings } from "../appsettings";
import { timeout } from "rxjs/operators";
import { ToastController, LoadingController } from "@ionic/angular";
import { PreloadingserviceService } from "src/app/services/preloadingservice/preloadingservice.service";

const httpOptions = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  params: new HttpParams(),
};

@Injectable({
  providedIn: "root",
})
export class AIREIService {
  loading;
  isLoading = false;

  constructor(
    public httpClient: HttpClient,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public preloading: PreloadingserviceService
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

  getdashboardnotification(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.dashboardnotification;

    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }

  /*Notification Icon Records in POST Method
  getsegregatenotification(params) {
    //this.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.segregatenotification;

    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //this.dimmissLoading();
          console.log(data);
          resolve(data);
        },
        (error) => {
          //this.dimmissLoading();
          //console.log(error);

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }*/

  getalertnotification(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.alertnotification +
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
      "filter=" +
      params.filter +
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
            //console.log(data);

            resolve(data);
          },
          (error) => {
            if (error.status == 0) {
              this.presentToast("Unable to Connect Server");
            } else if (error.name == "TimeoutError" || error.status == 500) {
              this.presentToast("Something went wrong...!");
            }

            reject(error);
          }
        );
    });
  }

  getalertdetails(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.alertdetailsnotification +
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
      "baseid=" +
      params.baseid +
      "&" +
      "id=" +
      params.id +
      "&" +
      "type=" +
      params.type +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          //console.log(data);

          resolve(data);
        },
        (error) => {
          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }

  updatealertnotification(params) {
    //this.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.updatealertnotification;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //this.dimmissLoading();

          //console.log(data);
          resolve(data);
        },
        (error) => {
          //this.dimmissLoading();

          console.log(error);

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }

  getsegregatenotification(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.segregatenotification +
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
      "filter=" +
      params.filter +
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
            console.log(data);

            resolve(data);
          },
          (error) => {
            if (error.status == 0) {
              this.presentToast("Unable to Connect Server");
            } else if (error.name == "TimeoutError" || error.status == 500) {
              this.presentToast("Something went wrong...!");
            }

            reject(error);
          }
        );
    });
  }

  deletedasboardnotification(params) {
    //this.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") +
      appsettings.deletedashboardnotification;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //this.dimmissLoading();

          //console.log(data);
          resolve(data);
        },
        (error) => {
          //this.dimmissLoading();

          console.log(error);

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }

  updateImageBackgroud() {}

  updateContactBackgroud() {}

  updatePushNotification(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.login_token_update;

    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //console.log(data);

          resolve(data);
        },
        (error) => {
          console.log(error);

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }

  millcodeauthentication(req) {
    var api = appsettings.API_ENDPOINT + "?millcode=" + req.millcode;
    let postData = JSON.stringify(req);
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, postData, httpOptions).subscribe(
        (data) => {
          //console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }
        }
      );
    });
  }

  signIn(req) {
    this.preloading.present();

    var api =
      localStorage.getItem("endpoint") +
      appsettings.login +
      "?millcode=" +
      req.millcode +
      "&username=" +
      req.username +
      "&password=" +
      req.password +
      "&language=" +
      req.language +
      "&languageid=" +
      req.languageid;
    let postData = JSON.stringify(req);
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, postData, httpOptions).subscribe(
        (data) => {
          //console.log(data);
          resolve(data);

          this.preloading.dismiss();
        },
        (error) => {
          console.log(error);

          reject(error);

          this.preloading.dismiss();

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }
        }
      );
    });
  }

  signUp(req, api) {
    let postData = "jsonData=" + JSON.stringify(req);
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, postData, httpOptions).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {
          /*if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }*/

          reject(error);
        }
      );
    });
  }

  updateLanguage(params) {
    this.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.updatelanguage;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          this.dimmissLoading();

          //console.log(data);
          resolve(data);
        },
        (error) => {
          this.dimmissLoading();

          console.log(error);

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }

  getSettings(req) {
    var reqOpts: any;

    //console.log(JSON.stringify(req));

    reqOpts = this.formParams(req);
    var api = localStorage.getItem("endpoint") + appsettings.mypalmsettings;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);

          /*if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }*/

          reject(error);
        }
      );
    });
  }

  checkFlag() {
    var reqOpts: any;
    reqOpts = "";

    var api = appsettings.checkbuttonflag;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  signup(req) {
    var reqOpts: any;

    //console.log(JSON.stringify(req));

    reqOpts = this.formParams(req);
    var api = localStorage.getItem("endpoint") + appsettings.signup;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //console.log(data);
          resolve(data);
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getsummarypopup(params) {
    //this.presentLoading();

    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getsummarypopup +
      "?" +
      "millcode=" +
      params.millcode +
      "&" +
      "userid=" +
      params.userid +
      "&" +
      "language=" +
      params.language;

    //console.log(newurl);

    return new Promise((resolve, reject) => {
      this.httpClient.get(newurl).subscribe(
        (data) => {
          //this.dimmissLoading();

          //console.log(data);

          resolve(data);
        },
        (error) => {
          //this.dimmissLoading();

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }

  updatesummarypopup(params) {
    //this.presentLoading();

    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api = localStorage.getItem("endpoint") + appsettings.updatesummary;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //this.dimmissLoading();

          //console.log(data);
          resolve(data);
        },
        (error) => {
          //this.dimmissLoading();

          console.log(error);

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }

  getsummarypopupflag(params) {
    var newurl =
      localStorage.getItem("endpoint") +
      appsettings.getsummarypopupflag +
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
          //console.log(data);

          resolve(data);
        },
        (error) => {
          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }

  getmaintenancependingcount(params) {
    var reqOpts: any;
    reqOpts = this.formParams(params);

    var api =
      localStorage.getItem("endpoint") + appsettings.getmaintenancependingcount;
    return new Promise((resolve, reject) => {
      this.httpClient.post(api, reqOpts).subscribe(
        (data) => {
          //this.dimmissLoading();

          //console.log(data);
          resolve(data);
        },
        (error) => {
          //this.dimmissLoading();

          console.log(error);

          if (error.status == 0) {
            this.presentToast("Unable to Connect Server");
          }

          reject(error);
        }
      );
    });
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Loading...",
      duration: 1000,
      spinner: "circles",
      cssClass: "my-loading-class",
    });
    await this.loading.present();
  }

  async imagepresentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Image Uploading...",
      duration: 2000,
      spinner: "circles",
      cssClass: "my-loading-class",
      backdropDismiss: true,
    });
    await this.loading.present();
  }

  async presentsupervisordashboardLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Loading...",
      duration: 5000,
      spinner: "circles",
      cssClass: "my-loading-class",
    });
    await this.loading.present();
  }

  async dimmissLoading() {
    this.loading.onDidDismiss();
  }

  async startLoading() {
    this.isLoading = true;

    return await this.loadingCtrl
      .create({
        //duration: 5000,
        spinner: "circles",
        cssClass: "loading",
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => console.log("Abort Presenting"));
          }
        });
      });
  }

  async stopLoading() {
    this.isLoading = false;
    return await this.loadingCtrl
      .dismiss()
      .then(() => console.log("dismissed"));
  }
}
