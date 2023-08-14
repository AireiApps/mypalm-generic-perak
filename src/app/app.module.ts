import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { DatePicker } from "@ionic-native/date-picker/ngx";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import { File } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { OpenNativeSettings } from "@ionic-native/open-native-settings/ngx";
import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import {
  MediaCapture,
  MediaFile,
  CaptureError,
  CaptureImageOptions,
} from "@ionic-native/media-capture/ngx";
import { PipesModule } from "../app/pipes/pipes.module";
import { AutosizeModule } from "ngx-autosize";

import { Market } from "@ionic-native/market/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { GeneralserviceService } from "src/app/services/generalservice/generalservice.service";
import { Badge } from "@ionic-native/badge/ngx";
import { DatePipe } from "@angular/common";

/*Translate Language --- Starts*/
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { IonicStorageModule, Storage } from "@ionic/storage";
import { LanguagePopoverPage } from "./pages/language-popover/language-popover.page";
import { LanguagePopoverPageModule } from "./pages/language-popover/language-popover.module";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}
/*Translate Language --- Ends*/

import { enterAnimation } from "./animations/nav-animation";

const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyCZ3hUNPiE4n7Ca0cENBQYzVYqfP-eNcqI",
    authDomain: "mmsairei.firebaseapp.com",
    databaseURL: "https://mmsairei.firebaseio.com",
    projectId: "mmsairei",
    storageBucket: "mmsairei.appspot.com",
    messagingSenderId: "56083869401",
    appId: "1:56083869401:web:888ad6a1b44d94e52118c8",
    measurementId: "G-HCKM5MRXCC",
  },
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ navAnimation: enterAnimation }),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AutosizeModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    LanguagePopoverPageModule,
  ],

  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    DatePicker,
    Camera,
    FilePath,
    File,
    BarcodeScanner,
    FileTransfer,
    LocalNotifications,
    NativeStorage,
    AndroidPermissions,
    OpenNativeSettings,
    UniqueDeviceID,
    ScreenOrientation,
    AppVersion,
    Market,
    MediaCapture,
    GeneralserviceService,
    Badge,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
