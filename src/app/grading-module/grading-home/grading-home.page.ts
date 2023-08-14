import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AIREIService } from "src/app/api/api.service";
import {
  AlertController,
  Platform,
  Animation,
  AnimationController,
  ModalController,
  IonSlides,
} from "@ionic/angular";
import { ImageUploadService } from "src/app/services/imageupload-service/imageupload";
import { GradingserviceService } from "src/app/services/grading-service/gradingservice.service";

import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

import { Market } from "@ionic-native/market/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
const { PushNotifications } = Plugins;

import { GradingVehicleSearchPage } from "src/app/grading-module/grading-vehicle-search/grading-vehicle-search.page";
import { PressingsterilizerstationImageSliderPage } from "src/app/supervisor-module/pressingsterilizerstation-image-slider/pressingsterilizerstation-image-slider.page";

@Component({
  selector: "app-grading-home",
  templateUrl: "./grading-home.page.html",
  styleUrls: ["./grading-home.page.scss"],
})
export class GradingHomePage implements OnInit {
  @ViewChild("myElementRef", { static: false }) myElementRef: ElementRef;

  gradingForm;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;
  mill_name = this.nl2br(this.userlist.millname);

  count = 0;

  // Variables
  params;
  receivenewloadFlag = false;
  selectvehicleFlag = true;
  entervehicleFlag = false;
  confirmDisable = false;
  pleasewaitflag = false;
  uinorecordFlag = false;
  previousstatusofnorecordflag: boolean;
  norecordFlag = false;

  vehicleid = 0;
  vehiclenumber = "";
  receivenewloadclick = 0;

  imagePaths = {
    hardbunchesimage_path: "",
  };

  hardbunchesimagesArr = [];
  imagetype = "";
  imageview = "";

  gradinglistArr = [];

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private alertController: AlertController,
    private zone: NgZone,
    private notifi: AuthGuardService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private platform: Platform,
    private appVersion: AppVersion,
    private market: Market,
    private animationCtrl: AnimationController,
    private gradingservice: GradingserviceService,
    public vehiclemodalController: ModalController,
    public viewimagemodalController: ModalController,
    private screenOrientation: ScreenOrientation,
    private imgUpload: ImageUploadService
  ) {
    this.gradingForm = this.fb.group({
      txt_searchvehicle: new FormControl(""),
      txt_vehiclenumber: new FormControl(""),
      txt_hardbunches: new FormControl("", Validators.required),
      txt_underripebunches: new FormControl("", Validators.required),
      txt_ripeness: new FormControl("", Validators.required),
      txt_overdue: new FormControl("", Validators.required),
      txt_loosefruits: new FormControl("", Validators.required),
      txt_hardbunchesimageupload: new FormControl(""),
    });

    this.activatedroute.params.subscribe((val) => {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    const animation: Animation = this.animationCtrl
      .create()
      .addElement(this.myElementRef.nativeElement)
      .duration(1000)
      .fromTo("opacity", "0", "1");

    animation.play();
  }

  ionViewDidEnter() {
    PushNotifications.removeAllDeliveredNotifications();

    this.count = parseInt(localStorage.getItem("badge_count"));
    this.notifi.updateNotification();
    this.updateNotification();
    this.getLiveNotification();

    this.getGrading();
  }

  updateNotification() {
    this.zone.run(() => {
      this.count = parseInt(localStorage.getItem("badge_count"));
    });
  }

  getLiveNotification() {
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        this.updateNotification();
      }
    );
  }

  btn_notification() {
    localStorage.setItem("badge_count", "0");
    this.router.navigate(["/segregatenotification"]);
  }

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
          if (type == "HB") {
            this.imagePaths.hardbunchesimage_path =
              resultdata.data.uploaded_path;

            this.hardbunchesimagesArr.push(
              this.imagePaths.hardbunchesimage_path
            );

            if (this.hardbunchesimagesArr.length == 1) {
              this.gradingForm.controls.txt_hardbunchesimageupload.setValue(
                this.translate.instant(
                  "HOURLYSTERILIZATIONSTATIONSAVE.uploded"
                ) +
                  this.hardbunchesimagesArr.length +
                  this.translate.instant(
                    "HOURLYSTERILIZATIONSTATIONSAVE.image1"
                  )
              );
            } else {
              this.gradingForm.controls.txt_hardbunchesimageupload.setValue("");
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

    /*var dummyimagepath =
      "http://demo.mypalm.com.my/java/generic_upload/1014-generic1333-1679038204465.jpg";

    if (type == "HB") {
      this.imagePaths.hardbunchesimage_path = dummyimagepath;

      this.hardbunchesimagesArr.push(this.imagePaths.hardbunchesimage_path);

      if (this.hardbunchesimagesArr.length == 1) {
        this.gradingForm.controls.txt_hardbunchesimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.hardbunchesimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
        );
      } else if (this.hardbunchesimagesArr.length > 1) {
        this.gradingForm.controls.txt_hardbunchesimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.hardbunchesimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
        );
      } else {
        this.gradingForm.controls.txt_hardbunchesimageupload.setValue("");
      }
    }*/
  }

  btn_view(type) {
    this.imagetype = type;

    if (this.imagetype == "HB") {
      if (this.hardbunchesimagesArr.length > 0) {
        this.imagetype = "Hard Bunches Image";

        this.imageview = "";

        this.imageview = this.hardbunchesimagesArr.join("~");

        this.ViewImages(this.imageview);
      } else {
        if (this.hardbunchesimagesArr.length > 1) {
          this.commonservice.presentToast(
            "Hard Bunches" +
              this.translate.instant(
                "HOURLYSTERILIZATIONSTATIONSAVE.imagesnotfound"
              )
          );
        } else {
          this.commonservice.presentToast(
            "Hard Bunches" +
              this.translate.instant(
                "HOURLYSTERILIZATIONSTATIONSAVE.imagenotfound"
              )
          );
        }
      }
    }
  }

  getGrading() {
    if (this.receivenewloadclick == 1) {
      this.receivenewloadclick = 0;
      this.receivenewloadFlag = false;
      this.gradingForm.reset();
      this.cleardata();
    }

    this.pleasewaitflag = true;

    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      fromdate: "",
      todate: "",
      language: this.languageService.selected,
    };

    this.gradingservice.getGradingList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.gradinglistArr = resultdata.data;
        this.uinorecordFlag = true;
        this.norecordFlag = false;
        this.previousstatusofnorecordflag = this.norecordFlag;
        this.pleasewaitflag = false;
      } else {
        this.gradinglistArr = [];
        this.uinorecordFlag = true;
        this.norecordFlag = true;
        this.previousstatusofnorecordflag = this.norecordFlag;
        this.pleasewaitflag = false;
      }
    });
  }

  btn_receivenewload() {
    this.gradingForm.reset();
    this.cleardata();

    if (this.receivenewloadclick == 0) {
      this.receivenewloadclick = 1;
      this.receivenewloadFlag = true;

      if (this.norecordFlag) {
        this.uinorecordFlag = false;
        this.norecordFlag = false;
      }
    } else {
      this.receivenewloadclick = 0;
      this.receivenewloadFlag = false;

      if (this.previousstatusofnorecordflag) {
        this.uinorecordFlag = true;
        this.norecordFlag = true;
      }
    }

    this.selectvehicleFlag = true;
    this.entervehicleFlag = false;
  }

  btn_save() {
    if (this.gradingForm.valid) {
      var get_vehiclenumber = "";

      if (this.vehicleid != 0) {
        if (this.vehiclenumber != "") {
          get_vehiclenumber = this.vehiclenumber;

          //console.log(this.vehiclenumber + "\n" + this.vehicleid);
        } else {
          this.commonservice.presentToast(
            this.translate.instant("GRADINGHOME.vehiclenumbermandatory")
          );
          return;
        }
      } else {
        if (
          this.gradingForm.value.txt_vehiclenumber != 0 &&
          typeof this.gradingForm.value.txt_vehiclenumber !== "undefined" &&
          this.gradingForm.value.txt_vehiclenumber !== null
        ) {
          get_vehiclenumber = this.gradingForm.value.txt_vehiclenumber;
        } else {
          this.commonservice.presentToast(
            this.translate.instant("GRADINGHOME.vehiclenumbermandatory")
          );
          return;
        }
      }

      if (
        this.gradingForm.value.txt_underripebunches > 100 ||
        this.gradingForm.value.txt_ripeness > 100 ||
        this.gradingForm.value.txt_overdue > 100 ||
        this.gradingForm.value.txt_loosefruits > 100
      ) {
        this.commonservice.presentToast(
          this.translate.instant("GRADINGHOME.percentagevalidation")
        );
        return;
      }

      this.confirmDisable = true;

      var req = {
        userid: this.userlist.userId,
        millcode: this.userlist.millcode,
        dept_id: this.userlist.dept_id,
        design_id: this.userlist.desigId,
        id: 0,
        vehicle_no: get_vehiclenumber,
        hard_bunch_percent: this.gradingForm.value.txt_hardbunches,
        under_ripe_bunch_percent: this.gradingForm.value.txt_underripebunches,
        ripeness_percent: this.gradingForm.value.txt_ripeness,
        overdue_percent: this.gradingForm.value.txt_overdue,
        loose_fruit_percent: this.gradingForm.value.txt_loosefruits,
        hard_bunches_image: this.hardbunchesimagesArr.join("~"),
        language: this.languageService.selected,
      };

      //console.log(req);

      this.gradingservice.saveGrading(req).then((result) => {
        var resultdata: any;
        resultdata = result;
        if (resultdata.httpcode == 200) {
          this.confirmDisable = false;

          this.cleardata();

          this.commonservice.presentToast(
            this.translate.instant("GRADINGHOME.receivedloadsuccessfully")
          );

          if (this.receivenewloadclick == 0) {
            this.receivenewloadclick = 1;
          } else {
            this.receivenewloadclick = 0;
          }

          this.receivenewloadFlag = false;

          this.getGrading();
        } else {
          this.confirmDisable = false;

          this.cleardata();

          this.commonservice.presentToast(
            this.translate.instant("GRADINGHOME.receivedloadfailed")
          );
        }
      });
    } else {
      this.commonservice.presentToast(
        this.translate.instant("GENERALBUTTON.pleasefilltheform")
      );
    }
  }

  checkData() {
    if (
      this.gradingForm.value.txt_hardbunches != "" &&
      typeof this.gradingForm.value.txt_hardbunches !== "undefined" &&
      this.gradingForm.value.txt_hardbunches !== null
    ) {
      if (Number.isInteger(this.gradingForm.value.txt_hardbunches)) {
        this.gradingForm.controls.txt_hardbunches.setValue(
          Number(this.gradingForm.value.txt_hardbunches).toFixed(1)
        );
      }
    }

    if (
      this.gradingForm.value.txt_underripebunches != "" &&
      typeof this.gradingForm.value.txt_underripebunches !== "undefined" &&
      this.gradingForm.value.txt_underripebunches !== null
    ) {
      if (Number.isInteger(this.gradingForm.value.txt_underripebunches)) {
        this.gradingForm.controls.txt_underripebunches.setValue(
          Number(this.gradingForm.value.txt_underripebunches).toFixed(1)
        );
      }
    }

    if (
      this.gradingForm.value.txt_ripeness != "" &&
      typeof this.gradingForm.value.txt_ripeness !== "undefined" &&
      this.gradingForm.value.txt_ripeness !== null
    ) {
      if (Number.isInteger(this.gradingForm.value.txt_ripeness)) {
        this.gradingForm.controls.txt_ripeness.setValue(
          Number(this.gradingForm.value.txt_ripeness).toFixed(1)
        );
      }
    }

    if (
      this.gradingForm.value.txt_overdue != "" &&
      typeof this.gradingForm.value.txt_overdue !== "undefined" &&
      this.gradingForm.value.txt_overdue !== null
    ) {
      if (Number.isInteger(this.gradingForm.value.txt_overdue)) {
        this.gradingForm.controls.txt_overdue.setValue(
          Number(this.gradingForm.value.txt_overdue).toFixed(1)
        );
      }
    }

    if (
      this.gradingForm.value.txt_loosefruits != "" &&
      typeof this.gradingForm.value.txt_loosefruits !== "undefined" &&
      this.gradingForm.value.txt_loosefruits !== null
    ) {
      if (Number.isInteger(this.gradingForm.value.txt_loosefruits)) {
        this.gradingForm.controls.txt_loosefruits.setValue(
          Number(this.gradingForm.value.txt_loosefruits).toFixed(1)
        );
      }
    }
  }

  btn_Action(item) {
    this.router.navigate([item.path]);
  }

  backtoselect() {
    this.gradingForm.controls.txt_searchvehicle.setValue("");
    this.gradingForm.controls.txt_vehiclenumber.setValue("");

    this.selectvehicleFlag = true;
    this.entervehicleFlag = false;
  }

  async callmodalcontroller(type) {
    if (type == "Vehicle") {
      const vehiclemodal = await this.vehiclemodalController.create({
        component: GradingVehicleSearchPage,
        showBackdrop: true,
        backdropDismiss: false,
        cssClass: ["vehicle-modal"],
      });

      vehiclemodal.onDidDismiss().then((modeldata) => {
        let viewform = modeldata.data.data;

        //console.log("GetData --->" + viewform);

        if (viewform != "") {
          this.params = JSON.parse(viewform);

          console.log(this.params.id);

          if (this.params.id != 0) {
            this.vehicleid = this.params.id;
            this.vehiclenumber = this.params.vehicle_no;

            //console.log(this.vehiclenumber);

            this.gradingForm.controls.txt_searchvehicle.setValue(
              this.vehiclenumber
            );
            this.gradingForm.controls.txt_vehiclenumber.setValue("");
          } else {
            this.vehicleid = this.params.id;
            this.vehiclenumber = this.params.vehicle_no;

            //console.log(modeldata.data.searchtext);

            this.gradingForm.controls.txt_searchvehicle.setValue("");

            if (modeldata.data.searchtext != "") {
              this.gradingForm.controls.txt_vehiclenumber.setValue(
                modeldata.data.searchtext
              );
            }

            this.selectvehicleFlag = false;
            this.entervehicleFlag = true;
          }
        } else {
          this.vehicleid = 0;
          this.vehiclenumber = "";

          this.gradingForm.controls.txt_searchvehicle.setValue("");
          this.gradingForm.controls.txt_vehiclenumber.setValue("");
        }
      });

      return await vehiclemodal.present();
    }
  }

  async ViewImages(hardbunchesimages) {
    if (hardbunchesimages != "") {
      const viewimagemodal = await this.viewimagemodalController.create({
        component: PressingsterilizerstationImageSliderPage,
        componentProps: {
          from: "Grading",
          gradingitem: hardbunchesimages,
        },
      });

      viewimagemodal.onDidDismiss().then((data) => {});

      return await viewimagemodal.present();
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }

  alphanumberFilter(event: any) {
    const reg = /^[a-zA-Z0-9\s]{0,15}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,1})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  cleardata() {
    this.vehicleid = 0;
    this.vehiclenumber = "";

    this.gradingForm.controls.txt_searchvehicle.setValue("");
    this.gradingForm.controls.txt_vehiclenumber.setValue("");
    this.gradingForm.controls.txt_hardbunchesimageupload.setValue("");

    this.hardbunchesimagesArr = [];
  }
}
