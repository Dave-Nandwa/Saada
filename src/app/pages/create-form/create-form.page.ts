import {
  FormService
} from './../../services/form.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  FormlyFieldConfig
} from '@ngx-formly/core';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  UserService
} from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.page.html',
  styleUrls: ['./create-form.page.scss'],
})
export class CreateFormPage implements OnInit {

  createForm = new FormGroup({
    type: new FormControl('None', [Validators.required]),
  });

  form = new FormGroup({});
  model = {
    email: 'email@gmail.com'
  };
  fields: FormlyFieldConfig[] = [];
  inputType: any;
  @ViewChild("myDiv", {
    static: true
  }) formView: ElementRef;

  inputOptions: any = ["Text", "Checkbox", "Textarea", "Dropdown", "Radio"];
  opt: any;

  userData: any;

  constructor(
    private elRef: ElementRef,
    private utils: UtilitiesService,
    private formService: FormService,
    private userService: UserService,
    private router: Router) {}

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.utils.presentLoading('Please wait...');
    this.userService.getUserProfile().then((userProfileSnapshot: any) => {
      console.log(userProfileSnapshot);
      if (userProfileSnapshot.data()) {
        this.userData = userProfileSnapshot.data();
      }
      this.utils.dismissLoading();
    }).catch((err) => {
      this.utils.dismissLoading();
      this.utils.handleError(err);
    });
  }


  submit(model) {
    console.log(model);
  }

  onTypeChange() {
    let choice = this.createForm.get('type').value;
    this.inputType = choice;
    this.evalChoice(choice);
    this.opt = 'Select';
  }

  evalChoice(c) {
    switch (c) {
      case "Text":
        this.createInput();
        this.opt = 'Add Field';
        break;
      case "Checkbox":
        this.createCheckbox();
        this.opt = 'Add Field';
        break;
      case "Dropdown":
        this.createDropdown();
        this.opt = 'Add Field';
        break;
      case "Radio":
        this.createRadio();
        this.opt = 'Add Field';
        break;
      case "Textarea":
        this.createTextarea();
        this.opt = 'Add Field';
        break;
    }
  }


  /* -------------------------------------------------------------------------- */
  /*                             Naked Form Builder                             */
  /* -------------------------------------------------------------------------- */


  /* ------------------------------- Input Text ------------------------------- */

  createInput() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="label" maxlength="10">
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Placeholder: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="placeholder" maxlength="10">
    </ion-input>
    </ion-item>
    <ion-button type="submit" (tap)="addInputToSchema()" class="ion-padding save">Save</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addInputToSchema.bind(this));
  }

  addInputToSchema() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let placeholder = ( < HTMLInputElement > document.querySelector('input[name=placeholder]')).value;
    this.fields.push({
      key: 'input',
      type: 'input',
      templateOptions: {
        label: label,
        placeholder: placeholder,
        required: true,
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Input Successfully', 'toast-success');
  }


  /* ------------------------------- Textarea ------------------------------- */

  createTextarea() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="label" maxlength="10">
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Placeholder: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="placeholder" maxlength="25">
    </ion-input>
    </ion-item>
    <ion-button type="submit" (tap)="addInputToSchema()" class="ion-padding save">Save</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addInputToSchema.bind(this));
  }

  addTextareaToSchema() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let placeholder = ( < HTMLInputElement > document.querySelector('input[name=placeholder]')).value;
    this.fields.push({
      key: 'textarea',
      type: 'textarea',
      templateOptions: {
        label: label,
        placeholder: placeholder,
        required: true,
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Textarea Successfully', 'toast-success');
  }



  /* -------------------------------- Checkbox -------------------------------- */

  createCheckbox() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="label" maxlength="15">
    </ion-input>
    </ion-item>
    <ion-button type="submit" (tap)="addInputToSchema()" class="ion-padding save">Save</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addCheckboxToSchema.bind(this));
  }

  addCheckboxToSchema() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    this.fields.push({
      key: 'checkbox',
      type: 'checkbox',
      templateOptions: {
        label: label,
      }
    });
    this.formView.nativeElement.innerHTML = "";
    this.utils.presentToast('Added Checkbox Successfuly.', 'toast-success');
  }

  /* -------------------------------- Dropdown -------------------------------- */

  createDropdown() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="label" maxlength="10">
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Placeholder: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="placeholder" maxlength="10">
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Number of Options: </ion-label>
    <ion-input type="number" placeholder="Enter Here" name="num" maxlength="15">
    </ion-input>
    </ion-item>
    <ion-button type="submit" (tap)="addInputToSchema()" class="ion-padding next">Next</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.next').addEventListener('click', this.addInputsForDropdown.bind(this));
  }

  addInputsForDropdown() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let placeholder = ( < HTMLInputElement > document.querySelector('input[name=placeholder]')).value;
    let numOfOptions = ( < HTMLInputElement > document.querySelector('input[name=num]')).value;
    this.formView.nativeElement.innerHTML = ``;
    for (let i = 0; i < parseInt(numOfOptions); i++) {
      this.formView.nativeElement.innerHTML += (`
      <ion-item lines="none">
      <ion-label>Option ${i+1}: </ion-label>
      <ion-input type="text" placeholder="Enter Here" name="label${i+1}" maxlength="10">
      </ion-input>
      </ion-item>`);
      console.log('Added.')
    }
    this.formView.nativeElement.innerHTML += (`<ion-button type="submit" class="ion-padding save">Save</ion-button>`);
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addDropdownToSchema.bind(this, label, placeholder, numOfOptions));
  }

  addDropdownToSchema(label, placeholder, numOfOptions) {
    let opts = [];
    for (let i = 0; i < parseInt(numOfOptions); i++) {
      let opt = ( < HTMLInputElement > document.querySelector(`input[name=label${i+1}]`)).value;
      opts.push({
        label: opt,
        value: opt
      });
    }

    /* -------------------------- Add it to the Schema -------------------------- */

    this.fields.push({
      key: 'select',
      type: 'select',
      templateOptions: {
        label: label,
        placeholder: placeholder,
        required: true,
        options: opts
      }
    });
    this.utils.presentToast('Added Dropdown Successfully.', 'toast-success');
  }







  /* -------------------------------- Radio -------------------------------- */

  createRadio() {
    this.formView.nativeElement.innerHTML = `
    <ion-item lines="none">
    <ion-label>Label: </ion-label>
    <ion-input type="text" placeholder="Enter Radio Label Here" name="label" maxlength="10">
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Placeholder: </ion-label>
    <ion-input type="text" placeholder="Enter Here" name="placeholder" maxlength="10">
    </ion-input>
    </ion-item>
    <ion-item lines="none">
    <ion-label>Number of Options: </ion-label>
    <ion-input type="number" placeholder="Enter Here" name="num" maxlength="15">
    </ion-input>
    </ion-item>
    <ion-button type="submit" (tap)="addInputToSchema()" class="ion-padding next">Next</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.next').addEventListener('click', this.addOptionsForRadio.bind(this));
  }

  addOptionsForRadio() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let placeholder = ( < HTMLInputElement > document.querySelector('input[name=placeholder]')).value;
    let numOfOptions = ( < HTMLInputElement > document.querySelector('input[name=num]')).value;
    this.formView.nativeElement.innerHTML = ``;
    for (let i = 0; i < parseInt(numOfOptions); i++) {
      this.formView.nativeElement.innerHTML += (`
      <ion-item lines="none">
      <ion-label>Option ${i+1}: </ion-label>
      <ion-input type="text" placeholder="Enter Here" name="label${i+1}" maxlength="10">
      </ion-input>
      </ion-item>`);
      console.log('Added.')
    }
    this.formView.nativeElement.innerHTML += (`<ion-button type="submit" class="ion-padding save">Save</ion-button>`);
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addRadioToSchema.bind(this, label, placeholder, numOfOptions));
  }

  addRadioToSchema(label, placeholder, numOfOptions) {
    let opts = [];
    for (let i = 0; i < parseInt(numOfOptions); i++) {
      let opt = ( < HTMLInputElement > document.querySelector(`input[name=label${i+1}]`)).value;
      opts.push({
        label: opt,
        value: opt
      });
    }

    /* -------------------------- Add it to the Schema -------------------------- */

    this.fields.push({
      key: 'radio',
      type: 'radio',
      templateOptions: {
        label: label,
        placeholder: placeholder,
        required: true,
        options: opts
      }
    });
    this.utils.presentToast('Added Radio Successfully.', 'toast-success');
  }


  uploadForm() {
    var dateTime = new Date().toLocaleString();
    this.formService.uploadNakedForm({
      nakedForm: JSON.stringify(this.fields),
      formName: ( <HTMLInputElement> document.querySelector('input[name=form_name]')).value,
      createdBy: `${this.userData.fullName} (${this.userData.email})`,
      createdOn: dateTime,
      userId: this.userData.userId,
      organization: this.userData.organization,
      division: this.userData.division,
      project: this.userData.project,
      orgId: this.userData.orgId
    }).then(() => {
      this.utils.presentAlert('Success', '', 'Your Custom Form was uploaded successfully and can now be used by all the users within this project.');
      this.router.navigate(['tabs/profile']);
    }).catch((err) => {
      this.utils.handleError(err);
    })
  }



}