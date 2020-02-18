import {
  UploadFileService
} from './../../services/upload-file.service';
import {
  ModalController
} from '@ionic/angular';
import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActionSheetController
} from '@ionic/angular';
/* -------------------------------------------------------------------------- */
/*                              Native Providers                              */
/* -------------------------------------------------------------------------- */

import {
  Camera,
  CameraOptions
} from '@ionic-native/camera/ngx';
import {
  File
} from '@ionic-native/file/ngx';
import {
  Crop
} from '@ionic-native/crop/ngx';

/* -------------------------------------------------------------------------- */
/*                                Firebase                                    */
/* -------------------------------------------------------------------------- */

import * as firebase from 'firebase';

/* -------------------------------- Services -------------------------------- */

import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  AngularFireStorage
} from '@angular/fire/storage';
import {
  FilePath
} from '@ionic-native/file-path/ngx';
import {
  FileChooser
} from '@ionic-native/file-chooser/ngx';


@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.page.html',
  styleUrls: ['./add-media.page.scss'],
})
export class AddMediaPage implements OnInit {

  fileUrl: any = "";
  uploadedImage: any = "";
  blobImage: any = "";
  isLoading = false;
  email = "";
  userId = "";
  userData;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };



  constructor(
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File,
    private crop: Crop,
    private utils: UtilitiesService,
    public modalCtrl: ModalController,
    private uploadFilesService: UploadFileService,
    private afStorage: AngularFireStorage,
    private filePath: FilePath,
    private fileChooser: FileChooser
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss({
      mediaFile: '',
      notes: 'None'
    });
  }


  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(imageData);
      this.cropImage(imageData)
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, {
        quality: 50
      })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0]);
          console.log('new image path is: ' + newPath);
        },
        error => {
          alert('Error cropping image' + error);
        }
      );
  }

  showCroppedImage(ImagePath) {
    this.isLoading = true;
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];
    this.file.readAsDataURL(filePath, imageName).then(async (base64) => {
      this.fileUrl = base64;
      this.blobImage = await this.dataURItoBlob(base64)
      this.upload();
      // this.isLoading = false;
    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });
  }

  dataURItoBlob(dataURI) {
    // codej adapted from:
    //  http://stackoverflow.com/questions/33486352/
    //cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/jpeg'
    });
  }

  upload() {
    var dateTime = new Date().toLocaleString();
    this.utils.presentLoading('Uploading...');
    if (this.blobImage) {
      var uploadTask = firebase.storage().ref().child(`media_files/${dateTime.trim()}-image.jpg`).put(this.blobImage);
      uploadTask.then(this.onSuccess, this.onError);
    }
  }



  //Callbacks for the upload task
  onSuccess = snapshot => {
    let notes = ( < HTMLInputElement > document.querySelector('ion-textarea[name=notes]')).value;
    if (notes.length <= 0) {
      notes = 'N/A'
    }
    snapshot.ref.getDownloadURL().then((url) => {
      this.utils.dismissLoading();
      this.modalCtrl.dismiss({
        mediaFile: url,
        notes: notes
      });
      this.utils.presentAlert('Success', '', 'Media File Uploaded Successfully. Please proceed with the completion of your IOI.');
    }).catch((err) => {
      this.utils.presentToast('There was a problem updating your profile, we think the image might be corrupted, please let us know if you have any issues.', 'toast-error')
      this.utils.dismissLoading();
    });
  };

  onError = error => {
    this.utils.dismissLoading();
    this.utils.presentToast('There was a problem uploading the media file.', 'toast-error');
    this.utils.handleError(error);
    console.log("error", error);
  };

  /* -------------------------------------------------------------------------- */
  /*                           New FIle Upload Method                           */
  /* -------------------------------------------------------------------------- */

  uploadUserFileAndGetUrl(file) {
    this.utils.presentLoading('Uploading File....');
    let notes = ( < HTMLInputElement > document.querySelector('ion-textarea[name=notes]')).value;
    if (notes.length <= 0) {
      notes = 'N/A'
    }
    this.uploadFilesService.addFileGetUrl(this.userData.userId, file)
      .then((savedFile) => {
        //Gets the file url and saves it in the database
        firebase.storage().ref('/media_files').child(`${file.filename}`).getDownloadURL().then((url) => {
          /* --------------- Dismiss Loader and Display Success message --------------- */
          this.utils.dismissLoading();
          this.utils.presentToast('File Upload Successful!', 'toast-success');
          /* -------------------- Dismiss and Modal and Parse Data -------------------- */
          this.modalCtrl.dismiss({
            mediaFile: url,
            notes: notes
          });
        }).catch((error) => {
          // Handle any errors
          this.utils.dismissLoading();
          this.utils.handleError(error);
          console.log(error);
        });
      }).catch((error) => {
        // Handle any errors
        this.utils.dismissLoading();
        this.utils.handleError(error);
        console.log(error);
      });
  }


  selectFile() {
    let file;
    this.fileChooser.open().then((uri) => {
      this.filePath.resolveNativePath(uri).then((fileentry) => {
        let filename = this.uploadFilesService.getFileName(fileentry);
        let fileext = this.uploadFilesService.getFileExt(fileentry);

        if (fileext == "pdf") {
          this.uploadFilesService.makeFileIntoBlob(fileentry, fileext, "application/pdf").then((fileblob) => {
            file = {
              blob: fileblob,
              type: "application/pdf",
              fileext: fileext,
              filename: filename
            }
            this.uploadUserFileAndGetUrl(file);
          })
        }

        if (fileext == "jpg") {
          this.uploadFilesService.makeFileIntoBlob(fileentry, fileext, "image/jpg").then((fileblob) => {
            file = {
              blob: fileblob,
              type: "image/jpg",
              fileext: fileext,
              filename: filename
            }
            this.uploadUserFileAndGetUrl(file);
          })
        }

        if (fileext == "png") {
          this.uploadFilesService.makeFileIntoBlob(fileentry, fileext, "image/png").then((fileblob) => {
            file = {
              blob: fileblob,
              type: "image/png",
              fileext: fileext,
              filename: filename
            }
            this.uploadUserFileAndGetUrl(file);
          })
        }

        if (fileext == "docx") {
          this.uploadFilesService.makeFileIntoBlob(fileentry, fileext, "application/vnd.openxmlformats-officedocument.wordprocessingml.document").then((fileblob) => {
            file = {
              blob: fileblob,
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              fileext: fileext,
              filename: filename
            }
            this.uploadUserFileAndGetUrl(file);
          })
        }
        if (fileext == "doc") {
          this.uploadFilesService.makeFileIntoBlob(fileentry, fileext, "application/msword").then((fileblob) => {
            file = {
              blob: fileblob,
              type: "application/msword",
              fileext: fileext,
              filename: filename
            }
            this.uploadUserFileAndGetUrl(file);
          });
        }
        if (fileext == 'docx') {
          this.uploadFilesService.makeFileIntoBlob(fileentry, fileext, "application/msword").then((fileblob) => {
            file = {
              blob: fileblob,
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              fileext: fileext,
              filename: filename
            }
            this.uploadUserFileAndGetUrl(file);
          });
        };
        if (fileext == "epub") {
          this.uploadFilesService.makeFileIntoBlob(fileentry, fileext, "application/octet-stream").then((fileblob) => {
            file = {
              blob: fileblob,
              type: "application/octet-stream",
              fileext: fileext,
              filename: filename
            }
            this.uploadUserFileAndGetUrl(file);
          })
        }
        if (fileext == "accdb") {
          this.uploadFilesService.makeFileIntoBlob(fileentry, filename, "application/msaccess").then((fileblob) => {
            file = {
              blob: fileblob,
              type: "application/msaccess",
              fileext: fileext,
              filename: filename
            }
            this.uploadUserFileAndGetUrl(file);
          })
        }
        if (fileext == "xlsx") {
          this.uploadFilesService.makeFileIntoBlob(fileentry, filename, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").then((fileblob) => {
            file = {
              blob: fileblob,
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              fileext: fileext,
              filename: filename
            }
            this.uploadUserFileAndGetUrl(file);
          })
        }
        /* else if (fileext !== "doc" || fileext !== "epub" || fileext !== "xlsx" || fileext !== "pdf" || fileext !== "accdb" || fileext !== "docx") {
                 this.utils.presentAlert('Unsupported File Type', '', 'Sorry that file type is not supported at the moment. If this is an important file please contact support and we will add it to the list of allowed files.');
               } */
      });
    })
  }

  getMimeType(fileExt) {
    if (fileExt == 'wav') return {
      type: 'audio/wav'
    };
    if (fileExt == 'mp3') return {
      type: 'audio/mp3'
    };
    else if (fileExt == 'jpg') return {
      type: 'image/jpg'
    };
    else if (fileExt == 'png') return {
      type: 'image/png'
    };
    else if (fileExt == 'mp4') return {
      type: 'video/mp4'
    };
    else if (fileExt == 'MOV') return {
      type: 'video/quicktime'
    };
    else if (fileExt == 'doc') return {
      type: 'application/msword'
    };
    else if (fileExt == 'docx') return {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    else if (fileExt == 'xls') return {
      type: 'application/vnd.ms-excel'
    };
    else if (fileExt == 'xlsx') return {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    else if (fileExt == 'pptx') return {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    };
  }


}