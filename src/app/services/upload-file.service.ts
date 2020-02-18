import {
  Injectable
} from '@angular/core';
import * as firebase from 'firebase';
import { UtilitiesService } from './utilities.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  myPlans: any;
  mediaFiles: any;
  constructor(private utils: UtilitiesService, private afs: AngularFirestore) {
    this.myPlans = firebase.storage().ref('/my_plans');
    this.mediaFiles = firebase.storage().ref('/media_files');
  }

  makeFileIntoBlob(_imagePath, name, type) {

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      ( < any > window).resolveLocalFileSystemURL(_imagePath, (fileEntry: any) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], {
              type: type
            });
            imgBlob.name = name;
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            alert('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  getFileName(filestring) {

    let file
    file = filestring.replace(/^.*[\\\/]/, '')
    return file;
  }

  getFileExt(filestring) {
    let file = filestring.substr(filestring.lastIndexOf('.') + 1);
    return file;
  }

  getRequestFiles(userId): any {

    return this.myPlans.child('files');

  }

  async addFileToStorage(doc, name, folder, userId, file: any): Promise<void> {
    this.utils.presentLoading('Saving...');
    this.myPlans.child(file.filename)
      //Saves the file to storage
      .put(file.blob, {
        contentType: file.type
      }).then((savedFile) => {
        //Gets the file url and saves it in the database
        this.myPlans.child(`${file.filename}`).getDownloadURL().then((url)  => {
          // `url` is the download URL for 'images/stars.jpg'
          doc.files.push({
            file: file.filename,
            filename: name,
            ext: file.fileext,
            ocType: file.type,
            type: 'file',
            url: url,
            opened: 0
          });
          return this.afs.doc(`users/${userId}/my_plans/${folder}`).set(doc, {
            merge: true
          }).then(() => {
            this.utils.dismissLoading();
            this.utils.presentToast('File Saved.', 'toast-success');
          })
        }).catch((error) => {
          // Handle any errors
          this.utils.handleError(error);
          console.log(error);
        });
      })

  }

  async addFileGetUrl(userId, file: any): Promise<void> {
    var dateTime = new Date().toLocaleString();
    this.utils.presentLoading('Saving...');
    return this.mediaFiles.child(`${file.filename}`).put(file.blob, {
        contentType: file.type
    });
  }

  async updateCounter(userId, docs, folder) {
    return this.afs.doc(`users/${userId}/my_plans/${folder}`).set({
      files: docs
    }, { merge: true})
  }

}