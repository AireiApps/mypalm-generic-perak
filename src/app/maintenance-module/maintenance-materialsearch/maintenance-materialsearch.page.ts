import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { IonSearchbar } from "@ionic/angular";
import { MaintenanceServiceService } from "src/app/services/maintenance-serivce/maintenance-service.service";
import { Router } from "@angular/router";
import { ModalController, NavParams } from "@ionic/angular";
import { LanguageService } from "src/app/services/language-service/language.service";
@Component({
  selector: "app-maintenance-materialsearch",
  templateUrl: "./maintenance-materialsearch.page.html",
  styleUrls: ["./maintenance-materialsearch.page.scss"],
})
export class MaintenanceMaterialsearchPage implements OnInit {
  @ViewChild("search", { static: false }) search: IonSearchbar;

  userlist = JSON.parse(localStorage.getItem("userlist"));

  materialsearchForm;

  materialArr = [];
  searching: Boolean = false;
  searchTerm: string = "";
  type = "";
  stationid = "";
  equipmentid = "";
  statusid = "";
  title = "";
  size;
  totalpage;
  responsedata;

  norecordsflag = false;

  constructor(
    private languageService: LanguageService,
    private fb: FormBuilder,
    public modalController: ModalController,
    public navParams: NavParams,
    private maintenanceservice: MaintenanceServiceService,
    private router: Router
  ) {
    this.type = navParams.get("type");
    this.stationid = navParams.get("station_id");
    this.equipmentid = navParams.get("equipment_id");

    if (
      typeof navParams.get("status_id") !== "undefined" &&
      navParams.get("status_id") !== null
    ) {
      this.statusid = navParams.get("status_id");
    }

    if (
      typeof navParams.get("title") !== "undefined" &&
      navParams.get("title") !== null
    ) {
      this.title = navParams.get("title");
    }

    //console.log(this.statusid);

    this.materialsearchForm = this.fb.group({
      select_searchby: new FormControl(""),
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    });

    this.loadData(true, "0", this.searching);
  }

  loadData(pagerefresh: Boolean, pagenum: string, search: Boolean) {
    let searchString = "";

    if (pagerefresh == true) {
      this.materialArr = [];
    } else {
    }

    if (this.searchTerm != "") {
      searchString = this.searchTerm;
    }

    if (search == true) {
      if (pagerefresh == true) {
        this.materialArr = [];
      }
      searchString = this.searchTerm;
    } else {
      if (pagerefresh == true) {
        this.materialArr = [];
      }
    }

    searchString = this.searchTerm;

    const req = {
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
      stationid: this.stationid,
      locationid: this.equipmentid,
      searchtext: searchString,
      page: parseInt(pagenum) + 1,
      language: this.languageService.selected,
    };

    console.log(req);

    this.maintenanceservice.getPartList(req).then((result) => {
      let resultdata: any;
      resultdata = result;
      this.responsedata = resultdata;

      this.size = parseInt(resultdata.size);

      this.totalpage = resultdata.total_page * this.size;

      if (search == true) {
        if (pagerefresh == true) {
          this.materialArr = [];
        } else {
        }
      } else {
        if (pagerefresh == true) {
          this.materialArr = [];
        }
      }

      if (resultdata.httpcode == 200) {
        if (resultdata.partData.length > 0) {
          for (var i = 0; i < resultdata.partData.length; i++) {
            this.materialArr.push(resultdata.partData[i]);
          }

          this.norecordsflag = false;
        }
      } else {
        if (this.materialArr.length > 0) {
          this.norecordsflag = false;
        } else {
          this.norecordsflag = true;
        }
      }

      /*if (resultdata.httpcode == 200) {
        this.size = parseInt(resultdata.size);

        this.totalpage = resultdata.total_page * this.size;

        this.materialArr = resultdata.data;

        this.norecordsflag = false;
      } else {
        this.materialArr = [];

        this.norecordsflag = true;
      }*/
    });
  }

  onChangeSearchBy() {
    this.search.value = "";
  }

  _ionchange(event) {
    var val = event.detail.value;

    if (val && val.trim() != "") {
      this.searching = true;

      this.searchTerm = val;

      this.loadData(true, "0", this.searching);
    } else {
      this.searching = false;

      this.searchTerm = "";

      this.loadData(true, "0", this.searching);
    }
  }

  getvalue(getitem) {
    this.modalController.dismiss({
      dismissed: true,
      searchtext: this.searchTerm,
      data: JSON.stringify(getitem),
    });
  }

  pagination(event) {
    setTimeout(() => {
      if (this.materialArr.length == this.totalpage / this.size) {
        event.target.complete();
        return;
      }

      event.target.complete();

      /*console.log(this.totalpage);
      console.log(this.materialArr.length);
      console.log(this.materialArr.length / this.size);*/

      var z = Math.ceil(this.materialArr.length / this.size);

      if (this.materialArr.length < this.totalpage) {
        this.loadData(false, String(z), this.searching);
      }
    }, 500);
  }

  gettextColor(status) {
    let color;

    if (status == 1) {
      color = "#006426";
    } else if (status == 0) {
      color = "#b91818";
    } else {
      color = "#000000";
    }
    return color;
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
      searchtext: "",
      data: "",
    });
  }
}
