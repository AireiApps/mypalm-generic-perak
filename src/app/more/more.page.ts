import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AIREIService } from "src/app/api/api.service";
import { MoreServiceService } from "src/app/services/more-service/more-service.service";
import { HttpserviceService } from "../services/httpservice/httpservice.service";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
import { ImageUploadService } from "src/app/services/imageupload-service/imageupload";
import { LanguageService } from "src/app/services/language-service/language.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import {
  Platform,
  PopoverController,
  Animation,
  AnimationController,
} from "@ionic/angular";
import { LanguagePopoverPage } from "src/app/pages/language-popover/language-popover.page";
import { Storage } from "@ionic/storage";

import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-more",
  templateUrl: "./more.page.html",
  styleUrls: ["./more.page.scss"],
})
export class MorePage implements OnInit {
  @ViewChild("myElementRef", { static: false }) myElementRef: ElementRef;
  userlist = JSON.parse(localStorage.getItem("userlist"));
  designationid = this.userlist.desigId;

  appPages = [
    /*Commented by Suresh Kumar K on 15.09.2020 as said by Mr.Veda
    {
      title: 'About',
      name: "about",
      icon: 'information-circle-outline'
    },
    {
      title: 'Help',
      name: "help",
      icon: 'paper-plane-outline'
    },
    {
      title: "Change Password",
      name: "change_password",
      icon: "lock-closed-outline",
    },*/
  ];

  department = "";
  designation = "";

  getbodytemperature = "";
  getbodytemperaturetime = "";

  imagePaths = {
    profileimagepath: "",
  };
  mill_name = this.nl2br(this.userlist.millname);

  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private popoverController: PopoverController,
    private translate: TranslateService,
    private notifi: AuthGuardService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private commonservice: AIREIService,
    private service: MoreServiceService,
    private animationCtrl: AnimationController,
    private imgUpload: ImageUploadService,
    private screenOrientation: ScreenOrientation
  ) {
    /*Commented by Suresh Kumar K on 15.09.2020 as said by Mr.Veda
    if (this.userlist.department == 'Ffbsupplier') {
      this.appPages.push({p
        title: 'Contacts',
        name: "contacts",
        icon: 'document'
      });

      this.appPages.push({
        title: 'SMS',
        name: "sms",
        icon: 'document'
      });

    }*/

    this.activatedroute.params.subscribe((val) => {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );
    });

    this.designation = this.userlist.designation;

    this.department = this.translate.instant(
      "DEPARTMENTS." + this.userlist.department
    );

    //console.log(this.department);

    this.appPages.push({
      title: this.translate.instant("MORE.logout"),
      name: "logout",
      icon: "exit-outline",
    });

    this.appPages.push({
      title: this.translate.instant("MORE.changepassword"),
      name: "change_password",
      icon: "lock-closed-outline",
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    //console.log(this.translate.currentLang);
  }

  ionViewDidEnter() {
    //console.log(this.translate.currentLang);

    if (this.userlist.profile_image != "") {
      if (localStorage.getItem("profile") == "") {
        this.imagePaths.profileimagepath = this.userlist.profile_image;

        localStorage.setItem("profile", this.imagePaths.profileimagepath);
      } else {
        this.imagePaths.profileimagepath = localStorage.getItem("profile");
      }
    } else {
      if (localStorage.getItem("profile") == "") {
        this.imagePaths.profileimagepath = "";
        localStorage.setItem("profile", this.imagePaths.profileimagepath);
      } else {
        this.imagePaths.profileimagepath = localStorage.getItem("profile");
      }
    }

    if (
      this.designationid != 1 &&
      this.designationid != 12 &&
      this.designationid != 13 &&
      this.designationid != 14
    ) {
      const animation: Animation = this.animationCtrl
        .create()
        .addElement(this.myElementRef.nativeElement)
        .duration(1000)
        .fromTo("opacity", "0", "1");

      animation.play();
    }
  }

  async openLanguagePopOver($event) {
    //console.log($event);

    const popover = await this.popoverController.create({
      component: LanguagePopoverPage,
      event: $event,
    });
    await popover.present();
  }

  attachmentfromLibrary() {
    var areq = "profile";

    this.imgUpload.ImageUploadfromLibrary(areq).then(
      (result) => {
        var resultdata: any;
        resultdata = result;

        resultdata = JSON.parse(resultdata.response);

        if (resultdata.httpcode == 200) {
          this.imagePaths.profileimagepath = resultdata.data.uploaded_path;

          localStorage.setItem("profile", this.imagePaths.profileimagepath);

          //this.commonservice.presentToast("Image Added Successfully!");
        } else if (resultdata.httpcode == 403) {
          this.commonservice.presentToast(
            this.translate.instant("MORE.invalidimage")
          );
        } else if (resultdata.httpcode == 413) {
          this.commonservice.presentToast(
            this.translate.instant("MORE.fileistolarge")
          );
        } else if (resultdata.httpcode == 202) {
          this.commonservice.presentToast(
            this.translate.instant("MORE.uploadfailed")
          );
        } else {
          this.commonservice.presentToast(
            this.translate.instant("MORE.fileistolarge")
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  menu_action(info) {
    if (info == "logout") {
      //this.logOut();

      this.notifi.logoutupdateNotification();

      localStorage.clear();

      this.router.navigate(["/login"], { replaceUrl: true });
    }

    if (info == "changepassword") {
      this.router.navigate(["/forgotpassword"]);
    }
  }

  // chatbot() {
  //   this.router.navigate(["/chatbot"]);
  // }

  /*logOut() {
    var req = {
      login_id: this.userlist.userId,
    };

    if (this.platform.is("android")) {
      req["google_token_android"] = "";
    }

    if (this.platform.is("ios")) {
      req["google_token_ios"] = "";
    }

    this.commonservice.updatePushNotification(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        this.commonservice.presentToast("Reset Successfully");

        localStorage.clear();

        this.router.navigate(["/login"], { replaceUrl: true });
      } else {
        this.commonservice.presentToast("Reset Failed");
      }
    });
  }*/

  chatbot() {
    this.router.navigate(["/chatbot-screen"]);
  }

  nl2br(text: string) {
    return text.replace(new RegExp("\r?\n", "g"), "<br />");
  }
}
