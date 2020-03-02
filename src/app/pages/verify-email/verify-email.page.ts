
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {
  userData: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private utils: UtilitiesService
  ) { }

  ngOnInit() {
  }

  async checkVerified() {
    this.router.navigate(['login']);
  }

  sendVerificationEmail() {
    this.authService.sendEmailVerification().then(() => {
      this.utils.presentToast('Email Sent, Please check your inbox or spam folder.', 'toast-success');
    }).catch((err) => {
      this.utils.handleError(err);
    });
  }

}
