import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  Platform,
  ModalController,
  NavParams,
  AlertController,
  IonSelect,
  IonContent,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { AIREIService } from "src/app/api/api.service";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";
import * as moment from "moment";

import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

@Component({
  selector: "app-production-ffbcage",
  templateUrl: "./production-ffbcage.page.html",
  styleUrls: ["./production-ffbcage.page.scss"],
})
export class ProductionFfbcagePage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;

  ffbcageForm;

  // Variables
  //getffbcagetotal = "";
  getffbcageinuse = "";
  getffbcagenotinuse = "";
  getffbcageunderrepair = "";

  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private languageService: LanguageService,
    private activatedroute: ActivatedRoute,
    public modalController: ModalController,
    private router: Router,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private service: SupervisorService,
    public navParams: NavParams
  ) {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.modalController.getTop().then((modal) => {
        if (modal != null) {
          return;
        } // Don't go back if there's a modal opened
      });
    });

    //this.getffbcagetotal = navParams.get("ffbcagetotal");

    this.getffbcageinuse = navParams.get("ffbcageinuse");
    if (this.getffbcageinuse == "-") {
      this.getffbcageinuse = "0";
    }

    this.getffbcagenotinuse = navParams.get("ffbcagenotinuse");
    if (this.getffbcagenotinuse == "-") {
      this.getffbcagenotinuse = "0";
    }

    this.getffbcageunderrepair = navParams.get("ffbcageunderrepair");
    if (this.getffbcageunderrepair == "-") {
      this.getffbcageunderrepair = "0";
    }

    this.ffbcageForm = this.fb.group({
      //txt_ffbcagetotal: new FormControl(this.getffbcagetotal),
      txt_ffbcageinuse: new FormControl(this.getffbcageinuse),
      txt_ffbcagenotinuse: new FormControl(this.getffbcagenotinuse),
      txt_ffbcageunderipe: new FormControl(this.getffbcageunderrepair),
    });
  }

  ngOnInit() {}

  save() {
    /*if (this.ffbcageForm.value.txt_ffbcagetotal == "") {
      this.commonservice.presentToast("Total is Mandatory");
      return false;
    }*/

    if (
      this.ffbcageForm.value.txt_ffbcageinuse == "" ||
      this.ffbcageForm.value.txt_ffbcageinuse == null
    ) {
      this.commonservice.presentToast("In Use is Mandatory");
      return false;
    }

    if (
      this.ffbcageForm.value.txt_ffbcagenotinuse == "" ||
      this.ffbcageForm.value.txt_ffbcagenotinuse == null
    ) {
      this.commonservice.presentToast("Not In Use is Mandatory");
      return false;
    }

    if (
      this.ffbcageForm.value.txt_ffbcageunderipe == "" ||
      this.ffbcageForm.value.txt_ffbcageunderipe == null
    ) {
      this.commonservice.presentToast("Under Repair is Mandatory");
      return false;
    }

    var req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      total: "0",
      inuse: this.ffbcageForm.value.txt_ffbcageinuse,
      notinuse: this.ffbcageForm.value.txt_ffbcagenotinuse,
      underrepair: this.ffbcageForm.value.txt_ffbcageunderipe,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.saveffbcages(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        this.modalController.dismiss({
          dismissed: true,
          item: "Saved",
        });
      } else {
      }
    });
  }

  cancel() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }

  numberFilter(event: any) {
    const reg = /^[0-9]{0,5}$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
}
