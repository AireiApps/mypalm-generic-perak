import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { IonSearchbar } from "@ionic/angular";
import { MaintenanceServiceService } from "src/app/services/maintenance-serivce/maintenance-service.service";
import { Router } from "@angular/router";
import { ModalController, NavParams } from "@ionic/angular";
import { LanguageService } from "src/app/services/language-service/language.service";
@Component({
  selector: "app-maintenance-activitysearch",
  templateUrl: "./maintenance-activitysearch.page.html",
  styleUrls: ["./maintenance-activitysearch.page.scss"],
})
export class MaintenanceActivitysearchPage implements OnInit {
  @ViewChild("search", { static: false }) search: IonSearchbar;

  userlist = JSON.parse(localStorage.getItem("userlist"));

  activitysearchForm;

  activitylistArray = [];
  searchtext = "";
  searchTerm: string = "";

  norecordsflag = false;

  constructor(
    private languageService: LanguageService,
    private fb: FormBuilder,
    public modalController: ModalController,
    public navParams: NavParams,
    private maintenanceservice: MaintenanceServiceService,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    });

    this.getActivity("");
  }

  onChangeSearchBy() {
    this.search.value = "";
  }

  getActivity(getsearchtext) {
    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      searchtext: getsearchtext,
      language: this.languageService.selected,
    };

    this.maintenanceservice.getActivityList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      if (resultdata.httpcode == 200) {
        this.activitylistArray = resultdata.data;
        this.norecordsflag = false;
      } else {
        this.activitylistArray = [];
        this.norecordsflag = true;
      }
    });
  }

  _ionchange(event) {
    var val = event.detail.value;

    if (event.detail.value.length >= 0) {
      this.searchTerm = val;

      this.getActivity(val);
    } else {
      this.searchTerm = "";

      this.activitylistArray = [];

      this.norecordsflag = true;
    }
  }

  getvalue(getitem) {
    this.modalController.dismiss({
      dismissed: true,
      searchtext: this.searchTerm,
      data: JSON.stringify(getitem),
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
      data: "",
    });
  }
}
