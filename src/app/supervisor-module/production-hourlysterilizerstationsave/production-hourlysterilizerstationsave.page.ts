import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AIREIService } from "src/app/api/api.service";
import { SupervisorService } from "src/app/services/supervisor-service/supervisor.service";
import { ModalController, NavParams, AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-production-hourlysterilizerstationsave",
  templateUrl: "./production-hourlysterilizerstationsave.page.html",
  styleUrls: ["./production-hourlysterilizerstationsave.page.scss"],
})
export class ProductionHourlysterilizerstationsavePage implements OnInit {
  userlist = JSON.parse(localStorage.getItem("userlist"));

  sterilizerstationForm;

  sterilizerstationname = "";

  constructor(
    private translate: TranslateService,
    public modalController: ModalController,
    private alertController: AlertController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private commonservice: AIREIService,
    private supervisorservice: SupervisorService
  ) {
    let params = navParams.get("item");

    this.sterilizerstationname = params.machine_name;

    this.sterilizerstationForm = this.fb.group({
      txt_inletpressure: new FormControl("", Validators.required),
      txt_toppressure: new FormControl("", Validators.required),
      txt_bottompressure: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {}

  async showalert() {
    const alert = await this.alertController.create({
      mode: "md",
      header: this.translate.instant(
        "HOURLYSTERILIZATIONSTATIONSAVE.alertheader"
      ),
      cssClass: "alertmessage",
      message: this.translate.instant(
        "HOURLYSTERILIZATIONSTATIONSAVE.alertmessage"
      ),
      buttons: [
        {
          text: this.translate.instant("GENERALBUTTON.cancelbutton"),
          role: "cancel",
          cssClass: "secondary",
          handler: (cancel) => {},
        },
        {
          text: this.translate.instant("GENERALBUTTON.sure"),
          handler: () => {
            this.save();
          },
        },
      ],
    });

    await alert.present();
  }

  save() {
    if (this.sterilizerstationForm.valid) {
      this.modalController.dismiss({
        dismissed: true,
        inletpressure: this.sterilizerstationForm.value.txt_inletpressure,
        toppressure: this.sterilizerstationForm.value.txt_toppressure,
        bottompressure: this.sterilizerstationForm.value.txt_bottompressure,
      });
    } else {
      this.commonservice.presentToast(
        this.translate.instant("GENERALBUTTON.pleasefilltheform")
      );
    }
  }

  cancel() {
    this.modalController.dismiss({
      dismissed: true,
      item: "",
    });
  }

  parseString(item) {
    return JSON.stringify(item);
  }
}
