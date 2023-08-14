import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";
import { ImageUploadService } from "src/app/services/imageupload-service/imageupload";

import {
  ModalController,
  NavParams,
  AlertController,
  IonContent,
  IonSlides,
} from "@ionic/angular";
import * as moment from "moment";
import { Router } from "@angular/router";

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-production-hourlypressingstationsave",
  templateUrl: "./production-hourlypressingstationsave.page.html",
  styleUrls: ["./production-hourlypressingstationsave.page.scss"],
})
export class ProductionHourlypressingstationsavePage implements OnInit {
  @ViewChild("pageTop") pageTop: IonContent;

  userlist = JSON.parse(localStorage.getItem("userlist"));
  getlanguage = this.userlist.language;

  pressstationForm;

  levelArr = [];
  temperatureArr = [];
  digestordrainoilflowArr = [];
  fiberflowArr = [];
  hydraulicpressureArr = [];
  pressureampsArr = [];
  digestorampsArr = [];

  machinename = "";
  presstitle = "";
  digestortitle = "";
  pressingstationid = "";
  digestorstationid = "";
  pressingstationstatus = "";

  observationtime = new Date().toISOString();

  isDisabled = false;
  viewFlag = false;

  temperatureimagesettingsflag = 0;
  motorimagesettingsflag = 0;
  levelimagesettingsflag = 0;
  drainageimagesettingsflag = 0;
  pressmotorimagesettingsflag = 0;
  pressfibreflowimagesettingsflag = 0;
  presshydraulicpressureimagesettingsflag = 0;

  temperatureimageuiflag = false;
  motorimageuiflag = false;
  levelimageuiflag = false;
  drainageimageuiflag = false;
  pressmotorimageuiflag = false;
  pressfibreflowimageuiflag = false;
  presshydraulicpressureimageuiflag = false;

  temperatureimageviewFlag = false;
  motorimageviewFlag = false;
  levelimageviewFlag = false;
  drainageimageviewFlag = false;
  pressmotorimageviewFlag = false;
  pressfibreflowimageviewFlag = false;
  presshydraulicpressureimageviewFlag = false;

  imagetype = "";
  imageviewtitle = "";

  /*Variable to for to View entered Data*/
  view_observationtime = "";
  view_temperature = "";
  view_digestormotoramps = "";
  view_level = "";
  view_digestordrainoilflow = "";
  view_pressmotoramps = "";
  view_fiberflow = "";
  view_hydraulicpressure = "";
  view_dilutiontemperature = "";

  imagePaths = {
    temperatureimage_path: "",
    motorimage_path: "",
    levelimage_path: "",
    drainageimage_path: "",
    pressmotorimage_path: "",
    pressfibreflowimage_path: "",
    presshydraulicpressureimage_path: "",
  };

  temperatureimagesArr = [];
  motorimagesArr = [];
  levelimagesArr = [];
  drainageimagesArr = [];
  pressmotorimagesArr = [];
  pressfibreflowimagesArr = [];
  presshydraulicpressureimagesArr = [];

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    public modalController: ModalController,
    private alertController: AlertController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private supervisorservice: SupervisorService,
    private imgUpload: ImageUploadService,
    private router: Router
  ) {
    let params = navParams.get("item");

    this.machinename = params.machine_name;
    this.presstitle = params.presstitle;
    this.digestortitle = params.digestortitle;
    this.pressingstationid = params.machine_id;
    this.digestorstationid = params.digestor_machine_id;
    this.pressingstationstatus = params.status;

    this.pressstationForm = this.fb.group({
      //txt_observationtime: new FormControl(this.observationtime),
      select_level: new FormControl("", Validators.required),
      //select_temperature: new FormControl("", Validators.required),
      txt_temperature: new FormControl("", Validators.required),
      select_digestordrainoilflow: new FormControl("", Validators.required),
      select_fiberflow: new FormControl("", Validators.required),
      //select_pressmotoramps: new FormControl("", Validators.required),
      //select_digestormotoramps: new FormControl("", Validators.required),
      txt_pressmotoramps: new FormControl("", Validators.required),
      txt_digestormotoramps: new FormControl("", Validators.required),
      txt_hydraulicpressure: new FormControl("", Validators.required),

      txt_temperatureimageupload: new FormControl(""),
      txt_motorimageupload: new FormControl(""),
      txt_levelimageupload: new FormControl(""),
      txt_drainageimageupload: new FormControl(""),

      txt_pressmotorimageupload: new FormControl(""),
      txt_pressfibreflowimageupload: new FormControl(""),
      txt_presshydraulicpressureimageupload: new FormControl(""),
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getImageSettingsFlag();
  }

  addImages(type) {
    if (type == "Temperature") {
      if (this.temperatureimagesettingsflag == 1) {
        if (this.temperatureimageuiflag) {
          this.temperatureimageuiflag = false;
        } else {
          this.temperatureimageuiflag = true;
        }
      }

      if (this.motorimagesettingsflag == 1) {
        if (this.motorimageuiflag) {
          this.motorimageuiflag = false;
        }
      }

      if (this.levelimagesettingsflag == 1) {
        if (this.levelimageuiflag) {
          this.levelimageuiflag = false;
        }
      }

      if (this.drainageimagesettingsflag == 1) {
        if (this.drainageimageuiflag) {
          this.drainageimageuiflag = false;
        }
      }

      if (this.pressmotorimagesettingsflag == 1) {
        if (this.pressmotorimageuiflag) {
          this.pressmotorimageuiflag = false;
        }
      }

      if (this.pressfibreflowimagesettingsflag == 1) {
        if (this.pressfibreflowimageuiflag) {
          this.pressfibreflowimageuiflag = false;
        }
      }

      if (this.presshydraulicpressureimagesettingsflag == 1) {
        if (this.presshydraulicpressureimageuiflag) {
          this.presshydraulicpressureimageuiflag = false;
        }
      }
    }

    if (type == "Motor") {
      if (this.temperatureimagesettingsflag == 1) {
        if (this.temperatureimageuiflag) {
          this.temperatureimageuiflag = false;
        }
      }

      if (this.motorimagesettingsflag == 1) {
        if (this.motorimageuiflag) {
          this.motorimageuiflag = false;
        } else {
          this.motorimageuiflag = true;
        }
      }

      if (this.levelimagesettingsflag == 1) {
        if (this.levelimageuiflag) {
          this.levelimageuiflag = false;
        }
      }

      if (this.drainageimagesettingsflag == 1) {
        if (this.drainageimageuiflag) {
          this.drainageimageuiflag = false;
        }
      }

      if (this.pressmotorimagesettingsflag == 1) {
        if (this.pressmotorimageuiflag) {
          this.pressmotorimageuiflag = false;
        }
      }

      if (this.pressfibreflowimagesettingsflag == 1) {
        if (this.pressfibreflowimageuiflag) {
          this.pressfibreflowimageuiflag = false;
        }
      }

      if (this.presshydraulicpressureimagesettingsflag == 1) {
        if (this.presshydraulicpressureimageuiflag) {
          this.presshydraulicpressureimageuiflag = false;
        }
      }
    }

    if (type == "Level") {
      if (this.temperatureimagesettingsflag == 1) {
        if (this.temperatureimageuiflag) {
          this.temperatureimageuiflag = false;
        }
      }

      if (this.motorimagesettingsflag == 1) {
        if (this.motorimageuiflag) {
          this.motorimageuiflag = false;
        }
      }

      if (this.levelimagesettingsflag == 1) {
        if (this.levelimageuiflag) {
          this.levelimageuiflag = false;
        } else {
          this.levelimageuiflag = true;
        }
      }

      if (this.drainageimagesettingsflag == 1) {
        if (this.drainageimageuiflag) {
          this.drainageimageuiflag = false;
        }
      }

      if (this.pressmotorimagesettingsflag == 1) {
        if (this.pressmotorimageuiflag) {
          this.pressmotorimageuiflag = false;
        }
      }

      if (this.pressfibreflowimagesettingsflag == 1) {
        if (this.pressfibreflowimageuiflag) {
          this.pressfibreflowimageuiflag = false;
        }
      }

      if (this.presshydraulicpressureimagesettingsflag == 1) {
        if (this.presshydraulicpressureimageuiflag) {
          this.presshydraulicpressureimageuiflag = false;
        }
      }
    }

    if (type == "Drainage") {
      if (this.temperatureimagesettingsflag == 1) {
        if (this.temperatureimageuiflag) {
          this.temperatureimageuiflag = false;
        }
      }

      if (this.motorimagesettingsflag == 1) {
        if (this.motorimageuiflag) {
          this.motorimageuiflag = false;
        }
      }

      if (this.levelimagesettingsflag == 1) {
        if (this.levelimageuiflag) {
          this.levelimageuiflag = false;
        }
      }

      if (this.drainageimagesettingsflag == 1) {
        if (this.drainageimageuiflag) {
          this.drainageimageuiflag = false;
        } else {
          this.drainageimageuiflag = true;
        }
      }

      if (this.pressmotorimagesettingsflag == 1) {
        if (this.pressmotorimageuiflag) {
          this.pressmotorimageuiflag = false;
        }
      }

      if (this.pressfibreflowimagesettingsflag == 1) {
        if (this.pressfibreflowimageuiflag) {
          this.pressfibreflowimageuiflag = false;
        }
      }

      if (this.presshydraulicpressureimagesettingsflag == 1) {
        if (this.presshydraulicpressureimageuiflag) {
          this.presshydraulicpressureimageuiflag = false;
        }
      }
    }

    if (type == "PressMotor") {
      if (this.temperatureimagesettingsflag == 1) {
        if (this.temperatureimageuiflag) {
          this.temperatureimageuiflag = false;
        }
      }

      if (this.motorimagesettingsflag == 1) {
        if (this.motorimageuiflag) {
          this.motorimageuiflag = false;
        }
      }

      if (this.levelimagesettingsflag == 1) {
        if (this.levelimageuiflag) {
          this.levelimageuiflag = false;
        }
      }

      if (this.drainageimagesettingsflag == 1) {
        if (this.drainageimageuiflag) {
          this.drainageimageuiflag = false;
        }
      }

      if (this.pressmotorimagesettingsflag == 1) {
        if (this.pressmotorimageuiflag) {
          this.pressmotorimageuiflag = false;
        } else {
          this.pressmotorimageuiflag = true;
        }
      }

      if (this.pressfibreflowimagesettingsflag == 1) {
        if (this.pressfibreflowimageuiflag) {
          this.pressfibreflowimageuiflag = false;
        }
      }

      if (this.presshydraulicpressureimagesettingsflag == 1) {
        if (this.presshydraulicpressureimageuiflag) {
          this.presshydraulicpressureimageuiflag = false;
        }
      }
    }

    if (type == "PressFibreFlow") {
      if (this.temperatureimagesettingsflag == 1) {
        if (this.temperatureimageuiflag) {
          this.temperatureimageuiflag = false;
        }
      }

      if (this.motorimagesettingsflag == 1) {
        if (this.motorimageuiflag) {
          this.motorimageuiflag = false;
        }
      }

      if (this.levelimagesettingsflag == 1) {
        if (this.levelimageuiflag) {
          this.levelimageuiflag = false;
        }
      }

      if (this.drainageimagesettingsflag == 1) {
        if (this.drainageimageuiflag) {
          this.drainageimageuiflag = false;
        }
      }

      if (this.pressmotorimagesettingsflag == 1) {
        if (this.pressmotorimageuiflag) {
          this.pressmotorimageuiflag = false;
        }
      }

      if (this.pressfibreflowimagesettingsflag == 1) {
        if (this.pressfibreflowimageuiflag) {
          this.pressfibreflowimageuiflag = false;
        } else {
          this.pressfibreflowimageuiflag = true;
        }
      }

      if (this.presshydraulicpressureimagesettingsflag == 1) {
        if (this.presshydraulicpressureimageuiflag) {
          this.presshydraulicpressureimageuiflag = false;
        }
      }
    }

    if (type == "PressHydraulicPressure") {
      if (this.temperatureimagesettingsflag == 1) {
        if (this.temperatureimageuiflag) {
          this.temperatureimageuiflag = false;
        }
      }

      if (this.motorimagesettingsflag == 1) {
        if (this.motorimageuiflag) {
          this.motorimageuiflag = false;
        }
      }

      if (this.levelimagesettingsflag == 1) {
        if (this.levelimageuiflag) {
          this.levelimageuiflag = false;
        }
      }

      if (this.drainageimagesettingsflag == 1) {
        if (this.drainageimageuiflag) {
          this.drainageimageuiflag = false;
        }
      }

      if (this.pressmotorimagesettingsflag == 1) {
        if (this.pressmotorimageuiflag) {
          this.pressmotorimageuiflag = false;
        }
      }

      if (this.pressfibreflowimagesettingsflag == 1) {
        if (this.pressfibreflowimageuiflag) {
          this.pressfibreflowimageuiflag = false;
        }
      }

      if (this.presshydraulicpressureimagesettingsflag == 1) {
        if (this.presshydraulicpressureimageuiflag) {
          this.presshydraulicpressureimageuiflag = false;
        } else {
          this.presshydraulicpressureimageuiflag = true;
        }
      }
    }
  }

  getImageSettingsFlag() {
    //this.imageuiflag = true;
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
        this.temperatureimagesettingsflag =
          resultdata.data[0].temperatureimagesettingsflag;
        this.motorimagesettingsflag = resultdata.data[0].motorimagesettingsflag;
        this.levelimagesettingsflag = resultdata.data[0].levelimagesettingsflag;
        this.drainageimagesettingsflag =
          resultdata.data[0].drainageimagesettingsflag;

        this.pressmotorimagesettingsflag =
          resultdata.data[0].pressmotorimagesettingsflag;
        this.pressfibreflowimagesettingsflag =
          resultdata.data[0].pressfibreflowimagesettingsflag;
        this.presshydraulicpressureimagesettingsflag =
          resultdata.data[0].presshydraulicpressureimagesettingsflag;

        /*this.temperatureimagesettingsflag = 1;
        this.motorimagesettingsflag = 1;
        this.levelimagesettingsflag = 1;
        this.drainageimagesettingsflag = 1;
        this.pressmotorimagesettingsflag = 1;
        this.pressfibreflowimagesettingsflag = 1;
        this.presshydraulicpressureimagesettingsflag = 1;*/

        /*if (this.temperatureimagesettingsflag == 1) {
          this.temperatureimageuiflag = true;
        } else {
          this.temperatureimageuiflag = false;
        }

        if (this.motorimagesettingsflag == 1) {
          this.motorimageuiflag = true;
        } else {
          this.motorimageuiflag = false;
        }

        if (this.levelimagesettingsflag == 1) {
          this.levelimageuiflag = true;
        } else {
          this.levelimageuiflag = false;
        }

        if (this.drainageimagesettingsflag == 1) {
          this.drainageimageuiflag = true;
        } else {
          this.drainageimageuiflag = false;
        }

        if (this.pressmotorimagesettingsflag == 1) {
          this.pressmotorimageuiflag = true;
        } else {
          this.pressmotorimageuiflag = false;
        }

        if (this.pressfibreflowimagesettingsflag == 1) {
          this.pressfibreflowimageuiflag = true;
        } else {
          this.pressfibreflowimageuiflag = false;
        }

        if (this.presshydraulicpressureimagesettingsflag == 1) {
          this.presshydraulicpressureimageuiflag = true;
        } else {
          this.presshydraulicpressureimageuiflag = false;
        }*/

        this.getPercentageValue();
      } else {
        this.temperatureimagesettingsflag = 0;
        this.motorimagesettingsflag = 0;
        this.levelimagesettingsflag = 0;
        this.drainageimagesettingsflag = 0;
        this.pressmotorimagesettingsflag = 0;
        this.pressfibreflowimagesettingsflag = 0;
        this.presshydraulicpressureimagesettingsflag = 0;

        this.getPercentageValue();
      }
    });
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
          if (type == "Temperature") {
            this.imagePaths.temperatureimage_path =
              resultdata.data.uploaded_path;

            this.temperatureimagesArr.push(
              this.imagePaths.temperatureimage_path
            );

            if (this.temperatureimagesArr.length == 1) {
              this.pressstationForm.controls.txt_temperatureimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.temperatureimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
              );
            } else if (this.temperatureimagesArr.length > 1) {
              this.pressstationForm.controls.txt_temperatureimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.temperatureimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
              );
            } else {
              this.pressstationForm.controls.txt_temperatureimageupload.setValue(
                ""
              );
            }
          }

          if (type == "Motor") {
            this.imagePaths.motorimage_path = resultdata.data.uploaded_path;

            this.motorimagesArr.push(this.imagePaths.motorimage_path);

            if (this.motorimagesArr.length == 1) {
              this.pressstationForm.controls.txt_motorimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.motorimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
              );
            } else if (this.motorimagesArr.length > 1) {
              this.pressstationForm.controls.txt_motorimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.motorimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
              );
            } else {
              this.pressstationForm.controls.txt_motorimageupload.setValue("");
            }
          }

          if (type == "Level") {
            this.imagePaths.levelimage_path = resultdata.data.uploaded_path;

            this.levelimagesArr.push(this.imagePaths.levelimage_path);

            if (this.levelimagesArr.length == 1) {
              this.pressstationForm.controls.txt_levelimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.levelimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
              );
            } else if (this.levelimagesArr.length > 1) {
              this.pressstationForm.controls.txt_levelimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.levelimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
              );
            } else {
              this.pressstationForm.controls.txt_levelimageupload.setValue("");
            }
          }

          if (type == "Drainage") {
            this.imagePaths.drainageimage_path = resultdata.data.uploaded_path;

            this.drainageimagesArr.push(this.imagePaths.drainageimage_path);

            if (this.drainageimagesArr.length == 1) {
              this.pressstationForm.controls.txt_drainageimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.drainageimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
              );
            } else if (this.drainageimagesArr.length > 1) {
              this.pressstationForm.controls.txt_drainageimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.drainageimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
              );
            } else {
              this.pressstationForm.controls.txt_drainageimageupload.setValue(
                ""
              );
            }
          }

          if (type == "PressMotor") {
            this.imagePaths.pressmotorimage_path =
              resultdata.data.uploaded_path;

            this.pressmotorimagesArr.push(this.imagePaths.pressmotorimage_path);

            if (this.pressmotorimagesArr.length == 1) {
              this.pressstationForm.controls.txt_pressmotorimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.pressmotorimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
              );
            } else if (this.pressmotorimagesArr.length > 1) {
              this.pressstationForm.controls.txt_pressmotorimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.pressmotorimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
              );
            } else {
              this.pressstationForm.controls.txt_pressmotorimageupload.setValue(
                ""
              );
            }
          }

          if (type == "PressFibreFlow") {
            this.imagePaths.pressfibreflowimage_path =
              resultdata.data.uploaded_path;

            this.pressfibreflowimagesArr.push(
              this.imagePaths.pressfibreflowimage_path
            );

            if (this.pressfibreflowimagesArr.length == 1) {
              this.pressstationForm.controls.txt_pressfibreflowimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.pressfibreflowimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
              );
            } else if (this.pressfibreflowimagesArr.length > 1) {
              this.pressstationForm.controls.txt_pressfibreflowimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.pressfibreflowimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
              );
            } else {
              this.pressstationForm.controls.txt_pressfibreflowimageupload.setValue(
                ""
              );
            }
          }

          if (type == "PressHydraulicPressure") {
            this.imagePaths.presshydraulicpressureimage_path =
              resultdata.data.uploaded_path;

            this.presshydraulicpressureimagesArr.push(
              this.imagePaths.presshydraulicpressureimage_path
            );

            if (this.presshydraulicpressureimagesArr.length == 1) {
              this.pressstationForm.controls.txt_presshydraulicpressureimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.presshydraulicpressureimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
              );
            } else if (this.presshydraulicpressureimagesArr.length > 1) {
              this.pressstationForm.controls.txt_presshydraulicpressureimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.presshydraulicpressureimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
              );
            } else {
              this.pressstationForm.controls.txt_presshydraulicpressureimageupload.setValue(
                ""
              );
            }
          }
        } else {
          this.commonservice.presentToast(
            type +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imageaddedfailed")
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );

    /*var dummyimagepath =
      "http://demo.mypalm.com.my/java/generic_upload/1014-generic1333-1679038204465.jpg";

    if (type == "Temperature") {
      this.imagePaths.temperatureimage_path = dummyimagepath;

      this.temperatureimagesArr.push(this.imagePaths.temperatureimage_path);

      if (this.temperatureimagesArr.length == 1) {
        this.pressstationForm.controls.txt_temperatureimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.temperatureimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
        );
      } else if (this.temperatureimagesArr.length > 1) {
        this.pressstationForm.controls.txt_temperatureimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.temperatureimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
        );
      } else {
        this.pressstationForm.controls.txt_temperatureimageupload.setValue("");
      }
    }

    if (type == "Motor") {
      this.imagePaths.motorimage_path = dummyimagepath;

      this.motorimagesArr.push(this.imagePaths.motorimage_path);

      if (this.motorimagesArr.length == 1) {
        this.pressstationForm.controls.txt_motorimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.motorimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
        );
      } else if (this.motorimagesArr.length > 1) {
        this.pressstationForm.controls.txt_motorimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.motorimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
        );
      } else {
        this.pressstationForm.controls.txt_motorimageupload.setValue("");
      }
    }

    if (type == "Level") {
      this.imagePaths.levelimage_path = dummyimagepath;

      this.levelimagesArr.push(this.imagePaths.levelimage_path);

      if (this.levelimagesArr.length == 1) {
        this.pressstationForm.controls.txt_levelimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.levelimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
        );
      } else if (this.levelimagesArr.length > 1) {
        this.pressstationForm.controls.txt_levelimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.levelimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
        );
      } else {
        this.pressstationForm.controls.txt_levelimageupload.setValue("");
      }
    }

    if (type == "Drainage") {
      this.imagePaths.drainageimage_path = dummyimagepath;

      this.drainageimagesArr.push(this.imagePaths.drainageimage_path);

      if (this.drainageimagesArr.length == 1) {
        this.pressstationForm.controls.txt_drainageimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.drainageimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
        );
      } else if (this.drainageimagesArr.length > 1) {
        this.pressstationForm.controls.txt_drainageimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.drainageimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
        );
      } else {
        this.pressstationForm.controls.txt_drainageimageupload.setValue("");
      }
    }

    if (type == "PressMotor") {
      this.imagePaths.pressmotorimage_path = dummyimagepath;

      this.pressmotorimagesArr.push(this.imagePaths.pressmotorimage_path);

      if (this.pressmotorimagesArr.length == 1) {
        this.pressstationForm.controls.txt_pressmotorimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.pressmotorimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
        );
      } else if (this.pressmotorimagesArr.length > 1) {
        this.pressstationForm.controls.txt_pressmotorimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.pressmotorimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
        );
      } else {
        this.pressstationForm.controls.txt_pressmotorimageupload.setValue("");
      }
    }

    if (type == "PressFibreFlow") {
      this.imagePaths.pressfibreflowimage_path = dummyimagepath;

      this.pressfibreflowimagesArr.push(
        this.imagePaths.pressfibreflowimage_path
      );

      if (this.pressfibreflowimagesArr.length == 1) {
        this.pressstationForm.controls.txt_pressfibreflowimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.pressfibreflowimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
        );
      } else if (this.pressfibreflowimagesArr.length > 1) {
        this.pressstationForm.controls.txt_pressfibreflowimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.pressfibreflowimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
        );
      } else {
        this.pressstationForm.controls.txt_pressfibreflowimageupload.setValue(
          ""
        );
      }
    }

    if (type == "PressHydraulicPressure") {
      this.imagePaths.presshydraulicpressureimage_path = dummyimagepath;

      this.presshydraulicpressureimagesArr.push(
        this.imagePaths.presshydraulicpressureimage_path
      );

      if (this.presshydraulicpressureimagesArr.length == 1) {
        this.pressstationForm.controls.txt_presshydraulicpressureimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.presshydraulicpressureimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
        );
      } else if (this.presshydraulicpressureimagesArr.length > 1) {
        this.pressstationForm.controls.txt_presshydraulicpressureimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.presshydraulicpressureimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
        );
      } else {
        this.pressstationForm.controls.txt_presshydraulicpressureimageupload.setValue(
          ""
        );
      }
    }*/
  }

  getPercentageValue() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getPercentageValue(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.levelArr = resultdata.data;

        this.getDigestorDrainPipe();
      } else {
        this.levelArr = [];

        this.getDigestorDrainPipe();
      }
    });
  }

  getDigestorDrainPipe() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getDigestorDrainPipeValue(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.digestordrainoilflowArr = resultdata.data;

        this.getFiberFlow();
      } else {
        this.digestordrainoilflowArr = [];

        this.getFiberFlow();
      }
    });
  }

  getFiberFlow() {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      language: this.languageService.selected,
    };

    this.supervisorservice.getFiberFlowValue(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.fiberflowArr = resultdata.data;
      } else {
        this.fiberflowArr = [];
      }
    });
  }

  confirm() {
    if (this.pressstationForm.valid) {
      if (this.motorimagesArr.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant(
            "HOURLYPRESSSTATIONSAVE.digestorimagemandatory"
          )
        );
        return;
      }

      if (this.pressmotorimagesArr.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant(
            "HOURLYPRESSSTATIONSAVE.pressmotorimagemandatory"
          )
        );
        return;
      }

      if (this.pressfibreflowimagesArr.length <= 0) {
        this.commonservice.presentToast(
          this.translate.instant(
            "HOURLYPRESSSTATIONSAVE.fibreflowimagemandatory"
          )
        );
        return;
      }

      this.view_temperature = this.pressstationForm.value.txt_temperature;

      this.view_digestormotoramps =
        this.pressstationForm.value.txt_digestormotoramps;

      this.view_level = JSON.parse(
        this.pressstationForm.value.select_level
      ).percentage;

      this.view_digestordrainoilflow = JSON.parse(
        this.pressstationForm.value.select_digestordrainoilflow
      ).digestordrainpipevalue;

      this.view_pressmotoramps = this.pressstationForm.value.txt_pressmotoramps;
      this.view_fiberflow = JSON.parse(
        this.pressstationForm.value.select_fiberflow
      ).level;

      this.view_hydraulicpressure =
        this.pressstationForm.value.txt_hydraulicpressure;

      this.pageTop.scrollToTop();

      this.viewFlag = true;
    } else {
      this.pageTop.scrollToTop();

      this.viewFlag = false;

      this.commonservice.presentToast(
        this.translate.instant("HOURLYPRESSSTATIONSAVE.pleasefilltheform")
      );
    }
  }

  cancelconfirm() {
    this.pageTop.scrollToTop();

    this.viewFlag = false;

    this.isDisabled = false;
  }

  btn_view(type) {
    this.imagetype = type;

    if (this.imagetype == "Temperature") {
      if (this.temperatureimagesArr.length > 0) {
        this.imageviewtitle = "Temperature";
        this.temperatureimageviewFlag = true;
      } else {
        if (this.temperatureimagesArr.length > 1) {
          this.commonservice.presentToast(
            type +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagesnotfound")
          );
        } else {
          this.commonservice.presentToast(
            type +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagenotfound")
          );
        }
      }
    }

    if (this.imagetype == "Motor") {
      if (this.motorimagesArr.length > 0) {
        this.imageviewtitle = "Digestor Motor";
        this.motorimageviewFlag = true;
      } else {
        if (this.motorimagesArr.length > 1) {
          this.commonservice.presentToast(
            "Digestor " +
              type +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagesnotfound")
          );
        } else {
          this.commonservice.presentToast(
            "Digestor " +
              type +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagenotfound")
          );
        }
      }
    }

    if (this.imagetype == "Level") {
      if (this.levelimagesArr.length > 0) {
        this.imageviewtitle = "Level";
        this.levelimageviewFlag = true;
      } else {
        if (this.levelimagesArr.length > 1) {
          this.commonservice.presentToast(
            type +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagesnotfound")
          );
        } else {
          this.commonservice.presentToast(
            type +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagenotfound")
          );
        }
      }
    }

    if (this.imagetype == "Drainage") {
      if (this.drainageimagesArr.length > 0) {
        this.imageviewtitle = "Digestor Drainage";
        this.drainageimageviewFlag = true;
      } else {
        if (this.drainageimagesArr.length > 1) {
          this.commonservice.presentToast(
            type +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagesnotfound")
          );
        } else {
          this.commonservice.presentToast(
            type +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagenotfound")
          );
        }
      }
    }

    if (this.imagetype == "PressMotor") {
      if (this.pressmotorimagesArr.length > 0) {
        this.imageviewtitle = "Press Motor";
        this.pressmotorimageviewFlag = true;
      } else {
        if (this.pressmotorimagesArr.length > 1) {
          this.commonservice.presentToast(
            "Press Motor" +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagesnotfound")
          );
        } else {
          this.commonservice.presentToast(
            "Press Motor" +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagenotfound")
          );
        }
      }
    }

    if (this.imagetype == "PressFibreFlow") {
      if (this.pressfibreflowimagesArr.length > 0) {
        this.imageviewtitle = "Fibre Flow";
        this.pressfibreflowimageviewFlag = true;
      } else {
        if (this.pressfibreflowimagesArr.length > 1) {
          this.commonservice.presentToast(
            "Fibre Flow" +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagesnotfound")
          );
        } else {
          this.commonservice.presentToast(
            "Fibre Flow" +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagenotfound")
          );
        }
      }
    }

    if (this.imagetype == "PressHydraulicPressure") {
      if (this.presshydraulicpressureimagesArr.length > 0) {
        this.imageviewtitle = "Hydraulic Pressure";
        this.presshydraulicpressureimageviewFlag = true;
      } else {
        if (this.presshydraulicpressureimagesArr.length > 1) {
          this.commonservice.presentToast(
            "Hydraulic Pressure" +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagesnotfound")
          );
        } else {
          this.commonservice.presentToast(
            "Hydraulic Pressure" +
              this.translate.instant("HOURLYPRESSSTATIONSAVE.imagenotfound")
          );
        }
      }
    }
  }

  imageviewcancel() {
    if (this.imagetype == "Temperature") {
      this.temperatureimageviewFlag = false;
    }

    if (this.imagetype == "Motor") {
      this.motorimageviewFlag = false;
    }

    if (this.imagetype == "Level") {
      this.levelimageviewFlag = false;
    }

    if (this.imagetype == "Drainage") {
      this.drainageimageviewFlag = false;
    }

    if (this.imagetype == "PressMotor") {
      this.pressmotorimageviewFlag = false;
    }

    if (this.imagetype == "PressFibreFlow") {
      this.pressfibreflowimageviewFlag = false;
    }

    if (this.imagetype == "PressHydraulicPressure") {
      this.presshydraulicpressureimageviewFlag = false;
    }
  }

  async showalert() {
    if (this.pressstationForm.valid) {
      this.save();
      /*const alert = await this.alertController.create({
        header: this.translate.instant("HOURLYPRESSSTATIONSAVE.alertheader"),
        cssClass: "alertmessage",
        message: this.translate.instant("HOURLYPRESSSTATIONSAVE.alertmessage"),
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
              this.save();
            },
          },
        ],
      });

      await alert.present();*/
    } else {
      this.translate.instant("HOURLYPRESSSTATIONSAVE.pleasefilltheform");
    }
  }

  save() {
    if (this.pressstationForm.valid) {
      this.isDisabled = true;

      var getcurrentdate = moment(new Date().toISOString()).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      var observation_time = moment(this.observationtime).format("HH:mm");

      var req = {
        userid: this.userlist.userId,
        millcode: this.userlist.millcode,
        dept_id: this.userlist.dept_id,
        machineId: this.pressingstationid,
        digestor_machine_id: this.digestorstationid,
        status: this.pressingstationstatus,
        observationtime: observation_time,
        level: JSON.parse(this.pressstationForm.value.select_level).id,
        //temperature: JSON.parse(this.pressstationForm.value.select_temperature).id,
        temperature: this.pressstationForm.value.txt_temperature,
        diegestorDrainOilLow: JSON.parse(
          this.pressstationForm.value.select_digestordrainoilflow
        ).id,
        fiberFlow: JSON.parse(this.pressstationForm.value.select_fiberflow).id,
        /*hydralicPressure: JSON.parse(
          this.pressstationForm.value.select_hydraulicpressure
        ).id,*/
        hydralicPressure: this.pressstationForm.value.txt_hydraulicpressure,

        /*pressMotorAmp: JSON.parse(this.pressstationForm.value.select_pressmotoramps).id,*/
        pressMotorAmp: this.pressstationForm.value.txt_pressmotoramps,
        /*digestorMotorAmp: JSON.parse(
          this.pressstationForm.value.select_digestormotoramps
        ).id,*/
        digestorMotorAmp: this.pressstationForm.value.txt_digestormotoramps,
        //dilutionTemperature: this.pressstationForm.value.txt_dilutiontemperature,
        dilutionTemperature: "",
        running_user_id: localStorage.getItem("runninghourid"),
        date: getcurrentdate,
        temperatureimages: this.temperatureimagesArr.join("~"),
        motorimages: this.motorimagesArr.join("~"),
        levelimages: this.levelimagesArr.join("~"),
        drainageimages: this.drainageimagesArr.join("~"),
        pressmotorimages: this.pressmotorimagesArr.join("~"),
        pressfibreflowimages: this.pressfibreflowimagesArr.join("~"),
        presshydraulicpressureimages:
          this.presshydraulicpressureimagesArr.join("~"),
        language: this.languageService.selected,
        newflow: "1",
      };

      console.log(req);

      this.supervisorservice.saveHourlyPressingStation(req).then((result) => {
        var resultdata: any;
        resultdata = result;

        if (resultdata.httpcode == 200) {
          this.commonservice.presentToast(
            this.translate.instant("HOURLYPRESSSTATIONSAVE.savedsuccess")
          );

          this.isDisabled = false;

          this.modalController.dismiss({
            dismissed: true,
            level: this.pressstationForm.value.select_level,
            temperature: this.pressstationForm.value.txt_temperature,
            digestordrainoilflow:
              this.pressstationForm.value.select_digestordrainoilflow,
            pressoilflow: this.pressstationForm.value.select_fiberflow,
            hydraulicpressure:
              this.pressstationForm.value.txt_hydraulicpressure,
            pressmotoramps: this.pressstationForm.value.txt_pressmotoramps,
            digestormotoramps:
              this.pressstationForm.value.txt_digestormotoramps,
            //dilutiontemperature: this.pressstationForm.value.txt_dilutiontemperature,
            recordstatus: "1",
          });
        } else {
          this.isDisabled = false;

          this.commonservice.presentToast(
            this.translate.instant("HOURLYPRESSSTATIONSAVE.savedfail")
          );
        }
      });
    } else {
      this.commonservice.presentToast(
        this.translate.instant("HOURLYPRESSSTATIONSAVE.pleasefilltheform")
      );
    }
  }

  cancel() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }

  parseString(item) {
    return JSON.stringify(item);
  }

  decimalFilter(event: any) {
    const reg = /^\d+(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
}
