import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { Platform } from "@ionic/angular";
import { AIREIService } from "src/app/api/api.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  constructor(
    private router: Router,
    private platform: Platform,
    private service: AIREIService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userlist) {
      let name = this.userlist.name;
      if (typeof name !== "undefined" && name !== null) {
        //alert(localStorage.getItem("push_token_update"));

        if (localStorage.getItem("push_token_update") == "0") {
          if (localStorage.getItem("push_token")) {
            this.updateNotification();
          }
        }

        return true;
      }
      //console.log(this.userlist);
    }
    //console.log(this.userlist);

    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return true;
  }

  updateNotification() {
    //console.log(this.platform.platforms());

    if (localStorage.getItem("push_token_update") == "0") {
      if (localStorage.getItem("push_token")) {
        var req = {
          login_id: this.userlist.userId,
        };

        if (this.platform.is("android")) {
          req["google_token_android"] = localStorage.getItem("push_token");
        }

        if (this.platform.is("ios")) {
          req["google_token_ios"] = localStorage.getItem("push_token");
        }

        //alert(localStorage.getItem("push_token"));

        this.service.updatePushNotification(req).then((result) => {
          var resultdata: any;
          resultdata = result;

          if (resultdata.httpcode == 200) {
            localStorage.setItem("push_token_update", "1");
          }
        });
      }
    }
  }

  logoutupdateNotification() {
    var req = {
      login_id: this.userlist.userId,
    };

    if (this.platform.is("android")) {
      req["google_token_android"] = "";
    }

    if (this.platform.is("ios")) {
      req["google_token_ios"] = "";
    }

    //console.log(req);

    this.service.updatePushNotification(req).then((result) => {});
  }
}
