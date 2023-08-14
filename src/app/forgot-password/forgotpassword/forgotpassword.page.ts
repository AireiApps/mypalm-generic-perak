import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  FormGroup,
} from "@angular/forms";
import { MoreServiceService } from "src/app/services/more-service/more-service.service";
import { AIREIService } from "src/app/api/api.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";
@Component({
  selector: "app-forgotpassword",
  templateUrl: "./forgotpassword.page.html",
  styleUrls: ["./forgotpassword.page.scss"],
})
export class ForgotpasswordPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  userdesignation = this.userlist.designation;

  changepasswordForm;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private service: MoreServiceService,
    private commonservice: AIREIService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.changepasswordForm = this.fb.group({
      newpassword: new FormControl("", Validators.required),
      confirmpassword: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {}

  btn_save() {
    if (this.changepasswordForm.value.newpassword == "") {
      this.commonservice.presentToast(
        this.translate.instant("CHANGEPASSWORD.newpasswordwarning")
      );
      return false;
    }

    if (this.changepasswordForm.value.confirmpassword == "") {
      this.commonservice.presentToast(
        this.translate.instant("CHANGEPASSWORD.confirmpasswordwarning")
      );
      return false;
    }

    if (
      this.changepasswordForm.value.newpassword !=
      this.changepasswordForm.value.confirmpassword
    ) {
      this.commonservice.presentToast(
        this.translate.instant("CHANGEPASSWORD.error")
      );
      return false;
    }

    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      password: this.changepasswordForm.value.newpassword,
      confirmpassword: this.changepasswordForm.value.confirmpassword,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.saveForgotPassword(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      console.log(resultdata);

      if (resultdata.httpcode == 200) {
        this.commonservice.presentToast(
          this.translate.instant("CHANGEPASSWORD.updatedsuccessfully")
        );

        localStorage.clear();
        this.router.navigateByUrl("/login");
      } else {
        this.commonservice.presentToast(
          this.translate.instant("CHANGEPASSWORD.updatefailed")
        );
      }
    });
  }
}
