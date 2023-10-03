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
import * as moment from "moment";
import { WeighbridgeService } from "src/app/services/weighbridge-service/weighbridge.service";

import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

@Component({
  selector: "app-weighbridge-update-screen",
  templateUrl: "./weighbridge-update-screen.page.html",
  styleUrls: ["./weighbridge-update-screen.page.scss"],
})
export class WeighbridgeUpdateScreenPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));
  userdepartment = this.userlist.department;
  userdepartmentid = this.userlist.dept_id;
  userdesignation = this.userlist.desigId;

  weighbridgeForm;

  // Variables
  params;

  getid = "";
  getnetweight = "";
  module = "";

  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private languageService: LanguageService,
    private activatedroute: ActivatedRoute,
    public modalController: ModalController,
    private router: Router,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private service: WeighbridgeService,
    public navParams: NavParams
  ) {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.modalController.getTop().then((modal) => {
        if (modal != null) {
          return;
        } // Don't go back if there's a modal opened
      });
    });

    let viewform = navParams.get("item");
    this.module = navParams.get("module");
    this.params = JSON.parse(viewform);

    this.getid = this.params.id;
    this.getnetweight = this.params.net_weight;

    console.log(this.module);

    if (this.module == "HOME") {
      this.getnetweight = "";
    } else {
      if (this.getnetweight == "-" || this.getnetweight == null) {
        this.getnetweight = "0";
      }
    }

    this.weighbridgeForm = this.fb.group({
      txt_netweight: new FormControl(this.getnetweight),
    });
  }

  ngOnInit() {}

  save() {
    if (
      this.weighbridgeForm.value.txt_netweight == "" ||
      this.weighbridgeForm.value.txt_netweight == null
    ) {
      this.commonservice.presentToast("Net Weight is Mandatory");
      return false;
    }

    var req = {
      userid: this.userlist.userId,
      departmentid: this.userlist.dept_id,
      designationid: this.userlist.desigId,
      millcode: this.userlist.millcode,
      id: Number(this.getid),
      netweight: this.weighbridgeForm.value.txt_netweight,
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.saveweighbridgedetails(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        this.commonservice.presentToast("Net Weight Updated Successfully");

        this.modalController.dismiss({
          dismissed: true,
          item: "Saved",
        });
      } else {
        this.commonservice.presentToast("Net Weight Update Failed");
      }
    });
  }

  cancel() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
}
