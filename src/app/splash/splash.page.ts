import { Component, OnInit } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { Platform } from "@ionic/angular";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { OpenNativeSettings } from "@ionic-native/open-native-settings/ngx";
import { Market } from "@ionic-native/market/ngx";
import { Router } from "@angular/router";

@Component({
  selector: "app-splash",
  templateUrl: "./splash.page.html",
  styleUrls: ["./splash.page.scss"],
})
export class SplashPage implements OnInit {
  constructor(
    public splashScreen: SplashScreen,
    private router: Router,
    private platform: Platform,
    private appVersion: AppVersion,
    private market: Market
  ) {
    console.log("splash screen");
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.splashScreen.hide();

    setTimeout(() => {
      this.loginscreen();
    }, 3000);
  }

  loginscreen() {
    this.router.navigateByUrl("login");
  }
}
