import { Component, ViewChild, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ModalController,
  AlertController,
  IonContent,
  IonSlides,
} from "@ionic/angular";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";
import { ImageUploadService } from "src/app/services/imageupload-service/imageupload";
import * as moment from "moment";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

import { ProductionHourlysterilizerstationAlertPage } from "src/app/supervisor-module/production-hourlysterilizerstation-alert/production-hourlysterilizerstation-alert.page";

// Custom Date Picker
import { DatePickerPluginInterface } from "@capacitor-community/date-picker";
import { Plugins } from "@capacitor/core";

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

const DatePicker: DatePickerPluginInterface = Plugins.DatePickerPlugin as any;

@Component({
  selector: "app-production-hourlysterilizerstation",
  templateUrl: "./production-hourlysterilizerstation.page.html",
  styleUrls: ["./production-hourlysterilizerstation.page.scss"],
})
export class ProductionHourlysterilizerstationPage implements OnInit {
  @ViewChild("pageTop") pageTop: IonContent;
  @ViewChild("backpressurereceiver") backpressureInput;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  getlanguage = this.userlist.language;

  sterilizerstationForm;

  sterilizerArr = [];
  fruittypeArr = [];
  sterilizerstationalertArr = [];

  cycleno = "";

  dooropentime_min = "";
  doorshuttime_min = "";
  p1peakthreshold_min = "";
  p1peakthreshold_max = "";
  p2peakthreshold_min = "";
  p2peakthreshold_max = "";
  p3peakthreshold_min = "";
  p3peakthreshold_max = "";

  p1peakalerttitle = "";
  p1peakalertmessage = "";

  p2peakalerttitle = "";
  p2peakalertmessage = "";

  p3peakalerttitle = "";
  p3peakalertmessage = "";

  cookingtimethreshold = "";

  cookingtimealerttitle = "";
  cookingtimealertmessage = "";

  backpressurethreshold_min = "";
  backpressurethreshold_max = "";

  backpressurealerttitle = "";
  backpressurealertmessage = "";

  validationflag = 0;
  p1validationflag = 0;
  p2validationflag = 0;
  p3validationflag = 0;
  cookingtimevalidationflag = 0;
  backpressurevalidationflag = 0;

  //backpressurealertok = 0;
  //p1peakalertok = 0;
  //p2peakalertok = 0;
  //p3peakalertok = 0;

  uienableflag = false;
  norecordsflag = false;
  datevalidationflag = false;
  doorshutdatevalidationflag = false;

  currendatetime = new Date().toISOString();
  cookingstartdate = new Date().toISOString();
  cooingstopdate = new Date().toISOString();

  isDisabled = false;
  viewFlag = false;

  bpvimagesettingsflag = 0;
  peakimagesettingsflag = 0;

  bpvimageuiflag = false;
  peakimageuiflag = false;

  bpvimageviewFlag = false;
  peakimageviewFlag = false;

  imagetype = "";
  imageviewtitle = "";

  /*Variable to for to View entered Data*/
  view_cycleno = "";
  view_doorshuttime = "";
  view_dooropentime = "";
  view_initialsteamadmissiontime = "";
  view_finalblowdowntime = "";
  view_cookingstarttime = "";
  view_cookingstoptime = "";
  view_sterilizername = "";
  view_fruittype = "";
  view_backpressurereceiver = "";
  view_p1peak = "";
  view_p2peak = "";
  view_p3peak = "";
  sterilizerstationalertflag = 0;

  imagePaths = {
    bpvmage_path: "",
    peakimage_path: "",
  };

  bpvimagesArr = [];
  peakimagesArr = [];

  conditiondooropenSelected = "";
  dooropenlaterFlag = false;

  minimumdate = "";
  doorshutminimumdate = "";

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private alertController: AlertController,
    private fb: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private commonservice: AIREIService,
    private supervisorservice: SupervisorService,
    private imgUpload: ImageUploadService,
    private location: Location,
    private screenOrientation: ScreenOrientation
  ) {
    this.sterilizerstationForm = this.fb.group({
      txt_cyclenumber: new FormControl("", Validators.required),
      txt_doorshuttime: new FormControl("", Validators.required),
      txt_dooropentime: new FormControl(""),
      select_sterilizer: new FormControl("", Validators.required),
      //select_fruittype: new FormControl("", Validators.required),
      txt_backpressurereceiver: new FormControl("", Validators.required),
      txt_p1: new FormControl("", Validators.required),
      txt_p2: new FormControl("", Validators.required),
      txt_p3: new FormControl("", Validators.required),
      txt_bpvimageupload: new FormControl(""),
      txt_peakimageupload: new FormControl(""),
    });

    this.activatedroute.params.subscribe((val) => {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );

      //this.getCycleNo();
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    //this.getCycleNo();
  }

  ionViewDidEnter() {
    this.getCycleNo();
  }

  /*openDateTimePicker(type) {
    DatePicker.present({
      mode: "dateAndTime",
      format: "dd-MM-yyyy HH:mm",
      theme: "dark",
      doneText: this.translate.instant("GENERALBUTTON.done"),
      cancelText: this.translate.instant("GENERALBUTTON.cancelbutton"),
    }).then(
      (val) => {
        if (val.value) {
          if (type == "DST") {
            this.view_doorshuttime = val.value;
            this.sterilizerstationForm.controls.txt_doorshuttime.setValue(
              this.view_doorshuttime
            );
          }

          if (type == "DOT") {
            this.view_dooropentime = val.value;
            this.sterilizerstationForm.controls.txt_dooropentime.setValue(
              this.view_dooropentime
            );
          }

          if (type == "ISAT") {
            this.view_initialsteamadmissiontime = val.value;
            this.sterilizerstationForm.controls.txt_initialsteamadmissiontime.setValue(
              this.view_initialsteamadmissiontime
            );
          }

          if (type == "FBDT") {
            this.view_finalblowdowntime = val.value;
            this.sterilizerstationForm.controls.txt_finalblowdowntime.setValue(
              this.view_finalblowdowntime
            );
          }

          if (type == "CSRT") {
            this.view_cookingstarttime = val.value;
            this.sterilizerstationForm.controls.txt_cookingstarttime.setValue(
              this.view_cookingstarttime
            );
          }

          if (type == "CSPT") {
            this.view_cookingstoptime = val.value;
            this.sterilizerstationForm.controls.txt_cookingstoptime.setValue(
              this.view_cookingstoptime
            );
          }
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }*/

  slideOpts = {
    centeredSlides: true,
    autoplay: {
      disableOnInteraction: true,
    },
  };

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  imageUpload(type) {
    this.imgUpload.ImageUploadCommon(type).then(
      (result) => {
        var resultdata: any;
        resultdata = result;

        resultdata = JSON.parse(resultdata.response);

        if (resultdata.httpcode == 200) {
          if (type == "BPV") {
            this.imagePaths.bpvmage_path = resultdata.data.uploaded_path;

            this.bpvimagesArr.push(this.imagePaths.bpvmage_path);

            if (this.bpvimagesArr.length == 1) {
              this.sterilizerstationForm.controls.txt_bpvimageupload.setValue(
                this.translate.instant(
                  "HOURLYSTERILIZATIONSTATIONSAVE.uploded"
                ) +
                  this.bpvimagesArr.length +
                  this.translate.instant(
                    "HOURLYSTERILIZATIONSTATIONSAVE.image1"
                  )
              );
            } else if (this.bpvimagesArr.length > 1) {
              this.sterilizerstationForm.controls.txt_bpvimageupload.setValue(
                this.translate.instant(
                  "HOURLYSTERILIZATIONSTATIONSAVE.uploded"
                ) +
                  this.bpvimagesArr.length +
                  this.translate.instant(
                    "HOURLYSTERILIZATIONSTATIONSAVE.image2"
                  )
              );
            } else {
              this.sterilizerstationForm.controls.txt_bpvimageupload.setValue(
                ""
              );
            }
          }

          if (type == "Peak") {
            this.imagePaths.peakimage_path = resultdata.data.uploaded_path;

            this.peakimagesArr.push(this.imagePaths.peakimage_path);

            if (this.peakimagesArr.length == 1) {
              this.sterilizerstationForm.controls.txt_peakimageupload.setValue(
                this.translate.instant(
                  "HOURLYSTERILIZATIONSTATIONSAVE.uploded"
                ) +
                  this.peakimagesArr.length +
                  this.translate.instant(
                    "HOURLYSTERILIZATIONSTATIONSAVE.image1"
                  )
              );
            } else if (this.peakimagesArr.length > 1) {
              this.sterilizerstationForm.controls.txt_peakimageupload.setValue(
                this.translate.instant(
                  "HOURLYSTERILIZATIONSTATIONSAVE.uploded"
                ) +
                  this.peakimagesArr.length +
                  this.translate.instant(
                    "HOURLYSTERILIZATIONSTATIONSAVE.image2"
                  )
              );
            } else {
              this.sterilizerstationForm.controls.txt_peakimageupload.setValue(
                ""
              );
            }
          }

          //this.commonservice.presentToast(type + " Image Added Successfully!");
        } else {
          this.commonservice.presentToast(
            type +
              this.translate.instant(
                "HOURLYSTERILIZATIONSTATIONSAVE.imageaddedfailed"
              )
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onDoorOpenTimeChange() {
    this.dooropenlaterFlag = false;
  }

  onConditionDoorOpenChange(value) {
    this.conditiondooropenSelected = value;

    if (this.conditiondooropenSelected == "Yes") {
      this.sterilizerstationForm.controls.txt_dooropentime.setValue("");
      this.dooropenlaterFlag = true;

      if (!this.datevalidationflag) {
        this.datevalidationflag = true;
      }
    }
  }

  getCycleNo() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getCycleNoValue(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.cycleno = resultdata.data[0].cycleno;

        this.dooropentime_min = resultdata.data[0].dooropentime_min;

        //console.log(this.dooropentime_min);

        if (
          this.dooropentime_min == "" ||
          typeof this.dooropentime_min == "undefined"
        ) {
          //Current Date - 1
          this.minimumdate = new Date(
            new Date().getTime() + -1 * 24 * 60 * 60 * 1000
          ).toISOString();
        } else {
          //API given Date - 1
          this.minimumdate = new Date(
            new Date(
              moment(this.dooropentime_min).format("YYYY-MM-DD")
            ).getTime() +
              -1 * 24 * 60 * 60 * 1000
          ).toISOString();
        }

        this.p1peakthreshold_min = resultdata.data[0].p1peakthreshold_min;
        this.p1peakthreshold_max = resultdata.data[0].p1peakthreshold_max;

        this.p2peakthreshold_min = resultdata.data[0].p2peakthreshold_min;
        this.p2peakthreshold_max = resultdata.data[0].p2peakthreshold_max;

        this.p3peakthreshold_min = resultdata.data[0].p3peakthreshold_min;
        this.p3peakthreshold_max = resultdata.data[0].p3peakthreshold_max;

        this.p1peakalerttitle = resultdata.data[0].p1peakalerttitle;
        this.p1peakalertmessage = resultdata.data[0].p1peakalertmessage;

        this.p2peakalerttitle = resultdata.data[0].p2peakalerttitle;
        this.p2peakalertmessage = resultdata.data[0].p2peakalertmessage;

        this.p3peakalerttitle = resultdata.data[0].p3peakalerttitle;
        this.p3peakalertmessage = resultdata.data[0].p3peakalertmessage;

        this.cookingtimethreshold = resultdata.data[0].cookingtimethreshold;
        this.cookingtimealerttitle = resultdata.data[0].cookingtimealerttitle;
        this.cookingtimealertmessage =
          resultdata.data[0].cookingtimealertmessage;

        this.backpressurethreshold_min =
          resultdata.data[0].backpressurethreshold_min;
        this.backpressurethreshold_max =
          resultdata.data[0].backpressurethreshold_max;

        this.backpressurealerttitle = resultdata.data[0].backpressurealerttitle;
        this.backpressurealertmessage =
          resultdata.data[0].backpressurealertmessage;

        this.validationflag = resultdata.data[0].validationflag;

        this.sterilizerstationForm.controls.txt_cyclenumber.setValue(
          this.cycleno
        );

        this.getSterilizers();
      } else {
        this.cycleno = "";

        this.minimumdate = new Date().toISOString();

        this.p1peakthreshold_min = "0";
        this.p1peakthreshold_max = "50";

        this.p2peakthreshold_min = "0";
        this.p2peakthreshold_max = "50";

        this.p3peakthreshold_min = "0";
        this.p3peakthreshold_max = "50";

        this.p1peakalerttitle = "Alert";
        this.p1peakalertmessage = "Something went wrong...";

        this.p2peakalerttitle = "Alert";
        this.p2peakalertmessage = "Something went wrong...";

        this.p3peakalerttitle = "Alert";
        this.p3peakalertmessage = "Something went wrong...";

        this.cookingtimethreshold = "0";
        this.cookingtimealerttitle = "Alert";
        this.cookingtimealertmessage = "Something went wrong...";

        this.backpressurethreshold_min = "0";
        this.backpressurethreshold_max = "50";

        this.backpressurealerttitle = "Alert";
        this.backpressurealertmessage = "Something went wrong...";

        this.validationflag = 0;

        this.sterilizerstationForm.controls.txt_cyclenumber.setValue(
          this.cycleno
        );

        this.getSterilizers();
      }
    });
  }

  getSterilizers() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getSterilizersValue(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.sterilizerArr = resultdata.data;

        this.uienableflag = true;
        this.norecordsflag = false;

        this.getFruitType();
      } else {
        this.sterilizerArr = [];

        this.uienableflag = false;
        this.norecordsflag = true;

        this.getFruitType();
      }
    });
  }

  getFruitType() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getFruitTypeValue(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.fruittypeArr = resultdata.data;

        this.getImageSettingsFlag();
      } else {
        this.getImageSettingsFlag();
      }
    });
  }

  getImageSettingsFlag() {
    const req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getSettings(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.bpvimagesettingsflag =
          resultdata.data[0].fruittypeimagesettingsflag;
        this.peakimagesettingsflag = resultdata.data[0].p1imagesettingsflag;

        if (this.bpvimagesettingsflag == 1) {
          this.bpvimageuiflag = true;
        } else {
          this.bpvimageuiflag = false;
        }

        if (this.peakimagesettingsflag == 1) {
          this.peakimageuiflag = true;
        } else {
          this.peakimageuiflag = false;
        }
      } else {
        this.bpvimagesettingsflag = 0;
        this.peakimagesettingsflag = 0;
      }
    });
  }

  addImages(type) {
    if (type == "BPV") {
      if (this.bpvimagesettingsflag == 1) {
        if (this.bpvimageuiflag) {
          this.bpvimageuiflag = false;
        } else {
          this.bpvimageuiflag = true;
        }
      }

      if (this.peakimagesettingsflag == 1) {
        if (this.peakimageuiflag) {
          this.peakimageuiflag = false;
        }
      }
    }

    if (type == "Peak") {
      if (this.bpvimagesettingsflag == 1) {
        if (this.bpvimageuiflag) {
          this.bpvimageuiflag = false;
        }
      }

      if (this.peakimagesettingsflag == 1) {
        if (this.peakimageuiflag) {
          this.peakimageuiflag = false;
        } else {
          this.peakimageuiflag = true;
        }
      }
    }
  }

  onConditionSterilizer() {
    var sterilizerid = JSON.parse(
      this.sterilizerstationForm.value.select_sterilizer
    ).machine_id;

    if (
      sterilizerid != "" &&
      typeof sterilizerid !== "undefined" &&
      sterilizerid !== null
    ) {
      this.getDoorShutTime(sterilizerid);
    }
  }

  getDoorShutTime(getsterilizerid) {
    const req = {
      userid: this.userlist.userId,
      millcode: this.userlist.millcode,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      sterilizerid: getsterilizerid,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.supervisorservice.getLastDoorOpenTime(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.sterilizerstationForm.controls.txt_doorshuttime.setValue("");
        this.sterilizerstationForm.controls.txt_dooropentime.setValue("");

        this.doorshuttime_min = resultdata.dooropentime_min;

        //console.log(this.doorshuttime_min);

        if (
          this.doorshuttime_min == "" ||
          typeof this.doorshuttime_min == "undefined"
        ) {
          //Current Date - 1
          this.doorshutminimumdate = new Date(
            new Date().getTime() + -1 * 24 * 60 * 60 * 1000
          ).toISOString();
        } else {
          //API given Date - 1
          this.doorshutminimumdate = new Date(
            new Date(
              moment(this.doorshuttime_min).format("YYYY-MM-DD")
            ).getTime() +
              -1 * 24 * 60 * 60 * 1000
          ).toISOString();
        }
      } else {
        this.doorshutminimumdate = new Date().toISOString();
      }
    });
  }

  onChangeBackPressureReceiver() {
    /*if (this.sterilizerstationForm.value.txt_backpressurereceiver != "") {
      if (
        this.sterilizerstationForm.value.txt_backpressurereceiver >=
          this.backpressurethreshold_min &&
        this.sterilizerstationForm.value.txt_backpressurereceiver <=
          this.backpressurethreshold_max
      ) {
        this.backpressurevalidationflag = 0;
      } else {
        this.backpressurevalidationflag = 1;
      }
    }*/

    if (this.sterilizerstationForm.value.txt_backpressurereceiver != "") {
      if (this.sterilizerstationForm.value.txt_backpressurereceiver > 100) {
        this.backpressurevalidationflag = 1;

        /*this.peakthresholdalert(
          this.backpressurealerttitle,
          this.backpressurealertmessage
        );*/
      } else {
        this.backpressurevalidationflag = 0;
      }
    }
  }

  onChangeP1() {
    /*if (this.sterilizerstationForm.value.txt_p1 != "") {
      if (
        this.sterilizerstationForm.value.txt_p1 >= this.p1peakthreshold_min &&
        this.sterilizerstationForm.value.txt_p1 <= this.p1peakthreshold_max
      ) {
        this.p1validationflag = 0;
      } else {
        this.p1validationflag = 1;
      }
    }*/

    if (this.sterilizerstationForm.value.txt_p1 != "") {
      if (this.sterilizerstationForm.value.txt_p1 > 100) {
        this.p1validationflag = 1;
        //this.peakthresholdalert(this.p1peakalerttitle, this.p1peakalertmessage);
      } else {
        this.p1validationflag = 0;
      }
    }
  }

  onChangeP2() {
    /*if (this.sterilizerstationForm.value.txt_p2 != "") {
      if (
        this.sterilizerstationForm.value.txt_p2 >= this.p2peakthreshold_min &&
        this.sterilizerstationForm.value.txt_p2 <= this.p2peakthreshold_max
      ) {
        this.p2validationflag = 0;
      } else {
        this.p2validationflag = 1;
      }
    }*/

    if (this.sterilizerstationForm.value.txt_p2 != "") {
      if (this.sterilizerstationForm.value.txt_p2 > 100) {
        this.p2validationflag = 1;

        //this.peakthresholdalert(this.p2peakalerttitle, this.p2peakalertmessage);
      } else {
        this.p2validationflag = 0;
      }
    }
  }

  onChangeP3() {
    /*if (this.sterilizerstationForm.value.txt_p3 != "") {
      if (
        this.sterilizerstationForm.value.txt_p3 >= this.p3peakthreshold_min &&
        this.sterilizerstationForm.value.txt_p3 <= this.p3peakthreshold_max
      ) {
        this.p3validationflag = 0;
      } else {
        this.p3validationflag = 1;
      }
    }*/

    if (this.sterilizerstationForm.value.txt_p3 != "") {
      if (this.sterilizerstationForm.value.txt_p3 > 100) {
        this.p3validationflag = 1;

        //this.peakthresholdalert(this.p3peakalerttitle, this.p3peakalertmessage);
      } else {
        this.p3validationflag = 0;
      }
    }
  }

  btn_view(type) {
    this.imagetype = type;

    if (this.imagetype == "BPV") {
      if (this.bpvimagesArr.length > 0) {
        this.imageviewtitle = "Back Pressure Receiver (BPV)";

        this.bpvimageviewFlag = true;
      } else {
        if (this.bpvimagesArr.length > 1) {
          this.commonservice.presentToast(
            "Back Pressure Receiver (BPV)" +
              this.translate.instant(
                "HOURLYSTERILIZATIONSTATIONSAVE.imagesnotfound"
              )
          );
        } else {
          this.commonservice.presentToast(
            "Back Pressure Receiver (BPV)" +
              this.translate.instant(
                "HOURLYSTERILIZATIONSTATIONSAVE.imagenotfound"
              )
          );
        }
      }
    }

    if (this.imagetype == "Peak") {
      if (this.peakimagesArr.length > 0) {
        this.imageviewtitle = "Peak (P1, P2, P3)";
        this.peakimageviewFlag = true;
      } else {
        if (this.peakimagesArr.length > 1) {
          this.commonservice.presentToast(
            "Peak (P1, P2, P3)" +
              this.translate.instant(
                "HOURLYSTERILIZATIONSTATIONSAVE.imagesnotfound"
              )
          );
        } else {
          this.commonservice.presentToast(
            "Peak (P1, P2, P3)" +
              this.translate.instant(
                "HOURLYSTERILIZATIONSTATIONSAVE.imagenotfound"
              )
          );
        }
      }
    }
  }

  imageviewcancel() {
    if (this.imagetype == "BPV") {
      this.bpvimageviewFlag = false;
    }

    if (this.imagetype == "Peak") {
      this.peakimageviewFlag = false;
    }
  }

  async savealert() {
    if (this.sterilizerstationForm.valid) {
      if (!Number.isInteger(this.sterilizerstationForm.value.txt_cyclenumber)) {
        this.commonservice.presentToast(
          this.translate.instant(
            "HOURLYSTERILIZATIONSTATIONSAVE.cycleshouldbenumber"
          )
        );
        return;
      }

      if (this.sterilizerstationForm.value.txt_doorshuttime == "") {
        this.commonservice.presentToast(
          this.translate.instant(
            "HOURLYSTERILIZATIONSTATIONSAVE.doorshuttimemandatory"
          )
        );
        return;
      }

      // Validation for door shut time - Start
      let doorshuttime_previous = new Date(
        moment(this.doorshuttime_min).format("YYYY-MM-DD HH:mm")
      );

      let doorshuttime_current = new Date(
        moment(this.sterilizerstationForm.value.txt_doorshuttime).format(
          "YYYY-MM-DD HH:mm"
        )
      );

      if (+doorshuttime_current <= +doorshuttime_previous) {
        this.doorshutdatevalidationflag = false;

        this.doorshutdatevalidationnalert(doorshuttime_previous);

        return;
      }
      // Validation for door shut time - End

      if (!this.dooropenlaterFlag) {
        if (this.sterilizerstationForm.value.txt_dooropentime == "") {
          this.commonservice.presentToast(
            this.translate.instant(
              "HOURLYSTERILIZATIONSTATIONSAVE.dooropentimemandatory"
            )
          );
          return;
        }

        // Validation for door shut time should less than door open time - Start
        let startdate = new Date(
          moment(this.sterilizerstationForm.value.txt_doorshuttime).format(
            "YYYY-MM-DD HH:mm"
          )
        );

        let endate = new Date(
          moment(this.sterilizerstationForm.value.txt_dooropentime).format(
            "YYYY-MM-DD HH:mm"
          )
        );

        if (+endate <= +startdate) {
          this.datevalidationnalert("");

          return;
        }
        // Validation for door shut time should less than door open time - End

        // Validation for door open time - Start
        let dooropentime_previous = new Date(
          moment(this.dooropentime_min).format("YYYY-MM-DD HH:mm")
        );

        let dooropentime_current = new Date(
          moment(this.sterilizerstationForm.value.txt_dooropentime).format(
            "YYYY-MM-DD HH:mm"
          )
        );

        if (+dooropentime_current <= +dooropentime_previous) {
          this.datevalidationflag = false;

          this.datevalidationnalert(dooropentime_previous);

          return;
        }
        // Validation for door open time - End
      }

      if (this.validationflag == 1) {
        /*if (this.backpressurevalidationflag == 1) {
          this.peakthresholdalert(
            this.backpressurealerttitle,
            this.backpressurealertmessage
          );
          return;
        }

        if (this.p1validationflag == 1) {
          this.peakthresholdalert(
            this.p1peakalerttitle,
            this.p1peakalertmessage
          );
          return;
        }

        if (this.p2validationflag == 1) {
          this.peakthresholdalert(
            this.p2peakalerttitle,
            this.p2peakalertmessage
          );
          return;
        }

        if (this.p3validationflag == 1) {
          this.peakthresholdalert(
            this.p3peakalerttitle,
            this.p3peakalertmessage
          );
          return;
        }*/

        if (
          this.backpressurevalidationflag == 1 ||
          this.p1validationflag == 1 ||
          this.p2validationflag == 1 ||
          this.p3validationflag == 1
        ) {
          this.thresholdalert();
        } else {
          this.save();
        }
      } else {
        if (
          this.backpressurevalidationflag == 1 ||
          this.p1validationflag == 1 ||
          this.p2validationflag == 1 ||
          this.p3validationflag == 1
        ) {
          this.commonservice.presentToast("Please enter a value within 100");
        } else {
          this.save();
        }
      }
    } else {
      this.commonservice.presentToast(
        this.translate.instant(
          "HOURLYSTERILIZATIONSTATIONSAVE.pleasefilltheform"
        )
      );
    }
  }

  async datevalidationnalert(getdooropentimeprevious) {
    let alertmessage;

    if (getdooropentimeprevious == "") {
      alertmessage = this.translate.instant(
        "HOURLYSTERILIZATIONSTATIONSAVE.doorshutandopentimevalidation"
      );
    } else {
      alertmessage =
        this.translate.instant(
          "HOURLYSTERILIZATIONSTATIONSAVE.datevalidationalert"
        ) + moment(getdooropentimeprevious).format("DD-MM-YYYY HH:mm");
    }

    const alert = await this.alertController.create({
      mode: "md",
      header: this.translate.instant(
        "SUPERVISORDASHBOARD.alreadybreakdownalerttitle"
      ),
      cssClass: "customalertmessageonebuttons",
      message: alertmessage,
      buttons: [
        {
          text: "",
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }

  async doorshutdatevalidationnalert(getdooropentimeprevious) {
    let alertmessage;

    if (getdooropentimeprevious == "") {
      alertmessage = this.translate.instant(
        "HOURLYSTERILIZATIONSTATIONSAVE.doorshutandopentimevalidation"
      );
    } else {
      alertmessage =
        this.translate.instant(
          "HOURLYSTERILIZATIONSTATIONSAVE.doorshuttimealert"
        ) + moment(getdooropentimeprevious).format("DD-MM-YYYY HH:mm");
    }

    const alert = await this.alertController.create({
      mode: "md",
      header: this.translate.instant(
        "SUPERVISORDASHBOARD.alreadybreakdownalerttitle"
      ),
      cssClass: "customalertmessageonebuttons",
      message: alertmessage,
      buttons: [
        {
          text: "",
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }

  async thresholdalert() {
    var alertmessage = "";

    if (this.backpressurevalidationflag == 1) {
      alertmessage = this.backpressurealertmessage;
    }

    if (this.p1validationflag == 1) {
      if (alertmessage == "") {
        alertmessage = alertmessage + this.p1peakalertmessage;
      } else {
        alertmessage = alertmessage + "<br/>" + this.p1peakalertmessage;
      }
    }

    if (this.p2validationflag == 1) {
      if (alertmessage == "") {
        alertmessage = alertmessage + this.p2peakalertmessage;
      } else {
        alertmessage = alertmessage + "<br/>" + this.p2peakalertmessage;
      }
    }

    if (this.p3validationflag == 1) {
      if (alertmessage == "") {
        alertmessage = alertmessage + this.p3peakalertmessage;
      } else {
        alertmessage = alertmessage + "<br/>" + this.p3peakalertmessage;
      }
    }

    const alert = await this.alertController.create({
      mode: "md",
      header: this.backpressurealerttitle,
      cssClass: "thresholdalertmessage",
      message: alertmessage,
      backdropDismiss: false,
      buttons: [
        {
          text: this.translate.instant("GENERALBUTTON.okay"),
          handler: () => {
            //console.log("Confirm Okay");
            this.save();
          },
        },
      ],
    });

    await alert.present();
  }

  save() {
    if (this.sterilizerstationForm.valid) {
      this.view_cycleno = this.sterilizerstationForm.value.txt_cyclenumber;
      /*this.view_doorshuttime = moment(
        this.view_doorshuttime,
        "DD-MM-YYYY HH:mm"
      ).format("DD-MM-YYYY HH:mm");
      this.view_dooropentime = moment(
        this.view_dooropentime,
        "DD-MM-YYYY HH:mm"
      ).format("DD-MM-YYYY HH:mm");*/

      this.view_doorshuttime = moment(
        this.sterilizerstationForm.value.txt_doorshuttime
      ).format("DD-MM-YYYY HH:mm");

      if (!this.dooropenlaterFlag) {
        this.view_dooropentime = moment(
          this.sterilizerstationForm.value.txt_dooropentime
        ).format("DD-MM-YYYY HH:mm");
      } else {
        this.view_dooropentime = this.translate.instant(
          "HOURLYSTERILIZATIONSTATIONSAVE.dooropenlater"
        );
      }

      this.view_sterilizername = JSON.parse(
        this.sterilizerstationForm.value.select_sterilizer
      ).machine_name;
      /*this.view_fruittype = JSON.parse(
        this.sterilizerstationForm.value.select_fruittype
      ).fruittype;*/
      this.view_backpressurereceiver =
        this.sterilizerstationForm.value.txt_backpressurereceiver;
      this.view_p1peak = this.sterilizerstationForm.value.txt_p1;
      this.view_p2peak = this.sterilizerstationForm.value.txt_p2;
      this.view_p3peak = this.sterilizerstationForm.value.txt_p3;

      this.pageTop.scrollToTop();

      this.viewFlag = true;
    } else {
      this.pageTop.scrollToTop();

      this.viewFlag = false;

      this.commonservice.presentToast(
        this.translate.instant(
          "HOURLYSTERILIZATIONSTATIONSAVE.pleasefilltheform"
        )
      );
    }
  }

  async peakthresholdalert(alerttitle, alertmessage) {
    const alert = await this.alertController.create({
      mode: "md",
      header: alerttitle,
      cssClass: "thresholdalertmessage",
      message: alertmessage,
      buttons: [
        {
          text: this.translate.instant("GENERALBUTTON.okay"),
          handler: () => {
            //console.log("Confirm Okay");
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmalert() {
    if (this.sterilizerstationForm.valid) {
      this.confirm();
      /*const alert = await this.alertController.create({
        header: this.translate.instant(
          "HOURLYSTERILIZATIONSTATIONSAVE.alertheader"
        ),
        cssClass: "alertmessage",
        message: this.translate.instant(
          "HOURLYSTERILIZATIONSTATIONSAVE.alertmessage"
        ),
        buttons: [
          {
            text: this.translate.instant("GENERALBUTTON.cancelbutton"),
            role: "cancel",
            cssClass: "secondary",
            handler: (cancel) => {},
          },
          {
            text: this.translate.instant("GENERALBUTTON.savebutton"),
            handler: () => {
              this.confirm();
            },
          },
        ],
      });

      await alert.present();*/
    } else {
      this.translate.instant(
        "HOURLYSTERILIZATIONSTATIONSAVE.pleasefilltheform"
      );
    }
  }

  confirm() {
    if (this.sterilizerstationForm.valid) {
      this.isDisabled = true;

      var getcurrentdate = moment(new Date().toISOString()).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      /*var doorshuttime = moment(
        this.view_doorshuttime,
        "DD-MM-YYYY HH:mm"
      ).format("YYYY-MM-DD HH:mm:00");

      var dooropentime = moment(
        this.view_dooropentime,
        "DD-MM-YYYY HH:mm"
      ).format("YYYY-MM-DD HH:mm:00");*/

      var doorshuttime = moment(
        this.sterilizerstationForm.value.txt_doorshuttime
      ).format("YYYY-MM-DD HH:mm:00");

      var dooropentime;
      if (!this.dooropenlaterFlag) {
        dooropentime = moment(
          this.sterilizerstationForm.value.txt_dooropentime
        ).format("YYYY-MM-DD HH:mm:00");
      } else {
        dooropentime = "";
      }

      if (!Number.isInteger(this.sterilizerstationForm.value.txt_cyclenumber)) {
        this.commonservice.presentToast(
          this.translate.instant(
            "HOURLYSTERILIZATIONSTATIONSAVE.cycleshouldbenumber"
          )
        );
        return;
      }

      var req = {
        userid: this.userlist.userId,
        millcode: this.userlist.millcode,
        dept_id: this.userlist.dept_id,
        machineId: JSON.parse(
          this.sterilizerstationForm.value.select_sterilizer
        ).machine_id,
        status: "1",
        cycleno: this.sterilizerstationForm.value.txt_cyclenumber,
        door_shut_time: doorshuttime,
        door_open_time: dooropentime,
        initial_stream_admission_time: "",
        final_blow_down_time: "",
        cooking_start_time: "",
        cooking_stop_time: "",
        fruittype: "",
        backPressureReceiver:
          this.sterilizerstationForm.value.txt_backpressurereceiver,
        p1: this.sterilizerstationForm.value.txt_p1,
        p2: this.sterilizerstationForm.value.txt_p2,
        p3: this.sterilizerstationForm.value.txt_p3,
        running_user_id: localStorage.getItem("runninghourid"),
        date: getcurrentdate,
        bpvimages: this.bpvimagesArr.join("~"),
        p1images: this.peakimagesArr.join("~"),
        language: this.languageService.selected,
      };

      this.supervisorservice.saveHourlySterilizerStation(req).then((result) => {
        var resultdata: any;
        resultdata = result;

        if (resultdata.httpcode == 200) {
          this.sterilizerstationForm.reset();

          this.isDisabled = false;

          this.commonservice.presentToast(
            this.translate.instant(
              "HOURLYSTERILIZATIONSTATIONSAVE.savedsuccess"
            )
          );

          this.router.navigate(["tabs/tabsupervisordashboard"]);
        } else {
          this.isDisabled = false;

          this.commonservice.presentToast(
            this.translate.instant("HOURLYSTERILIZATIONSTATIONSAVE.savedfail")
          );
        }
      });
    } else {
      this.translate.instant(
        "HOURLYSTERILIZATIONSTATIONSAVE.pleasefilltheform"
      );
    }
  }

  async sterilizerstationalert() {
    const modal = await this.modalController.create({
      component: ProductionHourlysterilizerstationAlertPage,
      componentProps: {
        item: this.sterilizerstationalertArr,
      },
    });

    modal.onDidDismiss().then((data) => {
      this.getCycleNo();
    });

    return await modal.present();
  }

  cancelconfirm() {
    this.pageTop.scrollToTop();

    this.viewFlag = false;

    this.isDisabled = false;
  }

  cancel() {
    this.location.back();
  }

  parseString(item) {
    return JSON.stringify(item);
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
}
