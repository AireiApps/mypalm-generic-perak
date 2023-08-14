import { Component, OnInit } from "@angular/core";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { AIREIService } from "src/app/api/api.service";
import { MaintenanceServiceService } from "../../services/maintenance-serivce/maintenance-service.service";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { FormBuilder, FormControl } from "@angular/forms";
import { LanguageService } from "src/app/services/language-service/language.service";
import {
  AlertController,
  Platform,
  Animation,
  AnimationController,
  ModalController,
  IonSlides,
} from "@ionic/angular";
import { OillossReportPopupPage } from "../oilloss-report-popup/oilloss-report-popup.page";
import { OwnerserviceService } from "src/app/services/owner-service/ownerservice.service";
@Component({
  selector: "app-oilloss-reports",
  templateUrl: "./oilloss-reports.page.html",
  styleUrls: ["./oilloss-reports.page.scss"],
})
export class OillossReportsPage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  oillossesForm;

  currentdate = new Date().toISOString();

  getDate;
  reportdate = "";
  mtd = "";
  oermtdflag = 0;
  oillossesArr = [];
  retrieveflag = false;
  norecordsflag = false;
  pleasewaitflag = false;

  constructor(
    private languageService: LanguageService,
    private activatedroute: ActivatedRoute,
    private screenOrientation: ScreenOrientation,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private service: OwnerserviceService,
    public modalController: ModalController
  ) {
    this.reportdate = this.currentdate;

    this.oillossesForm = this.fb.group({
      pickdate: new FormControl(this.reportdate),
    });

    this.activatedroute.params.subscribe((val) => {
      this.screenOrientation.lock(
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      );

      this.getreport();
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    //this.getreport();
  }

  /*ngOnDestroy() {
    this.screenOrientation.unlock();
    this.screenOrientation.lock(
      this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
    );
  }*/

  btn_retrieve() {
    this.retrieveflag = true;

    this.getreport();
  }

  getreport() {
    console.log("date:", this.reportdate);
    if (this.reportdate != "") {
      this.oillossesForm.controls.pickdate.setValue(this.reportdate);
      this.getDate = moment(this.oillossesForm.value.pickdate).format(
        "YYYY-MM"
      );
    } else {
      this.getDate = "";
    }

    this.oillossesArr = [];
    this.norecordsflag = false;
    this.pleasewaitflag = true;

    var req = {
      millcode: this.userlist.millcode,
      Fromdate: this.getDate,
      language: this.languageService.selected,
    };

    //console.log(req);

    this.service.getOillossesReportList(req).then((result) => {
      var resultdata: any;
      resultdata = result;

      if (this.getDate == "") {
        this.reportdate = moment(resultdata.data.date, "YYYY-MM").format(
          "MM-YYYY"
        );
        this.oillossesForm.controls.pickdate.setValue(this.reportdate);
      }

      if (resultdata.httpcode == 200) {
        //console.log("Resuldata:", resultdata);

        this.norecordsflag = false;

        this.mtd = resultdata.mtd;
        this.oermtdflag = resultdata.oermtdflag;
        this.oillossesArr = resultdata.data;

        this.pleasewaitflag = false;
      } else {
        this.mtd = "";
        this.oermtdflag = 0;
        this.oillossesArr = [];
        this.norecordsflag = true;
        this.pleasewaitflag = false;
        //this.commonservice.presentToast("No Record Found!");
      }
    });
  }

  goBack() {
    this.retrieveflag = false;
    this.getreport();
  }

  async open_popup(item) {
    console.log("Item:", item);
    const modal = await this.modalController.create({
      component: OillossReportPopupPage,
      componentProps: {
        item: JSON.stringify(item),
      },
      showBackdrop: true,
      backdropDismiss: false,
      cssClass: ["oillossreport-modal"],
    });
    modal.onDidDismiss().then((modeldata) => {});
    return await modal.present();
  }
}
