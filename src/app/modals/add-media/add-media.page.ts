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
} from '@ionic-native/Camera/ngx';
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
  userData: any;

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
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  closModal() {
    this.modalCtrl.dismiss({mediaFile: ''});
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
    snapshot.ref.getDownloadURL().then((url) => {
      this.utils.dismissLoading();
      this.modalCtrl.dismiss({mediaFile: url});
      this.utils.presentAlert('Success', '', 'Media File Uploaded Successfully. Please proceed with the completion of your Spot Report.');
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


}