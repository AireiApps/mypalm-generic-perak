import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AIREIService } from "../api/api.service";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { LanguageService } from "src/app/services/language-service/language.service";

import {
  Animation,
  AnimationController,
  PopoverController,
} from "@ionic/angular";
import { LanguagePopoverPage } from "src/app/pages/language-popover/language-popover.page";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  @ViewChild("logo", { static: false }) logo: ElementRef;
  @ViewChild("footer", { static: false }) footer: ElementRef;

  @ViewChild("millcodeinput") millcodeInput;
  @ViewChild("usernameinput") usernameInput;
  @ViewChild("passwordinput") passwordInput;

  departmentArr = [];
  app_version = "";
  registerCredentials = { millcode: "", username: "", password: "" };
  loginForm;
  userlist = JSON.parse(localStorage.getItem("userlist"));

  uiEnable = false;
  isDisabled = false;

  // Password View
  showPassword = false;
  passwordIcon = "eye-outline";

  constructor(
    private popoverController: PopoverController,
    private translate: TranslateService,
    private languageService: LanguageService,
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private appVersion: AppVersion,
    private service: AIREIService,
    private nativeStorage: NativeStorage,
    private screenOrientation: ScreenOrientation,
    private animationcontroller: AnimationController
  ) {
    this.loginForm = this.fb.group({
      millcode: new FormControl("", Validators.required),
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    const logoAnimation: Animation = this.animationcontroller
      .create()
      .addElement(this.logo.nativeElement)
      .duration(1500)
      .fromTo("opacity", "0", "1");

    logoAnimation.play();

    const footerAnimation: Animation = this.animationcontroller
      .create()
      .addElement(this.footer.nativeElement)
      .duration(1000)
      .fromTo("transform", "translateY(200px)", "translateY(0px)")
      .fromTo("opacity", "0", "1");

    footerAnimation.play();

    this.checkButtonFlag();
  }

  checkButtonFlag() {
    this.service.checkFlag().then((result) => {
      var resultdata: any;
      resultdata = result;

      //console.log(resultdata);

      if (resultdata.login_check == "1") {
        //console.log(resultdata.login_check);
        this.uiEnable = true;

        this.getVersion();
      } else {
        //console.log(resultdata.login_check);
        this.uiEnable = false;

        this.getVersion();
      }
    });
  }

  getVersion() {
    this.appVersion.getVersionNumber().then(
      (versionNumber) => {
        this.app_version = versionNumber;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onChangeMillCode(event) {
    /*if (event.detail.value.length >= 4) {
      this.getapiurl(event.detail.value);
    } else {
      this.isDisabled = true;
    }*/

    if (event.detail.value.length == 4) {
      this.getapiurl(event.detail.value);
    }
  }

  onKeydown(event, nextfield) {
    if (event.key == "Enter" && nextfield == "username") {
      this.usernameInput.setFocus();
    } else if (event.key == "Enter" && nextfield == "password") {
      this.passwordInput.setFocus();
    } else if (event.key == "Enter" && nextfield == "done") {
      this.btn_login();
    }
  }

  getapiurl(value) {
    //console.log(this.languageService.selected);

    var req = {
      millcode: value,
      version: this.app_version,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.millcodeauthentication(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        //this.isDisabled = false;
        localStorage.setItem("endpoint", String(resultdata.data.javaapiurl));
      } else {
        //this.isDisabled = true;

        this.loginForm.controls.username.setValue("");
        this.loginForm.controls.password.setValue("");

        localStorage.setItem("endpoint", "");
        this.service.presentToast(
          this.translate.instant("LOGIN.invalidmillcode")
        );
      }
    });
  }

  togglePassword() {
    /*if (!this.isDisabled) {
      if (this.loginForm.value.password != "") {
        this.showPassword = !this.showPassword;

        if (this.passwordIcon == "eye-outline") {
          this.passwordIcon = "eye-off-outline";
        } else {
          this.passwordIcon = "eye-outline";
        }
      }
    }*/

    if (this.loginForm.value.password != "") {
      this.showPassword = !this.showPassword;

      if (this.passwordIcon == "eye-outline") {
        this.passwordIcon = "eye-off-outline";
      } else {
        this.passwordIcon = "eye-outline";
      }
    }
  }

  btn_login() {
    //console.log(this.languageService.selected);

    var selectedlanguageid = "1";
    var selectedlanguage = "English";

    if (this.languageService.selected == "English") {
      selectedlanguageid = "1";
      selectedlanguage = this.languageService.selected;
    }

    if (this.languageService.selected == "Malay") {
      selectedlanguageid = "2";
      selectedlanguage = this.languageService.selected;
    }

    if (this.loginForm.value.millcode == "") {
      this.service.presentToast(
        this.translate.instant("LOGIN.millcodeerrortoast")
      );
      return;
    }

    if (this.loginForm.value.username == "") {
      this.service.presentToast(
        this.translate.instant("LOGIN.usernameerrortoast")
      );
      return;
    }

    if (this.loginForm.value.password == "") {
      this.service.presentToast(
        this.translate.instant("LOGIN.passworderrortoast")
      );
      return;
    }

    console.log(localStorage.getItem("endpoint"));

    if (localStorage.getItem("endpoint") == "") {
      this.service.presentToast(
        this.translate.instant("LOGIN.millcodeauthontication")
      );
      return;
    }

    this.isDisabled = true;

    var req = {
      millcode: this.loginForm.value.millcode,
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      language: this.languageService.selected,
      languageid: selectedlanguageid,
      version: this.app_version,
    };

    console.log(req);

    this.service.signIn(req).then((result) => {
      var resultdata: any;
      resultdata = result;
      this.loginForm.reset();

      if (resultdata.httpcode == 200) {
        //this.languageService.setLanguage("Malay");

        //console.log(resultdata.data);

        localStorage.setItem("userlist", JSON.stringify(resultdata.data));

        localStorage.setItem("runninghourid", "0");

        localStorage.setItem("scheduledpopup", "");

        localStorage.setItem("profile", "");

        localStorage.setItem("notificationdata", "");

        this.nativeStorage
          .setItem("userlist", JSON.stringify(resultdata.data))
          .then(
            () => {
              console.log("Stored item!");
            },
            (error) => console.error("Error storing item", error)
          );

        this.service.presentToast(
          this.translate.instant("LOGIN.loginsuccessfully")
        );

        setTimeout(() => {
          this.isDisabled = false;
          this.location.go("/");
          window.location.reload();
          this.router.navigate(["/tabs"]);
        }, 1000);
      } else {
        this.isDisabled = false;

        this.service.presentToast(resultdata.message);
      }
    });
  }

  async openLanguagePopOver($event) {
    //console.log($event);

    const popover = await this.popoverController.create({
      component: LanguagePopoverPage,
      event: $event,
    });
    await popover.present();
  }

  signup() {
    this.router.navigate(["/signup"]);
  }
}
