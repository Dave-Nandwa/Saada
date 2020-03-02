import {
  ModalController
} from '@ionic/angular';
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { 
  FormlyFieldConfig
} from '@ngx-formly/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  FormService
} from './../../services/form.service';
import {
  UtilitiesService
} from 'src/app/services/utilities.service';
import {
  Router
} from '@angular/router';
import {
  Geolocation
} from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder/ngx';


import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { HereService } from 'src/app/services/here.service';



@Component({
  selector: 'app-edit-ioi',
  templateUrl: './edit-ioi.page.html',
  styleUrls: ['./edit-ioi.page.scss'],
})
export class EditIoiPage implements OnInit {

  selectedForm;
  userData;
  lat;
  lng;
  physicalAddr;
  form = new FormGroup({});
  formModel: any = {};
  fields: FormlyFieldConfig[] = [];
  geo = geofirex.init(firebaseApp);

  /* -------------------------- FormBuilder Variables ------------------------- */
  createForm = new FormGroup({
    type: new FormControl('None', [Validators.required]),
  });

  inputType: any;
  @ViewChild("myDiv", {
    static: true
  }) formView: ElementRef;

  inputOptions: any = ["Text", "Checkbox", "Textarea", "Dropdown", "Radio"];
  opt: any;

  sioi: boolean = false;
  segment: any = 'form';



  constructor(
    private elRef: ElementRef,
    private formService: FormService,
    private utils: UtilitiesService,
    private router: Router,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private modalCtrl: ModalController,
    private hereService: HereService) {}

  ngOnInit() {
    this.fields = < FormlyFieldConfig[] > JSON.parse(this.selectedForm.nakedForm);
    console.log(this.selectedForm);
    this.sioi = this.selectedForm.public;
    console.log(this.fields);
    console.log(this.lat);
  }

  segmentChanged(e) {
    this.segment = (e.detail.value);
  }

  toggleCheckbox() {
    this.sioi = this.sioi === false ? true : false;
    console.log(this.sioi);
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

  onReorderItems(event) {
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
    let draggedItem = this.fields.splice(event.detail.from, 1)[0];
    this.fields.splice(event.detail.to, 0, draggedItem)
    //this.listItems = reorderArray(this.listItems, event.detail.from, event.detail.to);
    event.detail.complete();
  }

  deleteField(key) {
    this.fields.splice(this.fields.findIndex(function (i) {
      return i.key === key;
    }), 1);
    console.log(this.fields);
  }


  updateForm() {
    var dateTime = new Date().toLocaleString();
    const position = this.geo.point(this.lat, this.lng);
    this.formService.updateNakedForm({
      nakedForm: JSON.stringify(this.fields),
      formName: ( < HTMLInputElement > document.querySelector('ion-textarea[name=formName]')).value,
/*       address: {
        ...this.physicalAddr
      }, */
      when: dateTime
    }, this.selectedForm.formId).then(() => {
      this.utils.presentAlert('Success!', '', 'IOI Updated Successfully.').then(() => {
        this.modalCtrl.dismiss();
        this.router.navigateByUrl('/tabs/home');
      })
    }).catch((err) => {
      this.utils.handleError(err);
      console.log(err);
    });
    console.table(this.fields);
  }
 
  closeModal() {
    this.modalCtrl.dismiss();
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
    <ion-input type="text" placeholder="Enter Here" name="placeholder" maxlength="30">
    </ion-input>
    </ion-item>
    <ion-button type="submit" (tap)="addInputToSchema()" color="success" class="ion-padding save">Add</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addInputToSchema.bind(this));
  }

  addInputToSchema() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let placeholder = ( < HTMLInputElement > document.querySelector('input[name=placeholder]')).value;
    this.fields.push({
      key: this.capitalize(label.toLowerCase().trim()),
      type: 'input',
      templateOptions: {
        label: label,
        placeholder: placeholder
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
    <ion-button type="submit" (tap)="addInputToSchema()" color="success" class="ion-padding save">Add</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addTextareaToSchema.bind(this));
  }

  addTextareaToSchema() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    let placeholder = ( < HTMLInputElement > document.querySelector('input[name=placeholder]')).value;
    this.fields.push({
      key: this.capitalize(label.toLowerCase().trim()),
      type: 'textarea',
      templateOptions: {
        label: label,
        placeholder: placeholder
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
    <ion-button type="submit" (tap)="addInputToSchema()" color="success" class="ion-padding save">Add</ion-button>
    `;
    this.elRef.nativeElement.querySelector('.save').addEventListener('click', this.addCheckboxToSchema.bind(this));
  }

  addCheckboxToSchema() {
    let label = ( < HTMLInputElement > document.querySelector('input[name=label]')).value;
    this.fields.push({
      key: this.capitalize(label.toLowerCase().trim()),
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
    <ion-input type="text" placeholder="Enter Here" name="placeholder" maxlength="30">
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
    this.formView.nativeElement.innerHTML += (`<ion-button type="submit" color="success" class="ion-padding save">Add</ion-button>`);
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
      key: this.capitalize(label.toLowerCase().trim()),
      type: 'select',
      templateOptions: {
        label: label,
        placeholder: placeholder,
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
    this.formView.nativeElement.innerHTML += (`<ion-button type="submit" color="success" class="ion-padding save">Add</ion-button>`);
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
      key: this.capitalize(label.toLowerCase().trim()),
      type: 'radio',
      templateOptions: {
        label: label,
        placeholder: placeholder,
        options: opts
      }
    });
    this.utils.presentToast('Added Radio Successfully.', 'toast-success');
  }


  /* ---------------------------- Utility Functions --------------------------- */

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

}