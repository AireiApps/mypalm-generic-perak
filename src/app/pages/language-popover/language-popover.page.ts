import { Component, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { LanguageService } from "src/app/services/language-service/language.service";
import { AIREIService } from "src/app/api/api.service";
import { AuthGuardService } from "src/app/services/authguard/auth-guard.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-language-popover",
  templateUrl: "./language-popover.page.html",
  styleUrls: ["./language-popover.page.scss"],
})
export class LanguagePopoverPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  languages = [];
  selected = "";

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private languageService: LanguageService,
    private notifi: AuthGuardService,
    private service: AIREIService
  ) {}

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.selected = this.languageService.selected;
  }

  select(lng) {
    //console.log(lng);

    this.callAPI(lng);
  }

  callAPI(lng) {
    if (localStorage.getItem("userlist") === null) {
      this.languageService.setLanguage(lng);

      this.popoverController.dismiss();
    } else {
      var languageid = "0";

      if (lng == "English") {
        languageid = "1";
      }

      if (lng == "Malay") {
        languageid = "2";
      }

      const req = {
        user_id: this.userlist.userId,
        millcode: this.userlist.millcode,
        departmentid: this.userlist.dept_id,
        language_id: languageid,
      };

      this.service.updateLanguage(req).then((result) => {
        let resultdata: any;
        resultdata = result;
        if (resultdata.httpcode == 200) {
          this.languageService.setLanguage(lng);
          this.popoverController.dismiss();

          this.notifi.logoutupdateNotification();

          localStorage.clear();

          this.router.navigateByUrl("/login");
        }
      });
    }
  }
}
