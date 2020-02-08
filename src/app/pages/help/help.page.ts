import {
  Component,
  OnInit
} from '@angular/core';


/* ------------------------------ Form Imports ------------------------------ */
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  submitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    issue: new FormControl('', [Validators.required]),
  });

  constructor(private utils: UtilitiesService, private userService: UserService, private router: Router) {}

  ngOnInit() {}


  async getHelp() {
    try {
      let formData = this.submitForm.value;
      let issueData = {
        name: formData.name,
        email: formData.email,
        issue: formData.issue,
      };
      this.userService.helpRequest(issueData).then(() => {
        this.utils.presentToast("Thank you for taking the time to submit a support request, we've sent your request to our support team and they'll be in touch!", "toast-success").then(() => {
          this.router.navigate(['tabs/profile']);
        });
      });
    } catch (err) {
      console.log(err.message);
      this.utils.presentToast('There was a problem submitting your support request please check your inputs one more time.', 'toast-error');
    }

  }

}