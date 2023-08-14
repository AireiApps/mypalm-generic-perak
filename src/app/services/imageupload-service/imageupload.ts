import { Injectable } from "@angular/core";
import {
  ToastController,
  Platform,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";
import { HttpClient, HttpParams } from "@angular/common/http";
import { appsettings } from "src/app/appsettings";
import { FormBuilder } from "@angular/forms";
// import { Transfer, TransferObject } from '@ionic-native/transfer';
import { AIREIService } from "src/app/api/api.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import { File } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { DomSanitizer } from "@angular/platform-browser";
// import { TransferObject } from '@ionic-native/transfer';
import {
  MediaCapture,
  MediaFile,
  CaptureError,
  CaptureVideoOptions,
} from "@ionic-native/media-capture/ngx";

declare var cordova: any;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPE = "video/mp4";

@Injectable({
  providedIn: "root",
})
export class ImageUploadService {
  columnName;
  userlist = JSON.parse(localStorage.getItem("userlist"));

  constructor(
    private fb: FormBuilder,
    private DomSanitizer: DomSanitizer,
    private transfer: FileTransfer,
    public platform: Platform,
    private commonservice: AIREIService,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private service: AIREIService,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private mediaCapture: MediaCapture
  ) {}

  getUrl(typeurl) {
    var url;

    url = localStorage.getItem("endpoint") + appsettings.imgUpload;

    return url;
  }

  public pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadMediaPersonalizedChat(
    mediapath,
    type,
    resolve,
    reject,
    imgtype
  ) {
    var url =
      localStorage.getItem("endpoint") + appsettings.generic_image_upload;
    var filename = mediapath;
    var targetPath;
    if (type == "gallery") {
      targetPath = this.pathForImage(mediapath);
    } else {
      targetPath = mediapath;
    }

    //console.log(targetPath);

    let reqparam = {
      request: imgtype,
      user_id: this.userlist.userId,
      millcode: this.userlist.millcode,
      dept_id: this.userlist.dept_id,
      design_id: this.userlist.desigId,
    };

    var options = {
      fileKey: "upload_filename",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: reqparam,
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    //this.commonservice.presentToast(targetPath + "\n" + url + "\n" + options);

    this.commonservice.presentLoading();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(
      (data) => {
        this.commonservice.dimmissLoading();
        var resultdata: any;
        resultdata = data;
        //console.log(JSON.stringify(resultdata.response));
        resolve(resultdata);
      },
      (err) => {
        this.commonservice.dimmissLoading();
        reject(err);
        this.commonservice.presentToast("Error while uploading file.");
      }
    );
  }

  public uploadMedia(mediapath, type, resolve, reject) {
    console.log(this.userlist);

    var url = localStorage.getItem("endpoint") + appsettings.imgUpload;
    var filename = mediapath;
    var targetPath;
    if (type == "gallery") {
      targetPath = this.pathForImage(mediapath);
    } else {
      targetPath = mediapath;
    }
    console.log(targetPath);

    var data = {
      request: "accounts",
      columnname: this.columnName,
      inserted_id: this.userlist.accId,
      acc_id: this.userlist.accId,
      millcode: this.userlist.millcode,
    };

    console.log(data);

    var options = {
      fileKey: "upload_filename",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: data,
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    this.commonservice.presentToast(targetPath + "\n" + url + "\n" + options);

    this.commonservice.presentLoading();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(
      (data) => {
        this.commonservice.dimmissLoading();
        var resultdata: any;
        resultdata = data;
        resultdata["columnName"] = this.columnName;
        console.log(JSON.stringify(resultdata.response));
        //console.log(resultdata.response.code);
        resolve(resultdata);

        // this.navCtrl.pop();
      },
      (err) => {
        reject(err);
        //console.log(JSON.stringify(err));
        this.commonservice.presentToast("Error while uploading file.");
      }
    );
  }

  openCamera(type) {
    this.columnName = type;

    return new Promise((resolve, reject) => {
      var options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500,
        encodingType: this.camera.EncodingType.JPEG,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          console.log(imageData);

          this.uploadMedia(imageData, "camera", resolve, reject);
          // let base64Image = "data:image/jpeg;base64," + imageData;
        },
        (err) => {
          // Handle error
          reject(err);
        }
      );
    });
  }

  public takePicture(sourceType, type) {
    this.columnName = type;

    return new Promise((resolve, reject) => {
      var options = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.FILE_URI,
      };

      // Get the data of an image
      this.camera.getPicture(options).then(
        (imagePath) => {
          // Special handling for Android library
          if (
            this.platform.is("android") &&
            sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
          ) {
            this.filePath.resolveNativePath(imagePath).then((filePath) => {
              let correctPath = filePath.substr(
                0,
                filePath.lastIndexOf("/") + 1
              );
              let currentName = imagePath.substring(
                imagePath.lastIndexOf("/") + 1,
                imagePath.lastIndexOf("?")
              );
              this.copyFileToLocalDir(
                correctPath,
                currentName,
                this.createFileName(),
                resolve,
                reject
              );
            });
          } else {
            var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
            var correctPath = imagePath.substr(
              0,
              imagePath.lastIndexOf("/") + 1
            );
            this.copyFileToLocalDir(
              correctPath,
              currentName,
              this.createFileName(),
              resolve,
              reject
            );
          }
        },
        (err) => {
          reject(err);

          this.commonservice.presentToast("Error while selecting image.");
        }
      );
    });
    // Create options for the Camera Dialog
  }

  private copyFileToLocalDir(
    namePath,
    currentName,
    newFileName,
    resolve,
    reject
  ) {
    this.file
      .copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName)
      .then(
        (success) => {
          this.uploadMedia(newFileName, "gallery", resolve, reject);
          // this.lastImage = newFileName;
          // this.displayimgepath = null;
          // //console.log(this.lastImage);
        },
        (error) => {
          reject(error);
          this.commonservice.presentToast("Error while storing file.");
        }
      );
  }

  private copyFileToLocalDirPersonalizedChat(
    imgtype,
    namePath,
    currentName,
    newFileName,
    resolve,
    reject
  ) {
    this.file
      .copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName)
      .then(
        (success) => {
          this.uploadMediaPersonalizedChat(
            newFileName,
            "gallery",
            resolve,
            reject,
            imgtype
          );
        },
        (error) => {
          reject(error);
          this.commonservice.presentToast("Error while storing file.");
        }
      );
  }

  ffbCameraUpload() {
    return new Promise((resolve, reject) => {
      var options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        targetWidth: 500,
        targetHeight: 500,
        correctOrientation: true,
        encodingType: this.camera.EncodingType.JPEG,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          console.log(imageData);
          resolve(imageData);
          // this.ffbfileTransfer(params, imageData, resolve, reject);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  gradingfileTransfer(params, mediapath) {
    return new Promise((resolve, reject) => {
      var url = localStorage.getItem("endpoint") + appsettings.imgUpload;
      var filename = mediapath;
      var targetPath;

      targetPath = mediapath;

      var data = params;
      console.log(data);

      var options = {
        fileKey: "upload_filename",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: data,
      };

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.commonservice.presentLoading();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, url, options).then(
        (data) => {
          this.commonservice.dimmissLoading();
          var resultdata: any;
          resultdata = data;
          console.log(JSON.stringify(resultdata.response));
          //console.log(resultdata.response.code);
          resolve(resultdata);

          // this.navCtrl.pop();
        },
        (err) => {
          reject(err);
          //console.log(JSON.stringify(err));
          this.commonservice.presentToast("Error while uploading file.");
        }
      );
    });
  }

  ImagegalleryUpload(params, mediapath) {
    return new Promise((resolve, reject) => {
      var url = localStorage.getItem("endpoint") + appsettings.log_file_upload;

      var filename = mediapath;
      var targetPath;

      targetPath = mediapath;

      let reqparam = {
        from_id: this.userlist.userId,
        user_name: this.userlist.Username,
        call_log_json: params,
        millcode: this.userlist.millcode,
      };

      console.log(reqparam);

      var options = {
        fileKey: "upload_filename",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: reqparam,
      };

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.commonservice.presentLoading();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, url, options).then(
        (data) => {
          this.commonservice.dimmissLoading();
          var resultdata: any;
          resultdata = data;
          console.log(JSON.stringify(resultdata.response));
          //console.log(resultdata.response.code);
          resolve(resultdata);

          // this.navCtrl.pop();
        },
        (err) => {
          reject(err);
          //console.log(JSON.stringify(err));
          this.commonservice.presentToast("Error while uploading file.");
        }
      );
    });
  }

  /*Commented on 23.09.2020 by Suresh Kumar K
  ImageUploadSupervisor(imgtype) {
    return new Promise((resolve, reject) => {
      var options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500,
        encodingType: this.camera.EncodingType.JPEG,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          var url = localStorage.getItem("endpoint") +appsettings.generic_image_upload;

          var filename = imageData;
          var targetPath;
          targetPath = imageData;

          let reqparam = {
            request: imgtype,
          };

          console.log(reqparam);

          var options = {
            fileKey: "upload_filename",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: reqparam,
          };
          console.log(reqparam);
          const fileTransfer: FileTransferObject = this.transfer.create();
          this.commonservice.presentLoading();
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options).then(
            (data) => {
              this.commonservice.dimmissLoading();
              var resultdata: any;
              resultdata = data;
              console.log(JSON.stringify(resultdata.response));
              resolve(resultdata);
            },
            (err) => {
              reject(err);
              this.commonservice.presentToast("Error while uploading file.");
            }
          );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }*/

  ImageUploadCommon(imagetype) {
    return new Promise((resolve, reject) => {
      var options = {
        quality: 80,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        allowEdit: true, //Added on 21.07.2023
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500,
        encodingType: this.camera.EncodingType.JPEG,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          var url =
            localStorage.getItem("endpoint") + appsettings.generic_image_upload;

          var filename = imageData;
          var targetPath;
          targetPath = imageData;

          let reqparam = {
            request: "",
            user_id: this.userlist.userId,
            millcode: this.userlist.millcode,
            dept_id: this.userlist.dept_id,
            type: imagetype,
          };

          //console.log(reqparam);

          var options = {
            fileKey: "upload_filename",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: reqparam,
          };

          //console.log(reqparam);

          const fileTransfer: FileTransferObject = this.transfer.create();
          this.commonservice.presentLoading();
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options).then(
            (data) => {
              this.camera.cleanup().then(() => {
                this.commonservice.presentToast("Cache Cleaned Successfully");
              });

              this.commonservice.dimmissLoading();
              var resultdata: any;
              resultdata = data;
              resolve(resultdata);
            },
            (err) => {
              reject(err);
              this.commonservice.presentToast("Error while uploading file.");
            }
          );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  ImageUploadSupervisor(imgtype) {
    return new Promise((resolve, reject) => {
      var options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500,
        encodingType: this.camera.EncodingType.JPEG,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          var url =
            localStorage.getItem("endpoint") + appsettings.generic_image_upload;

          var filename = imageData;
          var targetPath;
          targetPath = imageData;

          let reqparam = {
            request: imgtype,
            millcode: this.userlist.millcode,
          };

          var options = {
            fileKey: "upload_filename",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: reqparam,
          };
          console.log(reqparam);
          const fileTransfer: FileTransferObject = this.transfer.create();
          this.commonservice.presentLoading();
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options).then(
            (data) => {
              this.commonservice.dimmissLoading();
              var resultdata: any;
              resultdata = data;
              //console.log(JSON.stringify(resultdata.response));
              resolve(resultdata);
            },
            (err) => {
              reject(err);
              this.commonservice.presentToast("Error while uploading file.");
            }
          );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  ImageUploadfromLibrary(imgtype) {
    var sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;

    return new Promise((resolve, reject) => {
      /*if (
        imgtype == "BroadcastCommunication" ||
        imgtype == "PersonalizedCommunication"
      ) {
        var options = {
          quality: 60,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          saveToPhotoAlbum: false,
          correctOrientation: true,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
        };
      } else {
        var options = {
          quality: 100,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          saveToPhotoAlbum: false,
          correctOrientation: true,
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
        };
      }*/

      var options = {
        quality: 80,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
      };

      this.camera.getPicture(options).then(
        (imageData) => {
          if (
            this.platform.is("android") &&
            sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
          ) {
            this.filePath.resolveNativePath(imageData).then((filePath) => {
              let correctPath = filePath.substr(
                0,
                filePath.lastIndexOf("/") + 1
              );
              let currentName = imageData.substring(
                imageData.lastIndexOf("/") + 1,
                imageData.lastIndexOf("?")
              );

              this.copyFileToLocalDirPersonalizedChat(
                imgtype,
                correctPath,
                currentName,
                this.createFileName(),
                resolve,
                reject
              );
              //this.commonservice.presentToast(currentName + '\n' + correctPath);
            });
          } else {
            var currentName = imageData.substr(imageData.lastIndexOf("/") + 1);
            var correctPath = imageData.substr(
              0,
              imageData.lastIndexOf("/") + 1
            );

            this.copyFileToLocalDirPersonalizedChat(
              imgtype,
              correctPath,
              currentName,
              this.createFileName(),
              resolve,
              reject
            );
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  ImageUploadSecurityRounds(imgtype) {
    return new Promise((resolve, reject) => {
      var options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500,
        encodingType: this.camera.EncodingType.JPEG,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          var url =
            localStorage.getItem("endpoint") + appsettings.generic_image_upload;

          var filename = imageData;
          var targetPath;
          targetPath = imageData;

          let reqparam = {
            request: imgtype,
            millcode: this.userlist.millcode,
          };

          console.log(reqparam);

          var options = {
            fileKey: "upload_filename",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: reqparam,
          };
          console.log(reqparam);
          const fileTransfer: FileTransferObject = this.transfer.create();
          this.commonservice.presentLoading();
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options).then(
            (data) => {
              this.commonservice.dimmissLoading();
              var resultdata: any;
              resultdata = data;
              console.log(JSON.stringify(resultdata.response));
              resolve(resultdata);
            },
            (err) => {
              reject(err);
              this.commonservice.presentToast("Error while uploading file.");
            }
          );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  ImageUploadLeaveForm(imgtype) {
    return new Promise((resolve, reject) => {
      var options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500,
        encodingType: this.camera.EncodingType.JPEG,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          var url =
            localStorage.getItem("endpoint") + appsettings.generic_image_upload;

          var filename = imageData;
          var targetPath;
          targetPath = imageData;

          let reqparam = {
            request: imgtype,
            millcode: this.userlist.millcode,
          };

          console.log(reqparam);

          var options = {
            fileKey: "upload_filename",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: reqparam,
          };
          console.log(reqparam);
          const fileTransfer: FileTransferObject = this.transfer.create();
          this.commonservice.presentLoading();
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options).then(
            (data) => {
              this.commonservice.dimmissLoading();
              var resultdata: any;
              resultdata = data;
              console.log(JSON.stringify(resultdata.response));
              resolve(resultdata);
            },
            (err) => {
              reject(err);
              this.commonservice.presentToast("Error while uploading file.");
            }
          );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  ImageUploadMaintenancePlanning(imgtype) {
    return new Promise((resolve, reject) => {
      var options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500,
        encodingType: this.camera.EncodingType.JPEG,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          var url =
            localStorage.getItem("endpoint") + appsettings.generic_image_upload;

          var filename = imageData;
          var targetPath;
          targetPath = imageData;

          let reqparam = {
            request: imgtype,
            millcode: this.userlist.millcode,
          };

          console.log(reqparam);

          var options = {
            fileKey: "upload_filename",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: reqparam,
          };
          console.log(reqparam);
          const fileTransfer: FileTransferObject = this.transfer.create();
          this.commonservice.presentLoading();
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options).then(
            (data) => {
              this.commonservice.dimmissLoading();
              var resultdata: any;
              resultdata = data;
              console.log(JSON.stringify(resultdata.response));
              resolve(resultdata);
            },
            (err) => {
              reject(err);
              this.commonservice.presentToast("Error while uploading file.");
            }
          );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  ImageUploadBoiler(imgtype) {
    return new Promise((resolve, reject) => {
      var options = {
        quality: 80,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500,
        encodingType: this.camera.EncodingType.JPEG,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          var url =
            localStorage.getItem("endpoint") + appsettings.generic_image_upload;

          var filename = imageData;
          var targetPath;
          targetPath = imageData;

          let reqparam = {
            request: imgtype,
            millcode: this.userlist.millcode,
          };

          console.log(reqparam);

          var options = {
            fileKey: "upload_filename",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: reqparam,
          };
          console.log(reqparam);
          const fileTransfer: FileTransferObject = this.transfer.create();
          this.commonservice.presentLoading();
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options).then(
            (data) => {
              this.commonservice.dimmissLoading();
              var resultdata: any;
              resultdata = data;
              console.log(JSON.stringify(resultdata.response));
              resolve(resultdata);
            },
            (err) => {
              reject(err);
              this.commonservice.presentToast("Error while uploading file.");
            }
          );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  ImageUploadFFBSupplier(imgtype) {
    return new Promise((resolve, reject) => {
      var options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500,
        encodingType: this.camera.EncodingType.JPEG,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          var url =
            localStorage.getItem("endpoint") + appsettings.generic_image_upload;

          var filename = imageData;
          var targetPath;
          targetPath = imageData;

          let reqparam = {
            request: imgtype,
            millcode: this.userlist.millcode,
          };

          console.log(reqparam);

          var options = {
            fileKey: "upload_filename",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: reqparam,
          };
          console.log(reqparam);
          const fileTransfer: FileTransferObject = this.transfer.create();
          this.commonservice.presentLoading();
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options).then(
            (data) => {
              this.commonservice.dimmissLoading();
              var resultdata: any;
              resultdata = data;
              console.log(JSON.stringify(resultdata.response));
              resolve(resultdata);
            },
            (err) => {
              reject(err);
              this.commonservice.presentToast("Error while uploading file.");
            }
          );
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // presentAlert(title, message) {
  //   let alert = this.alertCtrl.create({
  //     title: title,
  //     subTitle: message,
  //     buttons: ["Dismiss"],
  //   });
  //   alert.present();
  // }

  async presentAlert(title, message) {
    const alert = await this.alertCtrl.create({
      cssClass: "my-custom-class",
      header: title,
      message: message,
      buttons: ["Dismiss"],
    });

    await alert.present();
  }

  VideoUploadSupervisor(imgtype) {
    return new Promise((resolve, reject) => {
      // const options: CameraOptions = {
      //   destinationType: this.camera.DestinationType.FILE_URI,
      //   mediaType: this.camera.MediaType.VIDEO,
      //   sourceType: this.camera.PictureSourceType.CAMERA,
      // };
      let options: CaptureVideoOptions = { limit: 1 };

      this.mediaCapture.captureVideo(options).then(
        (videoData: MediaFile[]) => {
          this.commonservice.imagepresentLoading();

          var i, path, len, videoUrl;
          for (i = 0, len = videoData.length; i < len; i += 1) {
            path = videoData[i].fullPath;
          }
          videoUrl = path;
          var url =
            localStorage.getItem("endpoint") + appsettings.generic_image_upload;

          var filename = videoUrl;
          var targetPath;
          targetPath = videoUrl;

          let reqparam = {
            request: imgtype,
            millcode: this.userlist.millcode,
          };

          //console.log(reqparam);

          var options = {
            fileKey: "upload_filename",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: reqparam,
          };

          //console.log(reqparam);

          const fileTransfer: FileTransferObject = this.transfer.create();
          // Use the FileTransfer to upload the image
          fileTransfer.upload(targetPath, url, options).then(
            (data) => {
              this.commonservice.dimmissLoading();

              var resultdata: any;
              resultdata = data;

              //console.log(JSON.stringify(resultdata.response));

              //this.commonservice.presentToast(JSON.stringify(resultdata.response));

              resolve(resultdata);
            },
            (err) => {
              this.commonservice.dimmissLoading();
              //console.log(JSON.stringify(err));
              reject(err);

              this.commonservice.presentToast("Error while uploading file.");

              //this.commonservice.presentToast(JSON.stringify(err));
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
}
