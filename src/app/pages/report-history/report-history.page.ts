import {
  Component,
  OnInit
} from '@angular/core';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  FormService
} from 'src/app/services/form.service';
import {
  UserService
} from 'src/app/services/user.service';
import {
  DownloadService
} from 'src/app/services/download.service';
import {
  AlertController
} from '@ionic/angular';

@Component({
  selector: 'app-report-history',
  templateUrl: './report-history.page.html',
  styleUrls: ['./report-history.page.scss'],
})
export class ReportHistoryPage implements OnInit {
  noReports: boolean = true;
  userData: any;
  reports: any;
  filename: string = 'reports';
  constructor(
    private utils: UtilitiesService,
    private formService: FormService,
    private uServ: UserService,
    private download: DownloadService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getUserData();
  }

  async getUserData() {
    this.utils.presentLoading('Please wait...');
    this.uServ.getUserProfile().then((userProfileSnapshot: any) => {
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
        this.getReports();
      }
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }


  getReports() {
    this.formService.getUserNakedReports(this.userData.userId).subscribe((data) => {
      console.log(data);
      this.reports = data;
      this.utils.dismissLoading();
      this.noReports = false;
    }, (err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    })
  }

  downloadReports(reports) {
    this.download.downloadFile(this.filename, reports);
  }

  filterReports(id) {
    return this.reports.filter(x => x.formName === id);
  }

  async presentAlertRadio() {
    let opts = [];
    this.reports.forEach((r) => {
      opts.push({
        name: r.formName,
        type: 'radio',
        label: r.formName,
        value: r.formName
      });
    });
    //Remove Duplicate Options
    opts = Object.values(opts.reduce((acc,cur)=>Object.assign(acc,{[cur.name]:cur}),{}));
    const alert = await this.alertController.create({
      header: 'Of Which Form?',
      inputs: opts,
      buttons: [{
        text: 'Never Mind',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (id: any) => {
          let reportsToDownload = (this.filterReports(id));
          reportsToDownload.map((obj: any) => delete obj["position"]);
          this.downloadReports(reportsToDownload);
        }
      }]
    });
    return await alert.present();
  }
  
}