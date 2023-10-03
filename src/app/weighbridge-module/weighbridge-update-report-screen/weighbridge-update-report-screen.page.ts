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

import { Plugins, KeyboardInfo } from "@capacitor/core";
const { Keyboard } = Plugins;

import { ActivatedRoute, Router } from "@angular/router";
import { AIREIService } from "src/app/api/api.service";
import * as moment from "moment";
import { WeighbridgeService } from "src/app/services/weighbridge-service/weighbridge.service";

import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/services/language-service/language.service";

@Component({
  selector: "app-weighbridge-update-report-screen",
  templateUrl: "./weighbridge-update-report-screen.page.html",
  styleUrls: ["./weighbridge-update-report-screen.page.scss"],
})
export class WeighbridgeUpdateReportScreenPage implements OnInit {
  @ViewChild("pageBottom") pageBottom: IonContent;

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
  weighbridgeid = 0;
  hardbunches = "";
  dateandtime = "";
  loosefruits = "";
  netweight = "";
  overduepercent = "";
  ripenesspercent = "";
  underripebunches = "";

  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private languageService: LanguageService,
    private activatedroute: ActivatedRoute,
    public modalController: ModalController,
    public vehiclemodalController: ModalController,
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

    console.log(this.params);

    if (this.module == "NOTIFICATION SCREEN") {
      this.weighbridgeid = this.params.baseid;

      this.getdetails(this.weighbridgeid);
    } else {
      this.weighbridgeid = Number(this.params.id);
      this.hardbunches = this.params.hard_bunch_percent;
      this.loosefruits = this.params.loose_fruit_percent;
      this.netweight = this.params.net_weight;
      this.overduepercent = this.params.overdue_percent;
      this.ripenesspercent = this.params.ripeness_percent;
      this.underripebunches = this.params.under_ripe_bunch_percent;
    }

    this.weighbridgeForm = this.fb.group({
      txt_netweight: new FormControl(this.netweight),
    });
  }

  ngOnInit() {}

  getdetails(getid) {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      id: getid,
      page: 1,
      fromdate: "",
      todate: "",
      language: this.languageService.selected,
    };

    console.log(req);

    this.service.getweighbridgedetails(req).then((result) => {
      let resultdata: any;
      resultdata = result;

      if (resultdata.httpcode == 200) {
        console.log(resultdata.data);

        this.weighbridgeid = Number(resultdata.data[0].id);
        this.hardbunches = resultdata.data[0].hard_bunch_percent;
        this.loosefruits = resultdata.data[0].loose_fruit_percent;
        this.netweight = resultdata.data[0].net_weight;
        this.overduepercent = resultdata.data[0].overdue_percent;
        this.ripenesspercent = resultdata.data[0].ripeness_percent;
        this.underripebunches = resultdata.data[0].under_ripe_bunch_percent;
      }
    });
  }

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
      id: this.weighbridgeid,
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

  scrollbottom() {
    Keyboard.addListener("keyboardWillShow", (info: KeyboardInfo) => {
      setTimeout(() => {
        this.pageBottom.scrollToPoint(
          0,
          document.getElementById("txt_netweight").offsetTop,
          20
        );
      }, 200);
    });

    Keyboard.addListener("keyboardDidShow", (info: KeyboardInfo) => {
      setTimeout(() => {
        this.pageBottom.scrollToPoint(
          0,
          document.getElementById("txt_netweight").offsetTop,
          20
        );
      }, 200);
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
