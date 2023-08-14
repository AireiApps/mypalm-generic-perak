import { Component, OnInit } from "@angular/core";
import { AIREIService } from "src/app/api/api.service";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";
import { Router } from "@angular/router";
import {
  Platform,
  ModalController,
  NavParams,
  IonSlides,
} from "@ionic/angular";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-pressingsterilizerstation-image-slider",
  templateUrl: "./pressingsterilizerstation-image-slider.page.html",
  styleUrls: ["./pressingsterilizerstation-image-slider.page.scss"],
})
export class PressingsterilizerstationImageSliderPage implements OnInit {
  temperatureimages = [];
  motorimages = [];
  levelimages = [];
  digestorimages = [];
  pressmotorimages = [];
  fibreflowimages = [];
  hydraulicpressureimages = [];

  bpvimages = [];
  p1images = [];
  p3images = [];

  // From Alert Screem
  alertimages = [];

  // From Grading Screem
  hardbunchesimages = [];

  imagesArr = [];

  fromscreen = "";
  getscreenorientation = "";

  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private screenOrientation: ScreenOrientation,
    public modalController: ModalController,
    public navParams: NavParams,
    private router: Router,
    private supervisorservice: SupervisorService
  ) {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.modalController.getTop().then((modal) => {
        if (modal != null) {
          return;
        } // Don't go back if there's a modal opened
      });
    });

    this.getscreenorientation = this.screenOrientation.type;

    this.fromscreen = navParams.get("from");

    if (this.fromscreen == "Press") {
      let temperatureparams = navParams.get("temperatureitem");
      let motorparams = navParams.get("motoritem");
      let levelparams = navParams.get("levelitem");
      let digestorparams = navParams.get("digestoritem");
      let pressmotorparams = navParams.get("pressmotoritem");
      let fibreflowparams = navParams.get("fibreflowitem");
      let hydraulicpressureparams = navParams.get("hydraulicpressureitem");

      if (temperatureparams.length > 0) {
        this.temperatureimages = temperatureparams.split("~");
      }

      if (motorparams.length > 0) {
        this.motorimages = motorparams.split("~");
      }

      if (levelparams.length > 0) {
        this.levelimages = levelparams.split("~");
      }

      if (digestorparams.length > 0) {
        this.digestorimages = digestorparams.split("~");
      }

      if (pressmotorparams.length > 0) {
        this.pressmotorimages = pressmotorparams.split("~");
      }

      if (fibreflowparams.length > 0) {
        this.fibreflowimages = fibreflowparams.split("~");
      }

      if (hydraulicpressureparams.length > 0) {
        this.hydraulicpressureimages = hydraulicpressureparams.split("~");
      }

      for (let i = 0; i < this.temperatureimages.length; i++) {
        let eachitem = this.temperatureimages[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.temperatureimage"),
        };

        this.imagesArr.push(eachreq);
      }

      for (let i = 0; i < this.motorimages.length; i++) {
        let eachitem = this.motorimages[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.motorimage"),
        };

        this.imagesArr.push(eachreq);
      }

      for (let i = 0; i < this.levelimages.length; i++) {
        let eachitem = this.levelimages[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.levelimage"),
        };

        this.imagesArr.push(eachreq);
      }

      for (let i = 0; i < this.digestorimages.length; i++) {
        let eachitem = this.digestorimages[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.digestorimage"),
        };

        this.imagesArr.push(eachreq);
      }

      for (let i = 0; i < this.pressmotorimages.length; i++) {
        let eachitem = this.pressmotorimages[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.pressmotorimage"),
        };

        this.imagesArr.push(eachreq);
      }

      for (let i = 0; i < this.fibreflowimages.length; i++) {
        let eachitem = this.fibreflowimages[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.fibreflowimage"),
        };

        this.imagesArr.push(eachreq);
      }

      for (let i = 0; i < this.hydraulicpressureimages.length; i++) {
        let eachitem = this.hydraulicpressureimages[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.hydraulicpressureimage"),
        };

        this.imagesArr.push(eachreq);
      }
    }

    if (this.fromscreen == "Sterilisation") {
      let bpvparams = navParams.get("bpvitem");
      let p1params = navParams.get("p1item");
      let p3params = navParams.get("p3item");

      //console.log(bpvparams + "\n" + p1params + "\n" + p3params);

      if (bpvparams.length > 0) {
        this.bpvimages = bpvparams.split("~");
      }

      if (p1params.length > 0) {
        this.p1images = p1params.split("~");
      }

      if (p3params.length > 0) {
        this.p3images = p3params.split("~");
      }

      for (let i = 0; i < this.bpvimages.length; i++) {
        let eachitem = this.bpvimages[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.bpvimage"),
        };

        this.imagesArr.push(eachreq);
      }

      for (let i = 0; i < this.p1images.length; i++) {
        let eachitem = this.p1images[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.peakimage"),
        };

        this.imagesArr.push(eachreq);
      }

      for (let i = 0; i < this.p3images.length; i++) {
        let eachitem = this.p3images[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.p3image"),
        };

        this.imagesArr.push(eachreq);
      }
    }

    if (this.fromscreen == "Alert") {
      let alertparams = navParams.get("alertitem");

      if (alertparams.length > 0) {
        this.alertimages = alertparams.split("~");
      }

      for (let i = 0; i < this.alertimages.length; i++) {
        let eachitem = this.alertimages[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.image") + (i + 1),
        };

        this.imagesArr.push(eachreq);
      }
    }

    if (this.fromscreen == "Grading" || this.fromscreen == "GradingReport") {
      let gradingparams = navParams.get("gradingitem");

      if (gradingparams.length > 0) {
        this.hardbunchesimages = gradingparams.split("~");
      }

      for (let i = 0; i < this.hardbunchesimages.length; i++) {
        let eachitem = this.hardbunchesimages[i];
        let eachreq = {
          image: eachitem,
          title: this.translate.instant("IMAGESLIDER.image") + (i + 1),
        };

        this.imagesArr.push(eachreq);
      }
    }

    //console.log(this.imagesArr);
  }

  ngOnInit() {}

  ngOnDestroy() {
    /*this.screenOrientation.unlock();
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );*/
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

  cancel() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }
}
