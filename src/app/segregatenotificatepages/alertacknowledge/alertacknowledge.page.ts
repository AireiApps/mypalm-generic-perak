import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { ImageUploadService } from "src/app/services/imageupload-service/imageupload";
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonContent,
} from "@ionic/angular";
import { Router } from "@angular/router";

// Language Convertion
import { LanguageService } from "src/app/services/language-service/language.service";
import { TranslateService } from "@ngx-translate/core";

import { PressingsterilizerstationImageSliderPage } from "src/app/supervisor-module/pressingsterilizerstation-image-slider/pressingsterilizerstation-image-slider.page";

@Component({
  selector: "app-alertacknowledge",
  templateUrl: "./alertacknowledge.page.html",
  styleUrls: ["./alertacknowledge.page.scss"],
})
export class AlertacknowledgePage implements OnInit {
  @ViewChild("pageTop") pageTop: IonContent;

  userlist = JSON.parse(localStorage.getItem("userlist"));

  params;
  alertattendForm;

  title = "";
  getbaseid = "";
  getid = "";
  gettype = "";
  alertmessage = "";
  notificationtext = "";
  selectedlanguage = "";
  norecordflag = false;
  isDisable = false;

  imagetype = "";
  imageview = "";

  imagePaths = {
    attendimage_path: "",
  };

  attendimagesArr = [];

  dataArr = [];

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private translate: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    public navParams: NavParams,
    private alertController: AlertController,
    public modalController: ModalController,
    public viewimagemodalController: ModalController,
    private commonservice: AIREIService,
    private imgUpload: ImageUploadService
  ) {
    this.selectedlanguage = this.languageService.selected;

    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.modalController.getTop().then((modal) => {
        if (modal != null) {
          return;
        } // Don't go back if there's a modal opened
      });
    });

    let viewform = navParams.get("item");
    this.params = JSON.parse(viewform);

    this.title = this.params.title;
    this.getbaseid = this.params.baseid;
    this.getid = this.params.id;
    this.gettype = this.params.type;

    this.alertattendForm = this.fb.group({
      txt_attendimageupload: new FormControl(""),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getAlertDetails();
  }

  getAlertDetails() {
    const req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      baseid: this.getbaseid,
      id: this.getid,
      type: this.gettype,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.commonservice.getalertdetails(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.notificationtext = this.nl2br(
          resultdata.data[0].notification_text
        );

        this.alertmessage = "";

        this.norecordflag = false;
      } else if (resultdata.httpcode == 401) {
        this.notificationtext = this.nl2br(
          resultdata.data[0].notification_text
        );

        this.alertmessage = resultdata.message;

        this.norecordflag = false;
      } else {
        this.alertmessage = "";
        this.norecordflag = true;
      }
    });
  }

  imageUpload(type) {
    this.imgUpload.ImageUploadCommon(type).then(
      (result) => {
        var resultdata: any;
        resultdata = result;

        resultdata = JSON.parse(resultdata.response);

        if (resultdata.httpcode == 200) {
          if (type == "Attend") {
            this.imagePaths.attendimage_path = resultdata.data.uploaded_path;

            this.attendimagesArr.push(this.imagePaths.attendimage_path);

            if (this.attendimagesArr.length == 1) {
              this.alertattendForm.controls.txt_attendimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.attendimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
              );
            } else if (this.attendimagesArr.length > 1) {
              this.alertattendForm.controls.txt_attendimageupload.setValue(
                this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
                  this.attendimagesArr.length +
                  this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
              );
            } else {
              this.alertattendForm.controls.txt_attendimageupload.setValue("");
            }
          }
        } else {
          this.commonservice.presentToast(
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

    if (type == "Attend") {
      this.imagePaths.attendimage_path = dummyimagepath;

      this.attendimagesArr.push(this.imagePaths.attendimage_path);

      if (this.attendimagesArr.length == 1) {
        this.alertattendForm.controls.txt_attendimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.attendimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image1")
        );
      } else if (this.attendimagesArr.length > 1) {
        this.alertattendForm.controls.txt_attendimageupload.setValue(
          this.translate.instant("HOURLYPRESSSTATIONSAVE.uploded") +
            this.attendimagesArr.length +
            this.translate.instant("HOURLYPRESSSTATIONSAVE.image2")
        );
      } else {
        this.alertattendForm.controls.txt_attendimageupload.setValue("");
      }
    }*/
  }

  btn_view(type) {
    this.imagetype = type;

    if (this.imagetype == "Attend") {
      if (this.attendimagesArr.length > 0) {
        this.imageview = "";

        this.imageview = this.attendimagesArr.join("~");

        this.ViewImages(this.imageview);
      } else {
        this.imageview = "";

        if (this.attendimagesArr.length > 1) {
          this.commonservice.presentToast(
            this.translate.instant("HOURLYPRESSSTATIONSAVE.imagesnotfound")
          );
        } else {
          this.commonservice.presentToast(
            this.translate.instant("HOURLYPRESSSTATIONSAVE.imagenotfound")
          );
        }
      }
    }
  }

  btn_save() {
    if (this.getbaseid == "") {
      this.commonservice.presentToast(
        this.translate.instant("ALERTACKNOWLEDGE.baseidmandatory")
      );
      return;
    }

    if (this.getid == "") {
      this.commonservice.presentToast(
        this.translate.instant("ALERTACKNOWLEDGE.idmandatory")
      );
      return;
    }

    if (this.gettype == "") {
      this.commonservice.presentToast(
        this.translate.instant("ALERTACKNOWLEDGE.typemandatory")
      );
      return;
    }

    if (this.attendimagesArr.length <= 0) {
      this.commonservice.presentToast(
        this.translate.instant("ALERTACKNOWLEDGE.attendimagemandatory")
      );
      return;
    }

    this.save();
  }

  save() {
    var req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      baseid: this.getbaseid,
      id: this.getid,
      type: this.gettype,
      rectify_status: "1",
      remarks: "",
      images: this.attendimagesArr.join("~"),
      language: this.languageService.selected,
    };

    console.log(req);

    this.commonservice.updatealertnotification(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        this.isDisable = false;

        this.commonservice.presentToast(
          this.translate.instant("ALERTACKNOWLEDGE.attendsuccess")
        );

        this.btn_close();
      } else {
        this.isDisable = false;

        this.commonservice.presentToast(
          this.translate.instant("ALERTACKNOWLEDGE.attendfailed")
        );
      }
    });
  }

  btn_close() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }

  async ViewImages(attendimages) {
    if (attendimages != "") {
      const viewimagemodal = await this.viewimagemodalController.create({
        component: PressingsterilizerstationImageSliderPage,
        componentProps: {
          from: "Alert",
          alertitem: attendimages,
        },
      });

      viewimagemodal.onDidDismiss().then((data) => {});

      return await viewimagemodal.present();
    }
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
