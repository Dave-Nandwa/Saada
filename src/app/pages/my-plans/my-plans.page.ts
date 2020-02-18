import {
  FilePath
} from '@ionic-native/file-path/ngx';
import {
  UploadFileService
} from './../../services/upload-file.service';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserService
} from 'src/app/services/user.service';
import {
  AlertController
} from '@ionic/angular';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import {
  FileChooser
} from '@ionic-native/file-chooser/ngx';

import * as firebase from 'firebase';
import {
  InAppBrowser
} from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-my-plans',
  templateUrl: './my-plans.page.html',
  styleUrls: ['./my-plans.page.scss'],
})
export class MyPlansPage implements OnInit {

  public items: any = [];
  folderName: any;
  fileName: any;
  userId: any;
  docId: any;
  userData: any;
  constructor(private uServ: UserService, private alertController: AlertController,
    private activatedRoute: ActivatedRoute, private router: Router,
    private utils: UtilitiesService,
    private afStorage: AngularFireStorage,
    private uploadFilesService: UploadFileService,
    private filePath: FilePath,
    private fileChooser: FileChooser,
    private iab: InAppBrowser) {
    this.items = [];
  }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getUserData();
  }

  async doRefresh(event) {
    this.items = [];
    await this.getFolders();
    event.target.complete();
  }


  openIab(folder, file) {
    const browser = this.iab.create(file.url);
    file.opened = file.opened ? file.opened += 1 : 1;
    const isFolder = (element) => element.docId === folder;
    const isFile = (element) => element.filename === file.filename;
    let fileIndex = (this.items.findIndex(isFile));
    let folderIndex = (this.items.findIndex(isFolder));
    //Find the File in the folder and update it
    this.items[folderIndex].files[fileIndex] = file;
    this.uploadFilesService.updateCounter(this.userId, this.items[folderIndex].files, folder);
  }

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  getFolders() {
    this.utils.presentLoading('');
    this.uServ.getUserPlans(this.userId).then((snap) => {
      snap.docs.map(doc => {
        this.items.push(doc.data());
      });
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.handleError(err);
    });
  }


  async getUserData() {
    this.items = [];
    this.utils.presentLoading('Please wait...');
    this.uServ.getUserProfile().then((userProfileSnapshot: any) => {
      this.utils.dismissLoading();
      this.getFolders();
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
      }
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }

  uploadFolder() {
    this.uServ.addFolder({
      folderName: this.folderName,
      expanded: false,
      files: []
    }, this.userId, '').then(() => {
      this.utils.presentToast('Folder Added Successfully', 'toast-success');
      this.getUserData();
    }).catch((err) => {
      this.utils.handleError(err)
    });
  }

  async addFolderName() {
    const alert = await this.alertController.create({
      header: 'Add Folder Name',
      inputs: [{
        name: 'fname',
        type: 'text',
        placeholder: 'Folder Name'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (data) => {
          this.folderName = data.fname;
          this.uploadFolder();
        }
      }]
    });

    await alert.present();
  }

  async chooseFileType(docID) {
    this.docId = docID;
    const alert = await this.alertController.create({
      header: 'File Type',
      inputs: [{
          name: 'radio1',
          type: 'radio',
          label: 'File',
          value: 'file',
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Url',
          value: 'link'
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (data: any) => {
          if (data === 'file') {
            this.uploadFile(this.docId);
          } else {
            this.uploadUrl(this.docId);
          }
        }
      }]
    });
    await alert.present();
  }

  async uploadUrl(folder) {
    console.log(this.docId);
    var dateTime = new Date().toLocaleString();
    const alert = await this.alertController.create({
      header: 'Add URL',
      inputs: [{
          name: 'fname',
          type: 'text',
          placeholder: 'File Name'
        },
        {
          name: 'furl',
          type: 'text',
          placeholder: 'Paste Url'
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (data) => {
          let filename = data.fname;
          let url = data.furl;
          let doc = this.items.find((doc) => doc.docId === this.docId);
          console.log(doc, this.docId);
          doc.files.push({
            type: 'url',
            link: url,
            filename: filename,
            when: dateTime,
            opened: 0
          });
          console.log(doc, folder);
          this.uServ.addFile(doc, this.userId, folder).then(() => {
            this.utils.presentToast('File Added Successfully', 'toast-success');
            this.getUserData();
          }).catch((err) => {
            console.log(err);
            this.utils.handleError(err);
          });
          console.log(doc);
        }
      }]
    });

    await alert.present();
  }

  async uploadFile(folder) {
    console.log(this.docId);
    var dateTime = new Date().toLocaleString();
    const alert = await this.alertController.create({
      header: 'Add File',
      inputs: [{
        name: 'fname',
        type: 'text',
        placeholder: 'File Name'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Select File',
        handler: (data) => {
          this.fileName = data.fname;
          let doc = this.items.find((doc) => doc.docId === this.docId);
          this.selectFile(doc, folder);
        }
      }]
    });

    await alert.present();
  }

  selectFile(doc, folder) {
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
            this.uploadFilesService.addFileToStorage(doc, this.fileName, folder, this.userId, file).then((res) => {
              console.log(res);
            });
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
            this.uploadFilesService.addFileToStorage(doc, this.fileName, folder, this.userId, file).then((res) => {
              console.log(res);
            });
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
            this.uploadFilesService.addFileToStorage(doc, this.fileName, folder, this.userId, file).then((res) => {
              console.log(res);
            });
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
            this.uploadFilesService.addFileToStorage(doc, this.fileName, folder, this.userId, file).then((res) => {
              console.log(res);
            });
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
            this.uploadFilesService.addFileToStorage(doc, this.fileName, folder, this.userId, file).then((res) => {
              console.log(res);
            });
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
            this.uploadFilesService.addFileToStorage(doc, this.fileName, folder, this.userId, file).then((res) => {
              console.log(res);
            });
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
            this.uploadFilesService.addFileToStorage(doc, this.fileName, folder, this.userId, file).then((res) => {
              console.log(res);
            });
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
            this.uploadFilesService.addFileToStorage(doc, this.fileName, folder, this.userId, file).then((res) => {
              console.log(res);
            });
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
            this.uploadFilesService.addFileToStorage(doc, this.fileName, folder, this.userId, file).then((res) => {
              console.log(res);
            });
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

  createLinkForURL(folder, file) {

    // Increment Opened
    file.opened = file.opened ? file.opened += 1 : 1;
    const isFolder = (element) => element.docId === folder;
    const isFile = (element) => element.filename === file.filename;
    let fileIndex = (this.items.findIndex(isFile));
    let folderIndex = (this.items.findIndex(isFolder));
    //Find the File in the folder and update it
    this.items[folderIndex].files[fileIndex] = file;
    this.uploadFilesService.updateCounter(this.userId, this.items[folderIndex].files, folder);


    var link = file.link;
    var element = document.createElement("a");
    element.setAttribute("href", link);
    element.setAttribute("target", "_blank");
    element.innerHTML = "your text";
    element.click();
    
  }

}